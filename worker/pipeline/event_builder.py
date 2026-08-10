"""Turns tracked frame detections into event records with live Watchlist face matching."""

from __future__ import annotations

import logging
import uuid
import cv2
import base64
import numpy as np
from collections import defaultdict
from dataclasses import dataclass

from deepface import DeepFace

from pipeline.detector import Detection
from pipeline import firestore_writer as writer

logger = logging.getLogger(__name__)


def _load_user_watchlist_encodings(user_id: str) -> list[tuple[str, np.ndarray]]:
    """Fetches user watchlist items from Firestore and encodes their faces into memory."""
    watchlist_items = writer.fetch_watchlist(user_id)
    encodings = []

    for item in watchlist_items:
        name = item.get("name", "Unknown Subject")
        image_data = item.get("image_data")  # Base64 data URI

        if not image_data or "," not in image_data:
            continue

        try:
            # Decode Base64 string to BGR image array
            b64_str = image_data.split(",")[1]
            img_bytes = base64.b64decode(b64_str)
            nparr = np.frombuffer(img_bytes, np.uint8)
            bgr_img = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

            # DeepFace handles OpenCV BGR arrays natively.
            # enforce_detection=True ensures we only encode actual faces.
            reps = DeepFace.represent(img_path=bgr_img, model_name="Facenet", enforce_detection=True)
            if reps:
                encodings.append((name, np.array(reps[0]["embedding"])))
                logger.info("Loaded live watchlist face encoding for '%s'", name)
        except ValueError:
            logger.warning("No face detected in watchlist photo for '%s'.", name)
        except Exception as err:
            logger.warning("Failed to encode watchlist item '%s': %s", name, err)

    return encodings


def _check_face_match(crop_bgr: np.ndarray | None, known_encodings: list[tuple[str, np.ndarray]]) -> str | None:
    """Compares a cropped BGR detection image against active watchlist encodings."""
    if not known_encodings or crop_bgr is None or crop_bgr.size == 0:
        return None

    try:
        # Extract face embeddings from the YOLO crop
        reps = DeepFace.represent(img_path=crop_bgr, model_name="Facenet", enforce_detection=True)
        if not reps:
            return None

        target_enc = np.array(reps[0]["embedding"])
        
        best_match = None
        best_distance = float("inf")

        for name, ref_enc in known_encodings:
            # Calculate Cosine Distance (standard for Facenet)
            # Distance of 0 means perfect match, 1 means completely different.
            distance = 1 - np.dot(ref_enc, target_enc) / (np.linalg.norm(ref_enc) * np.linalg.norm(target_enc))
            
            if distance < best_distance:
                best_distance = distance
                best_match = name

        # 0.40 is the standard strict threshold for Facenet cosine distance
        if best_distance < 0.40:
            logger.info("Matched face to '%s' (distance: %.3f)", best_match, best_distance)
            return best_match
            
    except ValueError:
        # Expected behavior: YOLO cropped a person, but their back is turned (no face found).
        pass
    except Exception as err:
        logger.warning("Face match evaluation failed: %s", err)

    return None


CLASS_MAP: dict[str, str] = {
    "person": "person",
    "car": "vehicle",
    "truck": "vehicle",
    "bus": "vehicle",
    "motorcycle": "vehicle",
    "bicycle": "vehicle",
    "train": "vehicle",
    "boat": "vehicle",
    "dog": "animal",
    "cat": "animal",
    "bird": "animal",
    "horse": "animal",
    "sheep": "animal",
    "cow": "animal",
    "bear": "animal",
    "backpack": "package",
    "handbag": "package",
    "suitcase": "package",
}

DWELL_THRESHOLDS: dict[str, tuple[int, int]] = {
    "person": (120, 600),
    "vehicle": (300, 1800),
    "package": (300, 1200),
    "animal": (600, 3600),
}

SEVERITY_SAFE = "safe"
SEVERITY_WARNING = "warning"
SEVERITY_THREAT = "threat"


@dataclass(frozen=True)
class Track:
    object_class: str
    start_seconds: int
    end_seconds: int
    peak_confidence: float
    bbox: tuple[float, float, float, float]
    sightings: int
    crop: np.ndarray | None
    matched_name: str | None = None

    @property
    def dwell_seconds(self) -> int:
        return self.end_seconds - self.start_seconds


def _severity(object_class: str, dwell_seconds: int, matched_name: str | None) -> str:
    if matched_name is not None:
        return SEVERITY_THREAT

    warning_at, threat_at = DWELL_THRESHOLDS.get(object_class, (300, 1800))
    if dwell_seconds >= threat_at:
        return SEVERITY_THREAT
    if dwell_seconds >= warning_at:
        return SEVERITY_WARNING
    return SEVERITY_SAFE


def _humanise_duration(seconds: int) -> str:
    if seconds < 60:
        return f"{seconds} second{'s' if seconds != 1 else ''}"
    minutes = seconds // 60
    if minutes < 60:
        return f"{minutes} minute{'s' if minutes != 1 else ''}"
    hours = minutes // 60
    remainder = minutes % 60
    label = f"{hours} hour{'s' if hours != 1 else ''}"
    return f"{label} {remainder} min" if remainder else label


def _label(track: Track, severity: str) -> str:
    dwell = _humanise_duration(max(track.dwell_seconds, 1))

    if track.matched_name:
        return f"⚠️ WATCHLIST MATCH: {track.matched_name} present for {dwell}"

    article = {"person": "Person", "vehicle": "Vehicle", "animal": "Animal"}.get(
        track.object_class, "Package"
    )

    if severity == SEVERITY_SAFE:
        if track.object_class == "package":
            return f"Package visible for {dwell}"
        return f"{article} detected, present for {dwell}"

    if track.object_class == "package":
        return f"Package left unattended for {dwell}"
    if track.object_class == "person":
        return f"Person lingering in view for {dwell}"
    if track.object_class == "vehicle":
        return f"Vehicle stationary for {dwell}"
    return f"{article} in view for {dwell}"


def build_tracks(detections: list[Detection], user_id: str) -> list[Track]:
    by_track: dict[str, list[Detection]] = defaultdict(list)
    dropped = 0
    untracked_seq = 0

    # Load dynamic watchlist encodings from Firestore for this user
    known_encodings = _load_user_watchlist_encodings(user_id)

    for detection in detections:
        mapped = CLASS_MAP.get(detection.object_class)
        if mapped is None:
            dropped += 1
            continue

        if detection.track_id is not None:
            key = f"{mapped}_{detection.track_id}"
        else:
            untracked_seq += 1
            key = f"{mapped}_untracked_{untracked_seq}"

        by_track[key].append(detection)

    tracks: list[Track] = []

    for key, group in by_track.items():
        group.sort(key=lambda d: d.timestamp_seconds)

        start = group[0].timestamp_seconds
        end = group[-1].timestamp_seconds
        sightings = len(group)
        peak = max(group, key=lambda d: d.confidence)

        # Dynamic face match check
        matched_name = None
        if CLASS_MAP[group[0].object_class] == "person" and peak.crop is not None:
            matched_name = _check_face_match(peak.crop, known_encodings)

        tracks.append(
            Track(
                object_class=CLASS_MAP[group[0].object_class],
                start_seconds=start,
                end_seconds=end,
                peak_confidence=peak.confidence,
                bbox=peak.bbox,
                sightings=sightings,
                crop=peak.crop,
                matched_name=matched_name,
            )
        )

    tracks.sort(key=lambda t: t.start_seconds)
    return tracks


def build_events(
    detections: list[Detection], video_id: str, user_id: str
) -> list[dict]:
    events: list[dict] = []

    for track in build_tracks(detections, user_id):
        severity = _severity(track.object_class, track.dwell_seconds, track.matched_name)
        x, y, w, h = track.bbox

        frame_url = None
        if track.crop is not None and track.crop.size > 0:
            crop_h, crop_w = track.crop.shape[:2]
            if crop_w > 150:
                scale = 150 / crop_w
                resized_crop = cv2.resize(track.crop, (150, int(crop_h * scale)))
            else:
                resized_crop = track.crop

            success, buffer = cv2.imencode('.jpg', resized_crop, [cv2.IMWRITE_JPEG_QUALITY, 65])
            if success:
                b64_str = base64.b64encode(buffer).decode('utf-8')
                frame_url = f"data:image/jpeg;base64,{b64_str}"

        events.append(
            {
                "id": str(uuid.uuid4()),
                "video_id": video_id,
                "user_id": user_id,
                "timestamp_seconds": track.start_seconds,
                "object_class": track.object_class,
                "confidence": track.peak_confidence,
                "severity": severity,
                "label": _label(track, severity),
                "frame_url": frame_url,
                "bbox": [x, y, w, h],
            }
        )

    return events