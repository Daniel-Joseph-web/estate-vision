"""Storage tests.

The frontend presigns uploads against Cloudflare R2 (AWS_ENDPOINT). If the
worker builds a plain-S3 client it talks to Amazon instead, and every key looks
missing — a silent failure that reads as "the upload never completed".
"""

from __future__ import annotations

import pytest

from pipeline import download


def test_client_passes_the_r2_endpoint(monkeypatch, settings):
    captured = {}

    def fake_client(service, **kwargs):
        captured["service"] = service
        captured.update(kwargs)
        return object()

    monkeypatch.setattr(download.boto3, "client", fake_client)
    download._client()

    assert captured["service"] == "s3"
    assert captured["endpoint_url"] == "https://example.r2.cloudflarestorage.com"
    assert captured["region_name"] == "auto"


def test_client_omits_the_endpoint_for_real_s3(monkeypatch):
    """An empty AWS_ENDPOINT must not be passed through as a URL."""
    import config

    monkeypatch.setenv("AWS_ENDPOINT", "")
    config.get_settings.cache_clear()

    captured = {}

    def fake_client(service, **kwargs):
        captured.update(kwargs)
        return object()

    monkeypatch.setattr(download.boto3, "client", fake_client)
    download._client()

    assert "endpoint_url" not in captured


def test_workspace_round_trip(settings, tmp_path, monkeypatch):
    import config

    monkeypatch.setenv("TEMP_DIR", str(tmp_path))
    config.get_settings.cache_clear()

    workspace = download.create_workspace("vid_1")
    assert workspace.is_dir()

    download.cleanup_workspace(workspace)
    assert not workspace.exists()


def test_cleanup_never_raises(settings, tmp_path):
    """It runs in a finally block; raising would mask the real error."""
    download.cleanup_workspace(tmp_path / "was-never-created")


def test_missing_key_reports_a_reupload_message(monkeypatch, settings, tmp_path):
    from botocore.exceptions import ClientError

    class FakeS3:
        def download_file(self, *_args, **_kwargs):
            raise ClientError({"Error": {"Code": "NoSuchKey"}}, "GetObject")

    monkeypatch.setattr(download, "_client", lambda: FakeS3())

    with pytest.raises(download.DownloadError, match="Upload it again"):
        download.download_video("u1/v1/a.mp4", tmp_path)


def test_access_denied_is_distinguished_from_a_missing_object(
    monkeypatch, settings, tmp_path
):
    """These need different messages: one is the user's problem, one is ours."""
    from botocore.exceptions import ClientError

    class FakeS3:
        def download_file(self, *_args, **_kwargs):
            raise ClientError({"Error": {"Code": "AccessDenied"}}, "GetObject")

    monkeypatch.setattr(download, "_client", lambda: FakeS3())

    with pytest.raises(download.DownloadError, match="not permitted"):
        download.download_video("u1/v1/a.mp4", tmp_path)


def test_empty_download_is_rejected(monkeypatch, settings, tmp_path):
    """A zero-byte object would fail later in OpenCV with a worse message."""

    class FakeS3:
        def download_file(self, _bucket, _key, destination):
            open(destination, "wb").close()

    monkeypatch.setattr(download, "_client", lambda: FakeS3())

    with pytest.raises(download.DownloadError, match="empty"):
        download.download_video("u1/v1/a.mp4", tmp_path)
