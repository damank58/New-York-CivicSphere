"""
Cosmos DB client abstraction for dashboard data.
"""
from __future__ import annotations

from typing import Any, Dict, List, Optional

from azure.cosmos import CosmosClient  # type: ignore
from azure.cosmos.partition_key import PartitionKey  # type: ignore

from ..config import get_settings


class CosmosDashboardClient:
    """
    Minimal wrapper around the Azure Cosmos SDK so the rest of the app can unit test easily.
    """

    def __init__(self) -> None:
        settings = get_settings()
        # Only create client if both endpoint and key are configured
        if settings.cosmos_endpoint and settings.cosmos_key:
            try:
                self._client = CosmosClient(settings.cosmos_endpoint, credential=settings.cosmos_key)
            except Exception:
                # If client creation fails (e.g., invalid credentials), set to None
                self._client = None
        else:
            self._client = None
        self._database_name = settings.cosmos_database
        self._container_name = settings.cosmos_container

    def fetch_dashboard_payload(self) -> Optional[Dict[str, Any]]:
        """
        Return dashboard payload pulled from Cosmos DB if configured, fallback to None otherwise.
        """
        if not self._client:
            return None

        database = self._client.get_database_client(self._database_name)
        container = database.get_container_client(self._container_name)
        query = "SELECT TOP 1 c.payload FROM c WHERE c.type = @type ORDER BY c._ts DESC"
        params = [{"name": "@type", "value": "dashboard"}]
        result: List[Dict[str, Any]] = list(
            container.query_items(query, parameters=params, partition_key=PartitionKey(path="/type"))
        )
        if not result:
            return None

        return result[0].get("payload")

