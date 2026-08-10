"""Endpoint contract tests.

Runs the real FastAPI app through TestClient with the writer and pipeline faked
out, so the request/response contract the frontend depends on is verified
without a Firestore project or a GPU.
"""

from __future__ import annotations

import pytest
from fastapi.testclient import TestClient

from tests.conftest import FAKE_ENV

SECRET = FAKE_ENV["WORKER_SECRET"]

VIDEO = {
    "id": "vid_1",
    "user_id": "user_1",
    "storage_key": "user_1/vid_1/clip.mp4",
    "status": "queued",
}


@pytest.fixture
def client(monkeypatch):
    """App instance with the model warm-up and every writer call stubbed."""
    import main
    from pipeline import detector

    monkeypatch.setattr(detector, "warm_up", lambda: None)
    monkeypatch.setattr(main.detector, "warm_up", lambda: None)
    # Nothing should reach the pipeline; a request that does is a bug.
    monkeypatch.setattr(main, "run_pipeline", lambda **kwargs: None)

    with TestClient(main.app) as test_client:
        yield test_client


def test_health_needs_no_secret(client):
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


def test_process_video_rejects_a_missing_secret(client):
    response = client.post("/process-video", json={"video_id": "vid_1"})

    assert response.status_code == 401


def test_process_video_rejects_a_wrong_secret(client):
    response = client.post(
        "/process-video",
        json={"video_id": "vid_1"},
        headers={"X-Worker-Secret": "wrong-but-long-enough-value"},
    )

    assert response.status_code == 401


def test_process_video_accepts_a_valid_job(client, monkeypatch):
    """The frontend's startProcessing treats any non-2xx as a failed handoff."""
    import main

    monkeypatch.setattr(main.writer, "fetch_video", lambda _id: dict(VIDEO))

    response = client.post(
        "/process-video",
        json={"video_id": "vid_1"},
        headers={"X-Worker-Secret": SECRET},
    )

    assert response.status_code == 202
    assert response.json() == {"accepted": True, "video_id": "vid_1"}


def test_unknown_video_is_404_not_500(client, monkeypatch):
    import main

    monkeypatch.setattr(main.writer, "fetch_video", lambda _id: None)

    response = client.post(
        "/process-video",
        json={"video_id": "ghost"},
        headers={"X-Worker-Secret": SECRET},
    )

    assert response.status_code == 404


def test_video_without_a_storage_key_is_409(client, monkeypatch):
    """The upload never finished, so there is nothing to download yet."""
    import main

    monkeypatch.setattr(
        main.writer, "fetch_video", lambda _id: {**VIDEO, "storage_key": ""}
    )

    response = client.post(
        "/process-video",
        json={"video_id": "vid_1"},
        headers={"X-Worker-Secret": SECRET},
    )

    assert response.status_code == 409


def test_empty_video_id_is_a_validation_error(client):
    response = client.post(
        "/process-video",
        json={"video_id": ""},
        headers={"X-Worker-Secret": SECRET},
    )

    assert response.status_code == 422


def test_the_worker_imports_the_firestore_writer():
    """Regression: main imported supabase_writer, which 500'd on every request."""
    import main
    from pipeline import firestore_writer

    assert main.writer is firestore_writer


def test_run_pipeline_marks_failed_without_raising(monkeypatch):
    """It runs detached from the request; an escaping exception strands the row."""
    import main

    calls = {}

    monkeypatch.setattr(main.writer, "mark_processing", lambda _id: None)
    monkeypatch.setattr(
        main.writer, "mark_failed", lambda vid, msg: calls.setdefault("failed", msg)
    )
    monkeypatch.setattr(
        main.download,
        "create_workspace",
        lambda _id: (_ for _ in ()).throw(RuntimeError("disk full")),
    )

    main.run_pipeline(video_id="v1", user_id="u1", storage_key="u1/v1/a.mp4")

    assert "failed" in calls
    # The message reaches the UI verbatim, so it must not be a stack trace.
    assert "Traceback" not in calls["failed"]
