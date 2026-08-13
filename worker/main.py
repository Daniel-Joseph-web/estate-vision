"""EstateVision worker: turns uploaded footage into structured event data.

POST /process-video is accepted immediately and the work runs in the
background, because a full pipeline pass takes far longer than any sane HTTP
timeout. Progress is communicated entirely through the video row's `status`,
which the frontend reads.
"""

from __future__ import annotations

import logging
import time
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import BackgroundTasks, Depends, FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

from auth import require_worker_secret
from config import get_settings
from pipeline import detector, download, event_builder, frame_sampler
from pipeline import firestore_writer as writer

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)-8s %(name)s: %(message)s",
)
logger = logging.getLogger("estatevision.worker")


@asynccontextmanager
async def lifespan(_: FastAPI):
    # Fail fast on missing config rather than on the first request.
    get_settings()
    try:
        detector.warm_up()
    except Exception:  # noqa: BLE001 - a cold model is not fatal to boot
        logger.warning("Model warm-up failed; will retry on first request", exc_info=True)
    yield


app = FastAPI(title="EstateVision Worker", version="1.0.0", lifespan=lifespan)

# Allow requests from Vercel deployments and local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ProcessVideoRequest(BaseModel):
    video_id: str = Field(min_length=1)


class ProcessVideoResponse(BaseModel):
    accepted: bool
    video_id: str


@app.get("/health")
async def health() -> dict[str, str]:
    """Unauthenticated liveness probe."""
    return {"status": "ok"}


@app.post(
    "/process-video",
    response_model=ProcessVideoResponse,
    status_code=status.HTTP_202_ACCEPTED,
    dependencies=[Depends(require_worker_secret)],
)
async def process_video(
    request: ProcessVideoRequest,
    background_tasks: BackgroundTasks,
) -> ProcessVideoResponse:
    """Accepts a job after verifying the video exists and belongs to a user."""
    video = writer.fetch_video(request.video_id)

    if video is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No video with id {request.video_id}.",
        )
    if not video.get("storage_key"):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="That video has no storage key; the upload never completed.",
        )

    background_tasks.add_task(
        run_pipeline,
        video_id=video["id"],
        user_id=video["user_id"],
        storage_key=video["storage_key"],
    )

    return ProcessVideoResponse(accepted=True, video_id=video["id"])


def run_pipeline(video_id: str, user_id: str, storage_key: str) -> None:
    """Full pass for one video. Owns every status transition and cleanup.

    Never raises: this runs detached from the request, so an escaping exception
    would leave the row stuck on "processing" forever with nobody to report to.
    """
    started = time.monotonic()
    workspace: Path | None = None

    logger.info("[%s] starting pipeline", video_id)

    try:
        writer.mark_processing(video_id)

        workspace = download.create_workspace(video_id)
        local_path = download.download_video(storage_key, workspace)

        metadata = frame_sampler.probe(local_path)
        settings = get_settings()

        if metadata.duration_seconds > settings.max_duration_seconds:
            raise frame_sampler.SamplingError(
                f"This recording is {metadata.duration_seconds // 60} minutes long, "
                f"over the {settings.max_duration_seconds // 60} minute limit. "
                "Split it into shorter clips and upload them separately."
            )

        detections = []
        for frame in frame_sampler.sample_frames(local_path, metadata):
            detections.extend(detector.detect(frame))

        events = event_builder.build_events(detections, video_id, user_id)

        # Re-running a video must replace its events, not append to them.
        writer.delete_existing_events(video_id)
        written = writer.write_events(events)

        writer.mark_complete(
            video_id,
            duration_seconds=metadata.duration_seconds,
            event_count=written,
        )

        logger.info(
            "[%s] complete: %s detections -> %s events in %.1fs",
            video_id,
            len(detections),
            written,
            time.monotonic() - started,
        )

    except (
        download.DownloadError,
        frame_sampler.SamplingError,
        detector.DetectionError,
    ) as error:
        # Expected failures already carry a message written for the user.
        logger.warning("[%s] failed: %s", video_id, error)
        _fail(video_id, str(error))

    except writer.WriteError as error:
        # The database is the thing that's broken, so marking failed may also
        # fail — try anyway, but log the real cause first.
        logger.error("[%s] write failure: %s", video_id, error)
        _fail(video_id, "Results could not be saved. Try processing this video again.")

    except Exception:  # noqa: BLE001 - last line of defence
        logger.exception("[%s] unexpected failure", video_id)
        _fail(
            video_id,
            "Something went wrong while analysing this video. Try uploading it again.",
        )

    finally:
        if workspace is not None:
            download.cleanup_workspace(workspace)
            logger.info("[%s] cleaned workspace", video_id)


def _fail(video_id: str, message: str) -> None:
    """Best-effort failure recording; a stuck row is worse than a lost message."""
    try:
        writer.mark_failed(video_id, message)
    except Exception:  # noqa: BLE001
        logger.exception("[%s] could not record failure state", video_id)
        