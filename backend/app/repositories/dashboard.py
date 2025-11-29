"""
Repository layer orchestrating Cosmos DB and Azure Functions.
"""
from __future__ import annotations

from typing import Optional

from ..clients.azure_functions import AzureFunctionClient
from ..clients.cosmos import CosmosDashboardClient
from ..clients.nyc_calendar import NYCCalendarClient

from ..schemas import CommunitySnapshot, DashboardResponse
from ..sample_data import STUB_DASHBOARD


class DashboardRepository:
    """
    High-level data access facade for the dashboard endpoints.
    """

    def __init__(self, cosmos_client: Optional[CosmosDashboardClient] = None, ai_client: Optional[AzureFunctionClient] = None) -> None:
        self._cosmos = cosmos_client or CosmosDashboardClient()
        self._ai = ai_client or AzureFunctionClient()
        # NYC calendar client (optional). If no API key/config is present, this client will return None and we fall back to stub/cosmos events.
        self._nyc = NYCCalendarClient()

    def fetch_dashboard(self) -> DashboardResponse:
        payload = self._cosmos.fetch_dashboard_payload() or STUB_DASHBOARD

        # Attempt to enrich/replace the events with the NYC calendar feed when available.
        try:
            nyc_events = self._nyc.fetch_events()
        except Exception:
            nyc_events = None

        if nyc_events:
            # Replace events in the payload with the mapped feed items.
            # Ensure payload is a dict (it should be from cosmos or STUB_DASHBOARD)
            if not isinstance(payload, dict):
                payload = payload.model_dump() if hasattr(payload, "model_dump") else dict(payload)
            else:
                payload = dict(payload)  # Create a copy to avoid mutating the original
            payload["events"] = nyc_events

        return DashboardResponse.model_validate(payload)

    def fetch_snapshot(self) -> CommunitySnapshot:
        return self.fetch_dashboard().snapshot

    def fetch_ai_summary(self) -> Optional[dict]:
        dashboard = self.fetch_dashboard()
        # Use mode='json' to ensure HttpUrl and datetime objects are serialized to strings
        return self._ai.invoke_ai_suggestions({
            "snapshot": dashboard.snapshot.model_dump(mode="json"),
            "stories": [s.model_dump(mode="json") for s in dashboard.stories]
        })

