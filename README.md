# EstateVision

Upload estate CCTV footage, get a reviewed timeline of detections.

- `frontend/` — Next.js app: upload, dashboard, video detail, reports
- `worker/` — FastAPI service: samples frames, runs detection, writes events

Data lives in **Firebase** (Firestore + Auth). Video files live in
**Cloudflare R2**, addressed with the S3 API.

## How a video flows through

1. The browser asks `register-video` for a Firestore row and a presigned R2 URL.
2. The browser PUTs the file straight to R2 — it never passes through the app.
3. `start-processing` POSTs the video id to the worker with `X-Worker-Secret`.
4. The worker downloads from R2, samples at 1 fps, detects, groups detections
   into dwell-based events, and writes them to Firestore in ≤500-op batches.
5. The dashboard, already subscribed to Firestore, updates live.

Both services therefore have to agree on `WORKER_SECRET`, `S3_BUCKET`,
`AWS_ENDPOINT` and the R2 keys. `worker/scripts/sync_env.py` copies the shared
values out of `frontend/.env.local` and reports any drift.

## Running it

```bash
# worker  (port 8100)
cd worker
python -m venv venv && venv/Scripts/activate    # source venv/bin/activate on macOS/Linux
pip install -r requirements.txt
python scripts/sync_env.py
uvicorn main:app --reload --port 8100

# frontend  (port 3100)
cd frontend
npm install
npm run dev
```

`NEXT_PUBLIC_USE_MOCKS=true` in `frontend/.env.local` runs the UI off
`lib/mocks/events.mock.json`, with no Firebase or R2 needed.

## Verifying

```bash
cd worker
python scripts/verify.py              # one pass
python scripts/verify.py --loop 30    # re-run every 30s while you work
python scripts/verify.py --quick      # skip the slow typecheck
```

It checks, in order: no Supabase references remain, the two `.env` files agree,
the worker imports the Firestore writer, unit tests, `/health`, live endpoint
auth (401 on a bad secret, 404 on an unknown video), frontend tests, and
`tsc --noEmit`. Exit code is 0 only when everything passes.

Checks against a running worker report `SKIP` when nothing is listening, so the
loop is still useful before you start the services.

```bash
cd worker    && python -m pytest      # worker tests alone
cd frontend  && npm test              # frontend tests alone
```
