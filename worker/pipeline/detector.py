"""YOLOv8 object detection over sampled frames."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from functools import lru_cache
import numpy as np

from ultralytics import YOLO

from config import get_settings
from pipeline.frame_sampler import Frame

logger = logging.getLogger(__name__)


class DetectionError(Exception):
    """Raised with a message safe to store on the video row and show a user."""


@dataclass(frozen=True)
class Detection:
    """One object found in one frame."""

    timestamp_seconds: int
    object_class: str
    confidence: float
    bbox: tuple[float, float, float, float]
    """[x, y, width, height], normalised to 0-1 against the frame size."""
    track_id: int | None = None
    """Unique identity assigned by the ByteTrack algorithm."""
    crop: np.ndarray | None = None
    """Raw BGR image array sliced from the bounding box."""


@lru_cache(maxsize=1)
def _model() -> YOLO:
    """Loads the model once per process."""
    settings = get_settings()
    logger.info("Loading YOLO model %s", settings.yolo_model)
    try:
        return YOLO(settings.yolo_model)
    except Exception as error:  # noqa: BLE001
        raise DetectionError(
            "The detection model could not be loaded. Contact your administrator."
        ) from error


def warm_up() -> None:
    """Pre-loads weights at startup so the first request isn't paying for it."""
    _model()


def detect(frame: Frame) -> list[Detection]:
    """Runs detection and tracking on a single frame."""
    settings = get_settings()

    try:
        results = _model().track(
            frame.image,
            conf=settings.min_confidence,
            persist=True,
            tracker="bytetrack.yaml",
            verbose=False,
        )
    except Exception as error:  # noqa: BLE001
        raise DetectionError("Detection failed while analysing this video.") from error

    height, width = frame.image.shape[:2]
    if not height or not width:
        return []

    detections: list[Detection] = []

    for result in results:
        names = result.names
        boxes = getattr(result, "boxes", None)
        if boxes is None:
            continue

        track_ids = boxes.id.int().tolist() if boxes.id is not None else [None] * len(boxes)

        for box, track_id in zip(boxes, track_ids):
            confidence = float(box.conf[0])
            if confidence < settings.min_confidence:
                continue

            x1, y1, x2, y2 = (float(value) for value in box.xyxy[0])
            class_id = int(box.cls[0])

            # ✂️ Slice the exact bounding box out of the raw frame array
            x1_int, y1_int = max(0, int(x1)), max(0, int(y1))
            x2_int, y2_int = min(width, int(x2)), min(height, int(y2))
            
            crop_img = None
            if x2_int > x1_int and y2_int > y1_int:
                crop_img = frame.image[y1_int:y2_int, x1_int:x2_int].copy()

            detections.append(
                Detection(
                    timestamp_seconds=frame.timestamp_seconds,
                    object_class=str(names.get(class_id, f"class_{class_id}")),
                    confidence=round(confidence, 4),
                    bbox=(
                        round(max(x1, 0.0) / width, 4),
                        round(max(y1, 0.0) / height, 4),
                        round(min(x2 - x1, float(width)) / width, 4),
                        round(min(y2 - y1, float(height)) / height, 4),
                    ),
                    track_id=track_id,
                    crop=crop_img, # Save the image data!
                )
            )

    return detections