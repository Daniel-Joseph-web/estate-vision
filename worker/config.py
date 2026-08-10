"""Runtime configuration, loaded once from the environment."""

from __future__ import annotations

import os
from functools import lru_cache

from dotenv import load_dotenv
from pydantic import BaseModel, Field

load_dotenv()


class Settings(BaseModel):
    """Every knob the worker reads. Missing required values fail at startup."""

    # --- Auth -------------------------------------------------------------
    # Shared secret the frontend sends as X-Worker-Secret.
    worker_secret: str = Field(min_length=16)

    # --- Firebase ---------------------------------------------------------
    # Service account JSON file path or JSON string for the Admin SDK.
    firebase_credentials_json: str = ""
    # Discrete credential parts, the same three the frontend uses. Either these
    # or firebase_credentials_json must be set, otherwise the Admin SDK falls
    # back to Application Default Credentials.
    firebase_project_id: str = ""
    firebase_client_email: str = ""
    firebase_private_key: str = ""

    # --- Object storage ---------------------------------------------------
    s3_bucket: str
    aws_region: str
    # Custom S3 endpoint. Required for Cloudflare R2, which the frontend
    # presigns uploads against; empty means real Amazon S3.
    aws_endpoint: str = ""

    # --- Pipeline ---------------------------------------------------------
    # Frames sampled per second of footage.
    sample_fps: float = 1.0
    # Ultralytics model name or path. yolov8n is the small/fast default.
    yolo_model: str = "yolov8n.pt"
    # Detections below this confidence are discarded.
    min_confidence: float = 0.35
    # Rows per Firestore batch write (hard limit is 500).
    write_batch_size: int = 500
    # Refuse videos longer than this, to bound worst-case processing time.
    max_duration_seconds: int = 4 * 60 * 60
    # Parent directory for per-job scratch space.
    temp_dir: str = "/tmp/estatevision"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    """Cached settings. Raises pydantic.ValidationError if anything required is unset."""
    return Settings(
        worker_secret=os.getenv("WORKER_SECRET", ""),
        firebase_credentials_json=os.getenv("FIREBASE_CREDENTIALS_JSON", ""),
        firebase_project_id=os.getenv("FIREBASE_PROJECT_ID", ""),
        firebase_client_email=os.getenv("FIREBASE_CLIENT_EMAIL", ""),
        # Newlines survive .env round-trips as the literal two characters `\n`.
        firebase_private_key=os.getenv("FIREBASE_PRIVATE_KEY", "").replace("\\n", "\n"),
        s3_bucket=os.getenv("S3_BUCKET", ""),
        aws_region=os.getenv("AWS_REGION", "us-east-1"),
        aws_endpoint=os.getenv("AWS_ENDPOINT", ""),
        sample_fps=float(os.getenv("SAMPLE_FPS", "1.0")),
        yolo_model=os.getenv("YOLO_MODEL", "yolov8n.pt"),
        min_confidence=float(os.getenv("MIN_CONFIDENCE", "0.35")),
        write_batch_size=min(int(os.getenv("WRITE_BATCH_SIZE", "500")), 500),
        max_duration_seconds=int(os.getenv("MAX_DURATION_SECONDS", str(4 * 60 * 60))),
        temp_dir=os.getenv("TEMP_DIR", "/tmp/estatevision"),
    )
