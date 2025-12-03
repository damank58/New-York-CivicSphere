"""
Azure OpenAI client for generating RAG responses.
"""
from __future__ import annotations

import logging
from typing import Any, Dict, List, Optional

from openai import AzureOpenAI

from ..config import get_settings

logger = logging.getLogger(__name__)


class AzureOpenAIClient:
    """
    Client for generating RAG responses using Azure OpenAI.
    """

    def __init__(self) -> None:
        settings = get_settings()
        self._endpoint = settings.azure_openai_endpoint.rstrip("/") if settings.azure_openai_endpoint else ""
        self._key = settings.azure_openai_key
        self._deployment = settings.azure_openai_deployment
        self._api_version = settings.azure_openai_api_version

        self._client: Optional[AzureOpenAI] = None
        if self._endpoint and self._key and self._deployment:
            self._client = AzureOpenAI(
                azure_endpoint=self._endpoint,
                api_key=self._key,
                api_version=self._api_version,
            )
            logger.info(f"Azure OpenAI client initialized: endpoint={self._endpoint}, deployment={self._deployment}")
        else:
            missing = []
            if not self._endpoint:
                missing.append("endpoint")
            if not self._key:
                missing.append("key")
            if not self._deployment:
                missing.append("deployment")
            logger.warning(f"Azure OpenAI client not initialized. Missing: {', '.join(missing)}")

    def generate_rag_response(self, query: str, search_results: List[Dict[str, Any]]) -> Optional[str]:
        """
        Generate a RAG response using the query and search results as context.

        Args:
            query: The user's query
            search_results: List of search result dictionaries from Azure AI Search

        Returns:
            Generated response string, or None if client is not configured or error occurs
        """
        if not self._client:
            logger.warning("RAG generation called but client is not initialized")
            return None

        logger.info(f"Generating RAG response for query: '{query}' with {len(search_results)} search results")

        # Format search results as context
        context_parts = []
        for i, result in enumerate(search_results, 1):
            # Extract text content from result (try multiple field name variations)
            content = (
                result.get("content") or 
                result.get("text") or 
                result.get("description") or
                result.get("Content") or
                result.get("Text") or
                result.get("Description") or
                result.get("body") or
                result.get("Body") or
                result.get("chunk_text") or
                result.get("chunkText") or
                str(result)
            )
            # Try to get title if available (try multiple variations)
            title = (
                result.get("title") or 
                result.get("name") or 
                result.get("Title") or
                result.get("Name") or
                result.get("document_title") or
                result.get("documentTitle") or
                f"Document {i}"
            )
            context_parts.append(f"[{title}]\n{content}")

        context = "\n\n".join(context_parts)
        logger.debug(f"Context length: {len(context)} characters from {len(context_parts)} documents")

        # Create the prompt for RAG
        system_prompt = """You are a helpful assistant for NYC Civic Sphere. Answer questions based on the provided context from NYC civic documents, policies, and information. 
        
If the context contains relevant information, use it to provide a clear, accurate answer. If the context doesn't contain enough information to answer the question, say so honestly.
Always cite which sources you used when providing information."""

        user_prompt = f"""Context from NYC Civic documents:

{context}

Question: {query}

Please provide a helpful answer based on the context above. If you reference specific information, mention which document it came from."""

        try:
            logger.debug("Calling Azure OpenAI API")
            response = self._client.chat.completions.create(
                model=self._deployment,
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt},
                ],
                temperature=0.7,
                max_tokens=1000,
            )

            if response.choices and len(response.choices) > 0:
                response_text = response.choices[0].message.content
                logger.info(f"RAG response generated successfully ({len(response_text)} characters)")
                return response_text
            logger.warning("Azure OpenAI returned no choices")
            return None
        except Exception as e:
            logger.error(f"RAG generation failed with error: {str(e)}", exc_info=True)
            # Return None on error so the API can continue
            return None

