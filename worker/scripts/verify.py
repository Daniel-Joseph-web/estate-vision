"""Continuous verification loop for EstateVision.

Runs every check that can fail without a browser, in dependency order, and
reports one line per check. Designed to be run in a loop while you work:

    python scripts/verify.py              # one pass
    python scripts/verify.py --loop       # re-run every 60s until Ctrl-C
    python scripts/verify.py --loop 30    # ...every 30s
    python scripts/verify.py --quick      # skip the slow typecheck

Exit code is 0 only when every check passes, so it also works in CI.

The checks run cheapest-first and short-circuit sensibly: there is no point
asserting endpoint behaviour when the config that endpoint reads is malformed.
"""

from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
import time
import urllib.error
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
WORKER = ROOT / "worker"
FRONTEND = ROOT / "frontend"

PASS = "PASS"
FAIL = "FAIL"
SKIP = "SKIP"

# ANSI colours, disabled when the output isn't a terminal.
_TTY = sys.stdout.isatty()
GREEN = "\033[32m" if _TTY else ""
RED = "\033[31m" if _TTY else ""
YELLOW = "\033[33m" if _TTY else ""
DIM = "\033[2m" if _TTY else ""
RESET = "\033[0m" if _TTY else ""

COLOURS = {PASS: GREEN, FAIL: RED, SKIP: YELLOW}


class Results:
    def __init__(self) -> None:
        self.rows: list[tuple[str, str, str]] = []

    def add(self, status: str, name: str, detail: str = "") -> None:
        self.rows.append((status, name, detail))
        colour = COLOURS[status]
        line = f"  {colour}{status:4}{RESET}  {name}"
        if detail:
            line += f"  {DIM}{detail}{RESET}"
        print(line, flush=True)

    @property
    def failed(self) -> int:
        return sum(1 for status, _, _ in self.rows if status == FAIL)

    @property
    def passed(self) -> int:
        return sum(1 for status, _, _ in self.rows if status == PASS)

    @property
    def skipped(self) -> int:
        return sum(1 for status, _, _ in self.rows if status == SKIP)


def read_env(path: Path) -> dict[str, str]:
    """Minimal .env parser — enough for KEY=value lines."""
    values: dict[str, str] = {}
    if not path.is_file():
        return values

    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if line and not line.startswith("#") and "=" in line:
            key, value = line.split("=", 1)
            values[key.strip()] = value.strip()

    return values


def run(command: list[str], cwd: Path, timeout: int = 300) -> tuple[int, str]:
    """Runs a command, returning (exit code, combined output)."""
    try:
        completed = subprocess.run(
            command,
            cwd=cwd,
            capture_output=True,
            text=True,
            timeout=timeout,
            encoding="utf-8",
            errors="replace",
        )
        return completed.returncode, (completed.stdout or "") + (completed.stderr or "")
    except FileNotFoundError:
        return 127, f"{command[0]} not found on PATH"
    except subprocess.TimeoutExpired:
        return 124, f"timed out after {timeout}s"


def last_line(output: str) -> str:
    lines = [line.strip() for line in output.strip().splitlines() if line.strip()]
    return lines[-1][:120] if lines else ""


# --- checks --------------------------------------------------------------


def check_no_supabase(results: Results) -> None:
    """The migration is only done when nothing imports Supabase any more."""
    offenders: list[str] = []

    searched = [
        (WORKER, ("*.py",), {"venv", "__pycache__", "tests"}),
        (FRONTEND / "app", ("*.ts", "*.tsx"), set()),
        (FRONTEND / "lib", ("*.ts", "*.tsx"), set()),
        (FRONTEND / "components", ("*.ts", "*.tsx"), set()),
        (FRONTEND / "providers", ("*.ts", "*.tsx"), set()),
    ]

    for base, patterns, excluded in searched:
        if not base.is_dir():
            continue
        for pattern in patterns:
            for file in base.rglob(pattern):
                if excluded & set(file.parts):
                    continue
                text = file.read_text(encoding="utf-8", errors="replace").lower()
                # A comment mentioning the migration is fine; an import is not.
                for line in text.splitlines():
                    stripped = line.strip()
                    if stripped.startswith(("#", "//", "*", "/*")):
                        continue
                    if "supabase" in stripped:
                        offenders.append(f"{file.relative_to(ROOT)}")
                        break

    package_json = FRONTEND / "package.json"
    if package_json.is_file():
        deps = json.loads(package_json.read_text(encoding="utf-8"))
        combined = {**deps.get("dependencies", {}), **deps.get("devDependencies", {})}
        for name in combined:
            if "supabase" in name:
                offenders.append(f"package.json: {name}")

    if offenders:
        results.add(FAIL, "no supabase references", ", ".join(sorted(set(offenders))[:4]))
    else:
        results.add(PASS, "no supabase references")


def check_env_alignment(results: Results) -> None:
    """The two services must agree on the secret, bucket and endpoint."""
    frontend_env = read_env(FRONTEND / ".env.local")
    worker_env = read_env(WORKER / ".env")

    if not frontend_env:
        results.add(SKIP, "env alignment", "frontend/.env.local not found")
        return
    if not worker_env:
        results.add(FAIL, "env alignment", "worker/.env not found")
        return

    problems: list[str] = []

    # A mismatch here is a 401 the frontend reports as "analysis couldn't start".
    for key in ("WORKER_SECRET", "S3_BUCKET", "AWS_ENDPOINT", "AWS_REGION"):
        if frontend_env.get(key, "") != worker_env.get(key, ""):
            problems.append(f"{key} differs")

    # An empty credential fails at the first Firestore or R2 call, not at boot.
    for key in ("AWS_ACCESS_KEY_ID", "AWS_SECRET_ACCESS_KEY"):
        if not worker_env.get(key):
            problems.append(f"{key} empty in worker/.env")

    has_json = bool(worker_env.get("FIREBASE_CREDENTIALS_JSON"))
    has_parts = bool(worker_env.get("FIREBASE_PRIVATE_KEY")) and bool(
        worker_env.get("FIREBASE_CLIENT_EMAIL")
    )
    if not has_json and not has_parts:
        problems.append("no firebase credentials in worker/.env")

    secret = worker_env.get("WORKER_SECRET", "")
    if len(secret) < 16:
        problems.append("WORKER_SECRET under 16 chars")

    if problems:
        results.add(FAIL, "env alignment", "; ".join(problems))
    else:
        results.add(PASS, "env alignment")


def check_worker_imports(results: Results) -> None:
    """Catches the exact break that 500'd every request: a bad writer import."""
    code = (
        "import main, sys; "
        "from pipeline import firestore_writer; "
        "sys.exit(0 if main.writer is firestore_writer else 1)"
    )
    exit_code, output = run([sys.executable, "-c", code], WORKER, timeout=180)

    if exit_code == 0:
        results.add(PASS, "worker imports firestore_writer")
    else:
        results.add(FAIL, "worker imports firestore_writer", last_line(output))


def check_worker_tests(results: Results) -> None:
    exit_code, output = run(
        [sys.executable, "-m", "pytest", "-q", "--no-header"], WORKER, timeout=600
    )

    summary = last_line(output)
    if exit_code == 0:
        results.add(PASS, "worker unit tests", summary)
    else:
        results.add(FAIL, "worker unit tests", summary)
        # Failures are the reason to run this at all, so show them.
        for line in output.splitlines():
            if line.startswith(("FAILED", "ERROR")):
                print(f"        {DIM}{line.strip()[:150]}{RESET}", flush=True)


def check_worker_health(results: Results, base_url: str) -> None:
    try:
        with urllib.request.urlopen(f"{base_url}/health", timeout=5) as response:
            body = json.loads(response.read().decode("utf-8"))
        if response.status == 200 and body.get("status") == "ok":
            results.add(PASS, "worker /health", base_url)
        else:
            results.add(FAIL, "worker /health", f"{response.status} {body}")
    except urllib.error.URLError as error:
        results.add(SKIP, "worker /health", f"not running at {base_url} ({error.reason})")
    except Exception as error:  # noqa: BLE001
        results.add(SKIP, "worker /health", str(error)[:80])


def post_json(url: str, payload: dict, headers: dict, timeout: int = 10):
    """POSTs JSON, returning (status, body) and treating 4xx/5xx as a result."""
    request = urllib.request.Request(
        url,
        data=json.dumps(payload).encode("utf-8"),
        headers={"Content-Type": "application/json", **headers},
        method="POST",
    )
    try:
        with urllib.request.urlopen(request, timeout=timeout) as response:
            return response.status, response.read().decode("utf-8")
    except urllib.error.HTTPError as error:
        return error.code, error.read().decode("utf-8", errors="replace")


def check_worker_auth_live(results: Results, base_url: str, secret: str) -> None:
    """The live endpoint must reject bad secrets and 404 unknown videos."""
    url = f"{base_url}/process-video"

    try:
        status, _ = post_json(url, {"video_id": "probe"}, {})
        if status == 401:
            results.add(PASS, "live: no secret → 401")
        else:
            results.add(FAIL, "live: no secret → 401", f"got {status}")

        status, _ = post_json(url, {"video_id": "probe"}, {"X-Worker-Secret": "wrong-value-here"})
        if status == 401:
            results.add(PASS, "live: bad secret → 401")
        else:
            results.add(FAIL, "live: bad secret → 401", f"got {status}")

        if not secret:
            results.add(SKIP, "live: unknown video → 404", "no WORKER_SECRET")
            return

        # A valid secret with a nonexistent id proves the handler reached
        # Firestore and got a clean miss — the old build 500'd here instead.
        status, body = post_json(
            url,
            {"video_id": "verify-probe-nonexistent"},
            {"X-Worker-Secret": secret},
        )
        if status == 404:
            results.add(PASS, "live: unknown video → 404")
        elif status == 500:
            results.add(FAIL, "live: unknown video → 404", f"500 — {body[:100]}")
        else:
            results.add(FAIL, "live: unknown video → 404", f"got {status} {body[:80]}")

    except urllib.error.URLError:
        results.add(SKIP, "live endpoint checks", "worker not running")


def check_frontend_typecheck(results: Results) -> None:
    if not (FRONTEND / "node_modules").is_dir():
        results.add(SKIP, "frontend typecheck", "node_modules missing — run npm install")
        return

    exit_code, output = run(
        ["npx", "--no-install", "tsc", "--noEmit"], FRONTEND, timeout=420
    )

    if exit_code == 0:
        results.add(PASS, "frontend typecheck")
    else:
        errors = [line for line in output.splitlines() if ": error TS" in line]
        results.add(
            FAIL, "frontend typecheck", f"{len(errors)} error(s): {errors[0][:90] if errors else last_line(output)}"
        )
        for line in errors[1:4]:
            print(f"        {DIM}{line.strip()[:150]}{RESET}", flush=True)


def check_frontend_tests(results: Results) -> None:
    if not (FRONTEND / "node_modules" / "vitest").is_dir():
        results.add(SKIP, "frontend unit tests", "vitest not installed")
        return

    exit_code, output = run(
        ["npx", "--no-install", "vitest", "run", "--reporter=dot"], FRONTEND, timeout=300
    )

    summary = next(
        (line.strip() for line in reversed(output.splitlines()) if "Tests" in line),
        last_line(output),
    )
    results.add(PASS if exit_code == 0 else FAIL, "frontend unit tests", summary[:110])


# --- driver --------------------------------------------------------------


def one_pass(quick: bool) -> int:
    frontend_env = read_env(FRONTEND / ".env.local")
    base_url = os.getenv("WORKER_URL") or frontend_env.get("WORKER_URL") or "http://127.0.0.1:8100"
    secret = os.getenv("WORKER_SECRET") or frontend_env.get("WORKER_SECRET", "")

    stamp = datetime.now().strftime("%H:%M:%S")
    print(f"\n{DIM}── verify {stamp} ──{RESET}", flush=True)

    results = Results()

    check_no_supabase(results)
    check_env_alignment(results)
    check_worker_imports(results)
    check_worker_tests(results)
    check_worker_health(results, base_url)
    check_worker_auth_live(results, base_url, secret)
    check_frontend_tests(results)

    if quick:
        results.add(SKIP, "frontend typecheck", "--quick")
    else:
        check_frontend_typecheck(results)

    verdict = f"{GREEN}all good{RESET}" if not results.failed else f"{RED}{results.failed} failing{RESET}"
    print(
        f"  {DIM}{results.passed} passed, {results.failed} failed, "
        f"{results.skipped} skipped{RESET} — {verdict}",
        flush=True,
    )

    return 1 if results.failed else 0


def main() -> int:
    parser = argparse.ArgumentParser(description="EstateVision verification loop")
    parser.add_argument(
        "--loop",
        nargs="?",
        const=60,
        type=int,
        default=None,
        metavar="SECONDS",
        help="re-run continuously every SECONDS (default 60)",
    )
    parser.add_argument("--quick", action="store_true", help="skip the slow typecheck")
    args = parser.parse_args()

    if args.loop is None:
        return one_pass(args.quick)

    print(f"{DIM}Looping every {args.loop}s. Ctrl-C to stop.{RESET}", flush=True)
    try:
        while True:
            one_pass(args.quick)
            time.sleep(args.loop)
    except KeyboardInterrupt:
        print(f"\n{DIM}stopped{RESET}")
        return 0


if __name__ == "__main__":
    raise SystemExit(main())
