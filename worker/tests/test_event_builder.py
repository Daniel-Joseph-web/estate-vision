"""Event builder tests.

This module is what makes the dashboard readable — it collapses one-row-per-
frame detector noise into dwell-based events and assigns severity. The
thresholds are product decisions, so they are asserted explicitly.
"""

from __future__ import annotations

from pipeline.detector import Detection
from pipeline.event_builder import (
    SEVERITY_SAFE,
    SEVERITY_THREAT,
    SEVERITY_WARNING,
    build_events,
    build_tracks,
)

BOX = (0.1, 0.1, 0.2, 0.3)


def detection(second, object_class="person", confidence=0.9):
    return Detection(second, object_class, confidence, BOX)


def test_consecutive_sightings_collapse_into_one_track():
    """Sixty frames of a standing person is one event, not sixty."""
    tracks = build_tracks([detection(s) for s in range(60)])

    assert len(tracks) == 1
    assert tracks[0].sightings == 60
    assert tracks[0].dwell_seconds == 59


def test_a_long_gap_splits_into_separate_tracks():
    """Someone who leaves and returns is two visits."""
    tracks = build_tracks([detection(0), detection(1), detection(400), detection(401)])

    assert len(tracks) == 2
    assert tracks[0].start_seconds == 0
    assert tracks[1].start_seconds == 400


def test_brief_occlusion_does_not_split_a_track():
    """A 3s gap tolerates someone passing behind a pillar at 1 fps."""
    tracks = build_tracks([detection(0), detection(3), detection(6)])

    assert len(tracks) == 1


def test_different_classes_track_independently():
    tracks = build_tracks([detection(0, "person"), detection(0, "car")])

    assert {t.object_class for t in tracks} == {"person", "vehicle"}


def test_unmapped_coco_classes_are_dropped():
    """A detected pizza is not a security event."""
    assert build_tracks([detection(0, "pizza"), detection(1, "toaster")]) == []


def test_peak_confidence_wins_within_a_track():
    tracks = build_tracks(
        [detection(0, confidence=0.4), detection(1, confidence=0.95), detection(2, confidence=0.5)]
    )

    assert tracks[0].peak_confidence == 0.95


def test_severity_escalates_with_dwell_time():
    """person: safe < 120s, warning at 120s, threat at 600s."""
    brief = build_events([detection(s) for s in range(0, 30)], "v1", "u1")
    lingering = build_events([detection(s) for s in range(0, 200)], "v1", "u1")
    sustained = build_events([detection(s) for s in range(0, 700)], "v1", "u1")

    assert brief[0]["severity"] == SEVERITY_SAFE
    assert lingering[0]["severity"] == SEVERITY_WARNING
    assert sustained[0]["severity"] == SEVERITY_THREAT


def test_a_parked_vehicle_is_less_urgent_than_a_lingering_person():
    """Same 200s dwell, different thresholds — vehicles idle legitimately."""
    person = build_events([detection(s, "person") for s in range(200)], "v1", "u1")
    vehicle = build_events([detection(s, "car") for s in range(200)], "v1", "u1")

    assert person[0]["severity"] == SEVERITY_WARNING
    assert vehicle[0]["severity"] == SEVERITY_SAFE


def test_events_match_the_frontend_schema():
    """These keys are read directly by lib/types/event.ts DetectionEvent."""
    events = build_events([detection(s) for s in range(5)], "vid_1", "user_1")

    assert events, "expected at least one event"
    for event in events:
        assert set(event) == {
            "id",
            "video_id",
            "user_id",
            "timestamp_seconds",
            "object_class",
            "confidence",
            "severity",
            "label",
            "frame_url",
            "bbox",
        }
        assert event["video_id"] == "vid_1"
        assert event["user_id"] == "user_1"
        assert len(event["bbox"]) == 4
        assert 0.0 <= event["confidence"] <= 1.0
        assert event["severity"] in {SEVERITY_SAFE, SEVERITY_WARNING, SEVERITY_THREAT}


def test_event_ids_are_unique():
    """The id becomes the Firestore document id; a collision silently overwrites."""
    events = build_events(
        [detection(s, "person") for s in range(5)]
        + [detection(s, "car") for s in range(5)],
        "v1",
        "u1",
    )

    assert len({e["id"] for e in events}) == len(events)


def test_labels_are_plain_language():
    """This string is shown verbatim to a property manager."""
    events = build_events([detection(s) for s in range(200)], "v1", "u1")

    assert "Person lingering in view for" in events[0]["label"]
    assert "minute" in events[0]["label"]


def test_no_detections_yields_no_events():
    assert build_events([], "v1", "u1") == []
