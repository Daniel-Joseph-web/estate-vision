"""Shared-secret auth tests.

The secret is the entirety of the worker's authentication, so the comparison
must be constant-time and must not be bypassable by an empty or absent header.
"""

from __future__ import annotations

import inspect

import pytest
from fastapi import HTTPException

from auth import require_worker_secret
from tests.conftest import FAKE_ENV

SECRET = FAKE_ENV["WORKER_SECRET"]


@pytest.mark.asyncio
async def test_correct_secret_passes(settings):
    assert await require_worker_secret(SECRET) is None


@pytest.mark.parametrize("value", [None, "", "wrong", SECRET[:-1], SECRET + "x"])
@pytest.mark.asyncio
async def test_bad_secrets_are_rejected(settings, value):
    with pytest.raises(HTTPException) as caught:
        await require_worker_secret(value)

    assert caught.value.status_code == 401


def test_comparison_is_constant_time():
    """A plain `==` leaks the secret's prefix through response timing."""
    source = inspect.getsource(require_worker_secret)

    assert "compare_digest" in source
