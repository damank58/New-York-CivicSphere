"""
Client for fetching and mapping events from the NYC calendar discovery API.
"""
from __future__ import annotations

import re
from typing import Any, Dict, List, Optional

import httpx

from ..config import get_settings


class NYCCalendarClient:
    def __init__(self, base_url: Optional[str] = None, api_key: Optional[str] = None) -> None:
        settings = get_settings()
        self.base_url = base_url or getattr(settings, "nyc_calendar_base_url", "https://api.nyc.gov/calendar/discover")
        self.api_key = api_key or getattr(settings, "nyc_calendar_key", "")
        self._headers = {"Cache-Control": "no-cache"}
        if self.api_key:
            self._headers["Ocp-Apim-Subscription-Key"] = self.api_key

    def fetch_events(self) -> Optional[List[Dict[str, Any]]]:
        """Return a list of mapped events suitable for the dashboard payload.

        Returns None on error or if API key is not configured.
        The mapped event shape matches the backend `Event` schema keys: id, name, venue, start_time, end_time, category.
        """
        if not self.api_key:
            # No API key configured, don't attempt a network call.
            return None

        try:
            resp = httpx.get(self.base_url, headers=self._headers, timeout=10.0)
            resp.raise_for_status()
            body = resp.json()
            items = body.get("items", []) if isinstance(body, dict) else []

            mapped: List[Dict[str, Any]] = []
            for item in items:
                # Determine category: prefer a human-friendly category if present.
                categories = item.get("categories", "") or ""
                tokens = [t.strip() for t in categories.split(",") if t.strip()]
                if len(tokens) > 1:
                    # Often categories come as "Free,Parks & Recreation,General Events" — prefer the descriptive token
                    category = tokens[1]
                elif tokens:
                    category = tokens[0]
                else:
                    category = "General"

                venue = item.get("location") or item.get("address") or ""
                
                # Get description - prefer desc over shortDesc
                description = item.get("desc") or item.get("shortDesc") or None
                # Strip HTML tags if present (desc may contain HTML)
                if description:
                    description = re.sub(r"<[^>]+>", "", description).strip()

                mapped.append(
                    {
                        "id": str(item.get("id") or item.get("guid") or ""),
                        "name": item.get("name", ""),
                        "venue": venue,
                        "start_time": item.get("startDate"),
                        "end_time": item.get("endDate"),
                        "category": category,
                        "image_url": item.get("imageUrl") or None,
                        "description": description,
                        "website_url": item.get("website") or None,
                        "address": item.get("address") or None,
                    }
                )

            return mapped
        except Exception:
            # Swallow errors here; caller can fall back to stub data.
            return None
