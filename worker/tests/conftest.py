"""Shared fixtures.

Every test runs against a fully-populated fake environment so nothing here ever
reaches Firestore, R2, or the network. `get_settings` is lru_cached, so the env
must be set before the first call and the cache cleared between tests that
change it.
"""

from __future__ import annotations

import sys
from pathlib import Path

import pytest

# The worker runs with its own directory on the path; mirror that for imports.
sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

FAKE_ENV = {
    "WORKER_SECRET": "test-secret-at-least-16-chars",
    "FIREBASE_CREDENTIALS_JSON": "",
    "FIREBASE_PROJECT_ID": "test-project",
    "FIREBASE_CLIENT_EMAIL": "svc@test-project.iam.gserviceaccount.com",
    "FIREBASE_PRIVATE_KEY": "",
    "S3_BUCKET": "test-bucket",
    "AWS_REGION": "auto",
    "AWS_ACCESS_KEY_ID": "test-key",
    "AWS_SECRET_ACCESS_KEY": "test-secret",
    "AWS_ENDPOINT": "https://example.r2.cloudflarestorage.com",
    "SAMPLE_FPS": "1.0",
    "MIN_CONFIDENCE": "0.35",
    "WRITE_BATCH_SIZE": "500",
    "MAX_DURATION_SECONDS": "14400",
}


@pytest.fixture(autouse=True)
def fake_env(monkeypatch):
    """Points config at test values and drops the settings cache around each test."""
    import config

    for key, value in FAKE_ENV.items():
        monkeypatch.setenv(key, value)

    config.get_settings.cache_clear()
    yield
    config.get_settings.cache_clear()


@pytest.fixture
def settings(fake_env):
    from config import get_settings

    return get_settings()
