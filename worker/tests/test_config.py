"""Config contract tests.

The worker's 500 came from `firestore_writer` reading a setting name that
`config.Settings` never defined. Nothing failed at import or boot — it only blew
up on the first request. These tests assert the field names the writer actually
uses, so that class of drift fails here instead of in production.
"""

from __future__ import annotations

import pytest
from pydantic import ValidationError


def test_settings_expose_every_field_the_writer_reads(settings):
    # firestore_writer._credentials() and download._client() read exactly these.
    for field in (
        "firebase_credentials_json",
        "firebase_project_id",
        "firebase_client_email",
        "firebase_private_key",
        "s3_bucket",
        "aws_region",
        "aws_endpoint",
        "write_batch_size",
    ):
        assert hasattr(settings, field), f"Settings is missing {field}"


def test_no_supabase_settings_remain(settings):
    """Supabase is gone; a lingering field would invite the old code path back."""
    for field in dir(settings):
        assert "supabase" not in field.lower()


def test_short_worker_secret_is_rejected(monkeypatch):
    """A guessable shared secret is the whole of the worker's authentication."""
    import config

    monkeypatch.setenv("WORKER_SECRET", "tooshort")
    config.get_settings.cache_clear()

    with pytest.raises(ValidationError):
        config.get_settings()


def test_write_batch_size_is_capped_at_firestore_limit(monkeypatch):
    """Firestore rejects a batch over 500 ops outright."""
    import config

    monkeypatch.setenv("WRITE_BATCH_SIZE", "5000")
    config.get_settings.cache_clear()

    assert config.get_settings().write_batch_size == 500


def test_private_key_newlines_are_unescaped(monkeypatch):
    """.env round-trips newlines as the literal characters `\\n`."""
    import config

    monkeypatch.setenv("FIREBASE_PRIVATE_KEY", "-----BEGIN-----\\nabc\\n-----END-----")
    config.get_settings.cache_clear()

    key = config.get_settings().firebase_private_key
    assert "\\n" not in key
    assert key.count("\n") == 2
