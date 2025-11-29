"""
Client for fetching service alerts from the NYC GetCalendar API.
"""
from __future__ import annotations

from typing import Any, Dict, Optional

import httpx

from ..config import get_settings


class NYCCalendarAlertsClient:
    def __init__(self, base_url: Optional[str] = None, api_key: Optional[str] = None) -> None:
        settings = get_settings()
        self.base_url = base_url or getattr(settings, "nyc_calendar_alerts_base_url", "https://api.nyc.gov/public/api/GetCalendar")
        self.api_key = api_key or getattr(settings, "nyc_calendar_alerts_key", "")
        self._headers = {"Cache-Control": "no-cache"}
        if self.api_key:
            self._headers["Ocp-Apim-Subscription-Key"] = self.api_key

    def fetch_alerts(self, fromdate: str, todate: str) -> Optional[Dict[str, Any]]:
        """Fetch service alerts for a date range.

        Args:
            fromdate: Start date in YYYY-MM-DD format
            todate: End date in YYYY-MM-DD format

        Returns:
            Raw API response as dict with 'days' key, or None on error.
        """
        if not self.api_key:
            # No API key configured, don't attempt a network call.
            return None

        try:
            params = {"fromdate": fromdate, "todate": todate}
            resp = httpx.get(self.base_url, headers=self._headers, params=params, timeout=10.0)
            resp.raise_for_status()
            body = resp.json()
            return body if isinstance(body, dict) else None
        except Exception:
            # Swallow errors here; caller can handle fallback.
            return None

