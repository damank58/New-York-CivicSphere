"""
HTTP client for calling Azure Functions (e.g., AI summaries).
"""
from __future__ import annotations

from typing import Any, Dict, Optional

import httpx

from ..config import get_settings


class AzureFunctionClient:
    """
    A lightweight synchronous HTTP client with retry-friendly defaults.
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._base_url = settings.azure_functions_base_url.rstrip("/") if settings.azure_functions_base_url else ""
        self._function_key = settings.ai_suggestion_function_key

    def invoke_ai_suggestions(self, payload: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Trigger the Cognitive summary function if configured; otherwise return None so the API can continue.
        """
        if not self._base_url:
            return None

        url = f"{self._base_url}/api/generate-dashboard-summary"
        headers = {"x-functions-key": self._function_key} if self._function_key else {}
        try:
            with httpx.Client(timeout=10.0) as client:
                response = client.post(url, json=payload, headers=headers)
                response.raise_for_status()
                return response.json()
        except httpx.HTTPError:
            # Fallback to None so the API remains healthy even if the Function is down.
            return None

