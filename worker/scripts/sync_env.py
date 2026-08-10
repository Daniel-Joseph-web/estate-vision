"""Copies the values both services must share from frontend/.env.local into worker/.env.

The frontend presigns R2 uploads and calls the worker with a shared secret; the
worker downloads from the same bucket and checks the same secret. When those
values drift you get a 401 or a phantom missing object, so this fills the
worker's blanks from the frontend's file rather than having them typed twice.

Only prints whether each value is set and whether the two sides agree — never
the values themselves.

    python scripts/sync_env.py            # fill blanks, then report
    python scripts/sync_env.py --check    # report only, exit 1 on mismatch
"""

from __future__ import annotations

import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
FRONTEND_ENV = ROOT / "frontend" / ".env.local"
WORKER_ENV = ROOT / "worker" / ".env"

# Copied into worker/.env when the worker's value is blank.
COPIED = ("FIREBASE_PRIVATE_KEY", "AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY")

# Must be byte-identical on both sides or the handoff breaks.
SHARED = (
    "WORKER_SECRET",
    "S3_BUCKET",
    "AWS_REGION",
    "AWS_ENDPOINT",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "FIREBASE_PRIVATE_KEY",
)

REQUIRED = (
    "WORKER_SECRET",
    "FIREBASE_PROJECT_ID",
    "FIREBASE_CLIENT_EMAIL",
    "FIREBASE_PRIVATE_KEY",
    "S3_BUCKET",
    "AWS_REGION",
    "AWS_ACCESS_KEY_ID",
    "AWS_SECRET_ACCESS_KEY",
    "AWS_ENDPOINT",
)


def parse(path: Path) -> dict[str, str]:
    values: dict[str, str] = {}
    if not path.is_file():
        return values
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            values[key.strip()] = value.strip()
    return values


def main() -> int:
    check_only = "--check" in sys.argv

    if not WORKER_ENV.is_file():
        print(f"missing {WORKER_ENV.relative_to(ROOT)}")
        return 1
    if not FRONTEND_ENV.is_file():
        print(f"missing {FRONTEND_ENV.relative_to(ROOT)}")
        return 1

    source = parse(FRONTEND_ENV)
    text = WORKER_ENV.read_text(encoding="utf-8")

    if not check_only:
        current = parse(WORKER_ENV)
        for key in COPIED:
            value = source.get(key, "")
            if not value:
                print(f"  absent from frontend/.env.local: {key}")
                continue
            if current.get(key):
                continue  # already set; never clobber a deliberate value
            if f"{key}=\n" in text:
                text = text.replace(f"{key}=\n", f"{key}={value}\n", 1)
            elif text.rstrip().endswith(f"{key}="):
                text = text.rstrip()[: -len(f"{key}=")] + f"{key}={value}\n"
            else:
                text = text.rstrip() + f"\n{key}={value}\n"
            print(f"  filled {key} from frontend/.env.local")
        WORKER_ENV.write_text(text, encoding="utf-8")

    worker = parse(WORKER_ENV)

    print("\nworker/.env")
    missing = []
    for key in REQUIRED:
        value = worker.get(key, "")
        print(f"  {key:26} {f'set ({len(value)} chars)' if value else 'EMPTY'}")
        if not value:
            missing.append(key)

    print("\nagrees with frontend/.env.local")
    differing = []
    for key in SHARED:
        left, right = source.get(key, ""), worker.get(key, "")
        if left and left == right:
            verdict = "match"
        elif left and right:
            verdict = "DIFFERS"
            differing.append(key)
        else:
            verdict = "absent on one side"
            differing.append(key)
        print(f"  {key:26} {verdict}")

    if missing or differing:
        print(f"\n{len(missing)} empty, {len(differing)} not aligned")
        return 1

    print("\nall aligned")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
