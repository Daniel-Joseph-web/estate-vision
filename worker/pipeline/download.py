"""Fetches source footage from S3 into per-job scratch space."""

from __future__ import annotations

import logging
import shutil
import tempfile
from pathlib import Path

import boto3
from botocore.exceptions import BotoCoreError, ClientError

from config import get_settings

logger = logging.getLogger(__name__)


class DownloadError(Exception):
    """Raised with a message safe to store on the video row and show a user."""


def _client():
    settings = get_settings()

    # The frontend presigns uploads against AWS_ENDPOINT (Cloudflare R2), so the
    # worker must read from the same endpoint or every key looks missing.
    if settings.aws_endpoint:
        return boto3.client(
            "s3",
            region_name=settings.aws_region,
            endpoint_url=settings.aws_endpoint,
        )

    return boto3.client("s3", region_name=settings.aws_region)


def create_workspace(video_id: str) -> Path:
    """Creates an isolated scratch directory for one job."""
    settings = get_settings()
    root = Path(settings.temp_dir)
    root.mkdir(parents=True, exist_ok=True)
    return Path(tempfile.mkdtemp(prefix=f"{video_id}-", dir=root))


def cleanup_workspace(workspace: Path) -> None:
    """Removes a job's scratch directory.

    Never raises: this runs in a `finally` block, and a cleanup failure must not
    mask the real error that sent us there.
    """
    try:
        shutil.rmtree(workspace, ignore_errors=True)
    except Exception:  # pragma: no cover - defensive
        logger.warning("Failed to clean workspace %s", workspace, exc_info=True)


def download_video(storage_key: str, workspace: Path) -> Path:
    """Downloads `storage_key` from the configured bucket into `workspace`.

    Returns the local path. Raises DownloadError with a plain-language message.
    """
    settings = get_settings()
    destination = workspace / Path(storage_key).name

    logger.info("Downloading s3://%s/%s", settings.s3_bucket, storage_key)

    try:
        _client().download_file(settings.s3_bucket, storage_key, str(destination))
    except ClientError as error:
        code = error.response.get("Error", {}).get("Code", "")
        if code in {"404", "NoSuchKey"}:
            raise DownloadError(
                "The uploaded file could not be found in storage. Upload it again."
            ) from error
        if code in {"403", "AccessDenied"}:
            raise DownloadError(
                "The worker is not permitted to read this file from storage."
            ) from error
        raise DownloadError("The video could not be retrieved from storage.") from error
    except BotoCoreError as error:
        raise DownloadError("The video could not be retrieved from storage.") from error

    if not destination.exists() or destination.stat().st_size == 0:
        raise DownloadError("The uploaded file is empty and cannot be processed.")

    logger.info("Downloaded %s bytes to %s", destination.stat().st_size, destination)
    return destination
