"""Firestore writer tests.

`_db()` is replaced with a fake so nothing touches a real project. The fake is
deliberately strict about Firestore's rules — 500 ops per batch, no DELETE WHERE
— because those are the constraints the code exists to handle.
"""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from pipeline import firestore_writer as writer


class FakeDocument:
    def __init__(self, doc_id, data, exists=True):
        self.id = doc_id
        self._data = data
        self.exists = exists
        self.reference = self

    def to_dict(self):
        return dict(self._data)

    def get(self):
        return self


class FakeBatch:
    """Mirrors Firestore's hard 500-operation ceiling."""

    def __init__(self, store):
        self._store = store
        self._ops = []

    def set(self, ref, data):
        self._ops.append(("set", ref, data))
        if len(self._ops) > writer.MAX_BATCH_OPS:
            raise AssertionError("batch exceeded Firestore's 500-op limit")

    def delete(self, ref):
        self._ops.append(("delete", ref, None))
        if len(self._ops) > writer.MAX_BATCH_OPS:
            raise AssertionError("batch exceeded Firestore's 500-op limit")

    def commit(self):
        for kind, ref, data in self._ops:
            if kind == "set":
                self._store[ref.id] = data
            else:
                self._store.pop(ref.id, None)
        self._ops = []


class FakeQuery:
    def __init__(self, docs):
        self._docs = docs
        self._limit = None

    def limit(self, n):
        clone = FakeQuery(self._docs)
        clone._limit = n
        return clone

    def stream(self):
        return iter(self._docs[: self._limit] if self._limit else self._docs)


class FakeCollection:
    def __init__(self, store):
        self.store = store

    def document(self, doc_id=None):
        if doc_id is None:
            doc_id = f"auto_{len(self.store)}"
        return FakeDocument(doc_id, self.store.get(doc_id, {}), doc_id in self.store)

    def where(self, field, _op, value):
        return FakeQuery(
            [
                FakeDocument(k, v)
                for k, v in list(self.store.items())
                if v.get(field) == value
            ]
        )


class FakeDb:
    def __init__(self):
        self.collections = {"videos": {}, "events": {}}

    def collection(self, name):
        return FakeCollection(self.collections.setdefault(name, {}))

    def batch(self):
        return FakeBatch(self._active_store)

    def set_active(self, name):
        self._active_store = self.collections[name]


@pytest.fixture
def db(monkeypatch):
    fake = FakeDb()
    fake.set_active("events")
    monkeypatch.setattr(writer, "_db", lambda: fake)
    return fake


# --- credentials ---------------------------------------------------------


def test_credentials_parse_inline_json(monkeypatch, tmp_path):
    """A secret manager supplies the JSON itself, not a file path."""
    captured = {}

    class FakeCert:
        def __init__(self, value):
            captured["value"] = value

    monkeypatch.setattr(writer.credentials, "Certificate", FakeCert)
    monkeypatch.setenv("FIREBASE_CREDENTIALS_JSON", json.dumps({"type": "service_account"}))

    import config

    config.get_settings.cache_clear()
    writer._credentials()

    assert captured["value"] == {"type": "service_account"}


def test_credentials_accept_a_file_path(monkeypatch, tmp_path):
    captured = {}

    class FakeCert:
        def __init__(self, value):
            captured["value"] = value

    key_file = tmp_path / "service-account.json"
    key_file.write_text("{}", encoding="utf-8")

    monkeypatch.setattr(writer.credentials, "Certificate", FakeCert)
    monkeypatch.setenv("FIREBASE_CREDENTIALS_JSON", str(key_file))

    import config

    config.get_settings.cache_clear()
    writer._credentials()

    assert captured["value"] == str(key_file)


def test_credentials_reject_a_missing_file_with_a_clear_message(monkeypatch):
    monkeypatch.setenv("FIREBASE_CREDENTIALS_JSON", "/no/such/service-account.json")

    import config

    config.get_settings.cache_clear()

    with pytest.raises(writer.WriteError, match="does not exist"):
        writer._credentials()


def test_credentials_fall_back_to_discrete_vars(monkeypatch):
    """One service account should be pasteable into both .env files."""
    captured = {}

    class FakeCert:
        def __init__(self, value):
            captured["value"] = value

    monkeypatch.setattr(writer.credentials, "Certificate", FakeCert)
    monkeypatch.setenv("FIREBASE_CREDENTIALS_JSON", "")
    monkeypatch.setenv("FIREBASE_PRIVATE_KEY", "-----BEGIN-----\\nkey\\n-----END-----")

    import config

    config.get_settings.cache_clear()
    writer._credentials()

    assert captured["value"]["project_id"] == "test-project"
    # The newlines must be real, or the Admin SDK rejects the key.
    assert "\\n" not in captured["value"]["private_key"]


def test_credentials_return_none_when_nothing_is_configured(monkeypatch):
    """Falls through to Application Default Credentials on GCP."""
    monkeypatch.setenv("FIREBASE_CREDENTIALS_JSON", "")
    monkeypatch.setenv("FIREBASE_PRIVATE_KEY", "")
    monkeypatch.setenv("FIREBASE_CLIENT_EMAIL", "")

    import config

    config.get_settings.cache_clear()
    assert writer._credentials() is None


# --- reads and writes ----------------------------------------------------


def test_fetch_video_returns_none_when_absent(db):
    assert writer.fetch_video("nope") is None


def test_fetch_video_injects_the_document_id(db):
    db.collections["videos"]["vid_1"] = {"user_id": "u1", "storage_key": "u1/vid_1/a.mp4"}

    video = writer.fetch_video("vid_1")

    # main.py reads video["id"]; the field isn't stored on the document.
    assert video["id"] == "vid_1"
    assert video["user_id"] == "u1"


def test_write_events_is_a_no_op_for_an_empty_list(db):
    assert writer.write_events([]) == 0


def test_write_events_uses_the_event_id_as_the_document_id(db):
    """A retried batch must overwrite rather than duplicate."""
    db.set_active("events")
    events = [{"id": "e1", "video_id": "v1", "user_id": "u1"}]

    assert writer.write_events(events) == 1

    writer.write_events(events)
    assert len(db.collections["events"]) == 1


def test_write_events_chunks_past_the_500_op_ceiling(db):
    """FakeBatch raises if a single commit exceeds 500 ops."""
    db.set_active("events")
    events = [{"id": f"e{i}", "video_id": "v1", "user_id": "u1"} for i in range(1200)]

    assert writer.write_events(events) == 1200
    assert len(db.collections["events"]) == 1200


def test_status_helpers_clear_the_error_message(db, monkeypatch):
    """A retry that succeeds must not leave the old failure text on screen."""
    patches = []
    monkeypatch.setattr(writer, "_update_video", lambda vid, patch: patches.append(patch))

    writer.mark_processing("v1")
    writer.mark_complete("v1", duration_seconds=60, event_count=3)

    assert patches[0]["error_message"] is None
    assert patches[1]["error_message"] is None
    assert patches[1]["status"] == writer.STATUS_COMPLETE


def test_mark_failed_truncates_long_messages(db, monkeypatch):
    """The column is rendered verbatim in the UI."""
    patches = []
    monkeypatch.setattr(writer, "_update_video", lambda vid, patch: patches.append(patch))

    writer.mark_failed("v1", "x" * 900)

    assert len(patches[0]["error_message"]) == 500