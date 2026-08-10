"""Shared-secret authentication for worker endpoints."""

from __future__ import annotations

import hmac

from fastapi import Header, HTTPException, status

from config import get_settings

SECRET_HEADER = "X-Worker-Secret"


async def require_worker_secret(
    x_worker_secret: str | None = Header(default=None, alias=SECRET_HEADER),
) -> None:
    """FastAPI dependency rejecting any caller without the shared secret.

    Uses a constant-time comparison: a plain `==` on a secret leaks its prefix
    through response timing, which is enough to recover it byte by byte.
    """
    expected = get_settings().worker_secret

    if not x_worker_secret or not hmac.compare_digest(x_worker_secret, expected):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or missing worker secret.",
        )
