"""
Azure AI Search client for querying search indexes.
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from azure.core.credentials import AzureKeyCredential
from azure.search.documents import SearchClient
from azure.search.documents.models import QueryType

from ..config import get_settings

logger = logging.getLogger(__name__)


class AzureSearchClient:
    """
    Client for querying Azure AI Search indexes.
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._endpoint = settings.azure_search_endpoint.rstrip("/") if settings.azure_search_endpoint else ""
        self._key = settings.azure_search_key
        self._index_name = settings.azure_search_index_name
        self._api_version = settings.azure_search_api_version
        self._semantic_config_name = settings.azure_search_semantic_config_name

        self._client: Optional[SearchClient] = None
        if self._endpoint and self._key and self._index_name:
            credential = AzureKeyCredential(self._key)
            self._client = SearchClient(
                endpoint=self._endpoint,
                index_name=self._index_name,
                credential=credential,
            )
            logger.info(f"Azure Search client initialized: endpoint={self._endpoint}, index={self._index_name}, semantic_config={self._semantic_config_name}")
        else:
            missing = []
            if not self._endpoint:
                missing.append("endpoint")
            if not self._key:
                missing.append("key")
            if not self._index_name:
                missing.append("index_name")
            logger.warning(f"Azure Search client not initialized. Missing: {', '.join(missing)}")

    def search(self, query: str, top: int = 5) -> List[Dict[str, Any]]:
        """
        Search the index with the given query using semantic search, vector search, or hybrid search.

        Args:
            query: The search query string
            top: Number of results to return (default: 5)

        Returns:
            List of search result dictionaries with document content, scores, and metadata
        """
        if not self._client:
            logger.warning("Search called but client is not initialized")
            return []

        logger.info(f"Searching Azure Search index '{self._index_name}' with query: '{query}' (top={top})")

        # Try semantic search first (which can work with vector fields if configured)
        # Then fall back to hybrid search, then simple search
        search_attempts = [
            ("semantic", self._try_semantic_search),
            ("hybrid", self._try_hybrid_search),
            ("simple", self._try_simple_search),
        ]

        for search_type, search_func in search_attempts:
            try:
                logger.debug(f"Attempting {search_type} search")
                results = search_func(query, top)
                if results:
                    logger.info(f"{search_type.capitalize()} search succeeded with {len(results)} results")
                    return results
            except Exception as e:
                logger.warning(f"{search_type.capitalize()} search failed: {str(e)}")
                continue

        logger.error("All search methods failed")
        return []

    def _try_semantic_search(self, query: str, top: int) -> List[Dict[str, Any]]:
        """Try semantic search with the configured semantic configuration."""
        results = self._client.search(
            search_text=query,
            top=top,
            query_type=QueryType.SEMANTIC,
            semantic_configuration_name=self._semantic_config_name,
            include_total_count=True,
            query_caption="extractive",
            query_answer="extractive",
        )
        return self._process_results(results)

    def _try_hybrid_search(self, query: str, top: int) -> List[Dict[str, Any]]:
        """Try hybrid search combining semantic and keyword search."""
        # Hybrid search: semantic + keyword
        results = self._client.search(
            search_text=query,
            top=top,
            query_type=QueryType.SEMANTIC,
            semantic_configuration_name=self._semantic_config_name,
            include_total_count=True,
        )
        return self._process_results(results)

    def _try_simple_search(self, query: str, top: int) -> List[Dict[str, Any]]:
        """Fall back to simple keyword search."""
        results = self._client.search(
            search_text=query,
            top=top,
            include_total_count=True,
        )
        return self._process_results(results)

    def _process_results(self, results) -> List[Dict[str, Any]]:
        """Process search results and extract relevant fields."""
        search_results = []
        result_count = 0
        
        for result in results:
            result_count += 1
            # Extract relevant fields from the search result
            doc = dict(result)
            
            # Include the score if available
            if hasattr(result, "@search.score"):
                doc["score"] = getattr(result, "@search.score", 0.0)
            if hasattr(result, "@search.reranker_score"):
                doc["reranker_score"] = getattr(result, "@search.reranker_score", 0.0)
            if hasattr(result, "@search.semantic_score"):
                doc["semantic_score"] = getattr(result, "@search.semantic_score", 0.0)
            
            # Log available fields for debugging (only for first result)
            if result_count == 1:
                logger.debug(f"First result fields: {list(doc.keys())}")
                logger.debug(f"First result scores - search: {doc.get('score')}, reranker: {doc.get('reranker_score')}, semantic: {doc.get('semantic_score')}")
            
            search_results.append(doc)

        if result_count == 0:
            logger.warning("No results found in processed search results")
        
        return search_results

