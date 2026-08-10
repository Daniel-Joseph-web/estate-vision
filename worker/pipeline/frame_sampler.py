"""Decodes footage and yields frames at a fixed sampling rate."""

from __future__ import annotations

import logging
from dataclasses import dataclass
from pathlib import Path
from typing import Iterator

import cv2
import numpy as np

from config import get_settings

logger = logging.getLogger(__name__)


class SamplingError(Exception):
    """Raised with a message safe to store on the video row and show a user."""


@dataclass(frozen=True)
class Frame:
    """One sampled frame and where it sits in the recording."""

    index: int
    """Sequential index across sampled frames, starting at 0."""

    timestamp_seconds: int
    """Whole-second offset into the video."""

    image: np.ndarray
    """BGR image as decoded by OpenCV."""


@dataclass(frozen=True)
class VideoMetadata:
    duration_seconds: int
    native_fps: float
    frame_count: int
    width: int
    height: int


def probe(path: Path) -> VideoMetadata:
    """Reads container metadata without decoding the whole file."""
    capture = cv2.VideoCapture(str(path))
    if not capture.isOpened():
        capture.release()
        raise SamplingError(
            "This file couldn't be opened as a video. Re-export it as MP4, MOV or AVI "
            "and upload it again."
        )

    try:
        native_fps = float(capture.get(cv2.CAP_PROP_FPS) or 0.0)
        frame_count = int(capture.get(cv2.CAP_PROP_FRAME_COUNT) or 0)
        width = int(capture.get(cv2.CAP_PROP_FRAME_WIDTH) or 0)
        height = int(capture.get(cv2.CAP_PROP_FRAME_HEIGHT) or 0)
    finally:
        capture.release()

    # Variable-frame-rate and some remuxed files report 0 or absurd values.
    if not 0 < native_fps < 1000:
        raise SamplingError(
            "This file's frame rate couldn't be read, so it can't be analysed. "
            "Re-export the clip and upload it again."
        )

    duration = int(frame_count / native_fps) if frame_count > 0 else 0

    return VideoMetadata(
        duration_seconds=duration,
        native_fps=native_fps,
        frame_count=frame_count,
        width=width,
        height=height,
    )


def sample_frames(path: Path, metadata: VideoMetadata) -> Iterator[Frame]:
    """Yields frames at `settings.sample_fps` (1 fps by default).

    Frames are yielded lazily so a long recording never holds more than one
    decoded image in memory at a time.
    """
    settings = get_settings()
    step = max(int(round(metadata.native_fps / settings.sample_fps)), 1)

    capture = cv2.VideoCapture(str(path))
    if not capture.isOpened():
        capture.release()
        raise SamplingError("This file couldn't be opened as a video.")

    logger.info(
        "Sampling every %s frame(s) from %.2f fps source (%s frames)",
        step,
        metadata.native_fps,
        metadata.frame_count,
    )

    sampled = 0
    position = 0

    try:
        while True:
            # Sequential reads with a modulo skip: seeking per sample is far
            # slower on long files and unreliable on VFR sources.
            ok, image = capture.read()
            if not ok:
                break

            if position % step == 0:
                yield Frame(
                    index=sampled,
                    timestamp_seconds=int(position / metadata.native_fps),
                    image=image,
                )
                sampled += 1

            position += 1
    finally:
        capture.release()

    if sampled == 0:
        raise SamplingError(
            "No frames could be read from this file. It may be corrupt — "
            "re-export the clip and upload it again."
        )

    logger.info("Sampled %s frames", sampled)
