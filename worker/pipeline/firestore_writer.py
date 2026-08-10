"""Writes events and video status to Firestore.

Uses the Admin SDK, which bypasses security rules entirely. Every write
therefore carries an explicit user_id taken from the video document — the
worker is responsible for the tenant scoping that rules would otherwise
enforce.
"""

from __future__ import annotations

import json
import logging
from functools import lru_cache
from pathlib import Path
from typing import Any

import firebase_admin
from firebase_admin import credentials, firestore
from google.api_core.exceptions import GoogleAPIError

from config import get_settings

logger = logging.getLogger(__name__)

STATUS_PROCESSING = "processing"
STATUS_COMPLETE = "complete"
STATUS_FAILED = "failed"

VIDEOS = "videos"
EVENTS = "events"

# Firestore caps a WriteBatch at 500 operations.
MAX_BATCH_OPS = 500


class WriteError(Exception):
    """Raised when Firestore rejects a read or write."""


def _credentials() -> credentials.Certificate | None:
    """Builds Admin SDK credentials from FIREBASE_CREDENTIALS_JSON.

    The setting holds either a path to the service account file or the JSON
    itself — the latter is how it arrives from a secret manager, where there is
    no file to point at. Returns None to fall back to Application Default
    Credentials (GOOGLE_APPLICATION_CREDENTIALS, or the metadata server on GCP).
    """
    settings = get_settings()
    raw = settings.firebase_credentials_json.strip()

    if not raw:
        # Fall back to the same three discrete vars the frontend reads, so one
        # service account can be pasted into both .env files.
        if settings.firebase_private_key and settings.firebase_client_email:
            return credentials.Certificate(
                {
                    "type": "service_account",
                    "project_id": settings.firebase_project_id,
                    "client_email": settings.firebase_client_email,
                    "private_key": settings.firebase_private_key,
                    "token_uri": "https://oauth2.googleapis.com/token",
                }
            )
        return None

    if raw.startswith("{"):
        try:
            return credentials.Certificate(json.loads(raw))
        except (json.JSONDecodeError, ValueError) as error:
            raise WriteError(
                "FIREBASE_CREDENTIALS_JSON looks like JSON but could not be parsed."
            ) from error

    path = Path(raw)
    if not path.is_file():
        raise WriteError(
            f"FIREBASE_CREDENTIALS_JSON points at {raw}, which does not exist."
        )

    return credentials.Certificate(str(path))


@lru_cache(maxsize=1)
def _db():
    if not firebase_admin._apps:  # noqa: SLF001 - the documented way to check
        cert = _credentials()
        firebase_admin.initialize_app(cert) if cert else firebase_admin.initialize_app()

    return firestore.client()


def fetch_video(video_id: str) -> dict[str, Any] | None:
    """Loads the video document the frontend created, or None if it's gone."""
    try:
        snapshot = _db().collection(VIDEOS).document(video_id).get()
    except GoogleAPIError as error:
        raise WriteError(f"Could not read video {video_id}: {error}") from error

    if not snapshot.exists:
        return None

    data = snapshot.to_dict() or {}
    # The document ID is the video ID; it isn't duplicated in the fields.
    data["id"] = snapshot.id
    return data


def mark_processing(video_id: str) -> None:
    """Flips the document to processing as the job actually starts."""
    _update_video(video_id, {"status": STATUS_PROCESSING, "error_message": None})


def mark_complete(video_id: str, duration_seconds: int, event_count: int) -> None:
    """Marks the video done and records the counts the dashboard reads."""
    _update_video(
        video_id,
        {
            "status": STATUS_COMPLETE,
            "duration_seconds": duration_seconds,
            "event_count": event_count,
            "error_message": None,
        },
    )


def mark_failed(video_id: str, message: str) -> None:
    """Records a plain-language failure reason for the user."""
    _update_video(
        video_id,
        {
            # Shown verbatim in the UI; keep it short.
            "status": STATUS_FAILED,
            "error_message": message[:500],
        },
    )


def _update_video(video_id: str, patch: dict[str, Any]) -> None:
    try:
        _db().collection(VIDEOS).document(video_id).update(patch)
    except GoogleAPIError as error:
        raise WriteError(f"Could not update video {video_id}: {error}") from error


def delete_existing_events(video_id: str) -> None:
    """Clears prior events so a re-run can't double up the dashboard counts.

    Firestore has no DELETE WHERE, so this pages through matching documents and
    deletes them in bounded batches.
    """
    db = _db()

    try:
        query = db.collection(EVENTS).where("video_id", "==", video_id)
        deleted = 0

        while True:
            docs = list(query.limit(MAX_BATCH_OPS).stream())
            if not docs:
                break

            batch = db.batch()
            for document in docs:
                batch.delete(document.reference)
            batch.commit()

            deleted += len(docs)
            # A short final page means the collection is drained.
            if len(docs) < MAX_BATCH_OPS:
                break

        if deleted:
            logger.info("Cleared %s stale events for %s", deleted, video_id)

    except GoogleAPIError as error:
        raise WriteError(
            f"Could not clear old events for {video_id}: {error}"
        ) from error


def write_events(events: list[dict[str, Any]]) -> int:
    """Writes events in batches. Returns the number written."""
    if not events:
        return 0

    settings = get_settings()
    db = _db()
    collection = db.collection(EVENTS)

    # Never exceed Firestore's hard 500-op batch ceiling, whatever is configured.
    size = max(1, min(settings.write_batch_size, MAX_BATCH_OPS))
    written = 0

    for start in range(0, len(events), size):
        chunk = events[start : start + size]

        try:
            batch = db.batch()
            for event in chunk:
                # The event's own id is the document id, so a retried batch
                # overwrites rather than duplicating.
                batch.set(collection.document(event["id"]), event)
            batch.commit()
        except GoogleAPIError as error:
            raise WriteError(
                f"Could not write events batch {start // size + 1}: {error}"
            ) from error

        written += len(chunk)
        logger.info("Wrote %s/%s events", written, len(events))

    return written


def fetch_watchlist(user_id: str) -> list[dict[str, Any]]:
    """Loads all watchlist reference subjects belonging to the user."""
    try:
        snapshot = (
            _db()
            .collection("watchlist")
            .where("user_id", "==", user_id)
            .stream()
        )
        items = []
        for doc in snapshot:
            data = doc.to_dict()
            data["id"] = doc.id
            items.append(data)
        return items
    except GoogleAPIError as error:
        logger.warning("Could not fetch watchlist for user %s: %s", user_id, error)
        return []