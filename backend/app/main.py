"""
FastAPI entrypoint for NY Civic Sphere backend.
"""
from __future__ import annotations

import logging
from datetime import date, timedelta
from pathlib import Path

from fastapi import Depends, FastAPI, Query
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .clients.azure_openai import AzureOpenAIClient
from .clients.azure_search import AzureSearchClient
from .clients.nyc_calendar_alerts import NYCCalendarAlertsClient
from .config import get_settings, Settings
from .repositories.dashboard import DashboardRepository
from .repositories.forum import ForumRepository
from .schemas import (
    ChatRequest,
    ChatResponse,
    CommunitySnapshot,
    CreatePostRequest,
    DashboardResponse,
    Discussion,
    Election,
    Event,
    ForumResponse,
    ForumThreadResponse,
    Policy,
    ServiceAlertsResponse,
    Source,
    Story,
)

# Get the static files directory (where frontend build will be copied)
STATIC_DIR = Path(__file__).resolve().parents[1] / "static"

# Create main app and API app
app = FastAPI(title="NY Civic Sphere", version="0.1.0")
api_app = FastAPI(title="NY Civic Sphere API", version="0.1.0")

logger = logging.getLogger(__name__)


def get_repo() -> DashboardRepository:
    return DashboardRepository()


def get_forum_repo() -> ForumRepository:
    return ForumRepository()


@api_app.get("/health", tags=["meta"])
def health(settings: Settings = Depends(get_settings)) -> dict:
    return {"status": "ok", "region": settings.azure_region}


@api_app.get("/dashboard", response_model=DashboardResponse, tags=["dashboard"])
def read_dashboard(repo: DashboardRepository = Depends(get_repo)) -> DashboardResponse:
    return repo.fetch_dashboard()


@api_app.get("/dashboard/snapshot", response_model=CommunitySnapshot, tags=["dashboard"])
def read_snapshot(repo: DashboardRepository = Depends(get_repo)) -> CommunitySnapshot:
    return repo.fetch_snapshot()


@api_app.get("/dashboard/stories", response_model=list[Story], tags=["dashboard"])
def read_stories(repo: DashboardRepository = Depends(get_repo)) -> list[Story]:
    return repo.fetch_dashboard().stories


@api_app.get("/dashboard/policies", response_model=list[Policy], tags=["dashboard"])
def read_policies(repo: DashboardRepository = Depends(get_repo)) -> list[Policy]:
    return repo.fetch_dashboard().policies


@api_app.get("/dashboard/discussions", response_model=list[Discussion], tags=["dashboard"])
def read_discussions(repo: DashboardRepository = Depends(get_repo)) -> list[Discussion]:
    return repo.fetch_dashboard().discussions


@api_app.get("/dashboard/events", response_model=list[Event], tags=["dashboard"])
def read_events(repo: DashboardRepository = Depends(get_repo)) -> list[Event]:
    return repo.fetch_dashboard().events


@api_app.get("/dashboard/elections", response_model=list[Election], tags=["dashboard"])
def read_elections(repo: DashboardRepository = Depends(get_repo)) -> list[Election]:
    return repo.fetch_dashboard().elections


@api_app.post("/dashboard/ai-summary", tags=["dashboard"])
def ai_summary(repo: DashboardRepository = Depends(get_repo)) -> dict:
    summary = repo.fetch_ai_summary()
    return summary or {"message": "AI summary unavailable", "status": "fallback"}


@api_app.get("/dashboard/service-alerts", response_model=ServiceAlertsResponse, tags=["dashboard"])
def read_service_alerts() -> ServiceAlertsResponse:
    """Fetch service alerts for the past 7 days (from today - 7 days to today)."""
    client = NYCCalendarAlertsClient()
    today = date.today()
    fromdate = (today - timedelta(days=7)).strftime("%Y-%m-%d")
    todate = today.strftime("%Y-%m-%d")
    
    data = client.fetch_alerts(fromdate, todate)
    if data and "days" in data:
        try:
            return ServiceAlertsResponse(**data)
        except Exception:
            # If validation fails, return empty response
            return ServiceAlertsResponse(days=[])
    
    # Return empty response if API call fails
    return ServiceAlertsResponse(days=[])


@api_app.post("/chat", response_model=ChatResponse, tags=["chat"])
def chat(request: ChatRequest) -> ChatResponse:
    """
    Handle chat messages using Azure AI Search and Azure OpenAI RAG.
    
    Flow:
    1. Query Azure AI Search with user message
    2. Use search results as context for Azure OpenAI
    3. Generate RAG response with source citations
    """
    search_client = AzureSearchClient()
    openai_client = AzureOpenAIClient()
    
    # Search for relevant documents
    logger.info(f"Chat endpoint called with message: '{request.message}'")
    search_results = search_client.search(request.message, top=5)
    
    logger.info(f"Search returned {len(search_results)} results")
    
    # Log the structure of first result for debugging
    if search_results:
        first_result_keys = list(search_results[0].keys())
        logger.debug(f"First search result has fields: {first_result_keys}")
    else:
        logger.warning("No search results returned")
    
    # Generate sources from search results
    sources = []
    for idx, result in enumerate(search_results):
        # Log all available fields for first result to help identify title field
        if idx == 0:
            all_keys = list(result.keys())
            logger.info(f"Available fields in search result: {all_keys}")
            # Filter out internal Azure Search fields
            data_keys = [k for k in all_keys if not k.startswith("@") and k not in ["score", "reranker_score"]]
            logger.info(f"Data fields (excluding Azure metadata): {data_keys}")
        
        # Try multiple field name variations for title (prioritize knowledge base fields)
        # Knowledge base fields: sourcepage, sourcefile, title, filepath, etc.
        title = (
            # Knowledge base specific fields (highest priority)
            result.get("sourcepage") or
            result.get("sourcePage") or
            result.get("source_page") or
            result.get("sourcefile") or
            result.get("sourceFile") or
            result.get("source_file") or
            result.get("filepath") or
            result.get("filePath") or
            result.get("file_path") or
            # Standard title fields
            result.get("title") or 
            result.get("Title") or
            result.get("name") or 
            result.get("Name") or
            # Document metadata fields
            result.get("document_title") or
            result.get("documentTitle") or
            result.get("document_name") or
            result.get("documentName") or
            result.get("file_name") or
            result.get("fileName") or
            result.get("filename") or
            result.get("source_title") or
            result.get("sourceTitle") or
            # Azure Search metadata fields
            result.get("metadata_storage_name") or
            result.get("metadata_storage_path") or
            # Try to extract from metadata if it exists
            (result.get("metadata", {}).get("title") if isinstance(result.get("metadata"), dict) else None) or
            (result.get("metadata", {}).get("name") if isinstance(result.get("metadata"), dict) else None) or
            (result.get("metadata", {}).get("sourcepage") if isinstance(result.get("metadata"), dict) else None) or
            (result.get("metadata", {}).get("sourcefile") if isinstance(result.get("metadata"), dict) else None) or
            # Last resort: use first non-empty string field that looks like a title
            next((v for k, v in result.items() if isinstance(v, str) and len(v) > 0 and len(v) < 200 and not k.startswith("@") and k not in ["content", "text", "body", "chunk_text", "chunkText", "chunk", "embedding", "vector"]), None) or
            f"Document {idx + 1}"
        )
        
        # Clean up title - remove file extensions if present, extract just the name
        if title and title != f"Document {idx + 1}":
            # If it's a file path, extract just the filename
            if "/" in title or "\\" in title:
                title = title.split("/")[-1].split("\\")[-1]
            # Remove common file extensions
            if "." in title:
                # Keep the extension if it's part of a meaningful title, but remove if it's just a filename
                pass  # Keep as is for now
        
        # Try multiple field name variations for URL
        url = (
            result.get("url") or 
            result.get("Url") or
            result.get("source") or 
            result.get("Source") or
            result.get("document_url") or
            result.get("documentUrl") or
            result.get("filepath") or
            result.get("file_path") or
            result.get("filePath") or
            result.get("metadata_storage_path") or
            result.get("source_url") or
            result.get("sourceUrl") or
            None
        )
        
        # Get score (try both variations)
        score = result.get("score") or result.get("reranker_score") or 0.0
        
        # Try multiple field name variations for content (prioritize knowledge base fields)
        content = (
            # Knowledge base specific content fields
            result.get("chunk") or
            result.get("Chunk") or
            result.get("chunk_text") or
            result.get("chunkText") or
            result.get("chunk_content") or
            # Standard content fields
            result.get("content") or 
            result.get("Content") or
            result.get("text") or 
            result.get("Text") or
            result.get("description") or
            result.get("Description") or
            result.get("body") or
            result.get("Body") or
            ""
        )
        
        # Log which fields were found for first result with more detail
        if idx == 0:
            logger.info(f"Extracted fields - title: '{title}', url: {url is not None}, content length: {len(content)}, score: {score}")
            # Log which specific field was used for title
            title_source = None
            for field in ["sourcepage", "sourcePage", "source_page", "sourcefile", "sourceFile", "source_file", 
                         "filepath", "filePath", "file_path", "title", "Title", "name", "Name"]:
                if result.get(field):
                    title_source = field
                    break
            if title_source:
                logger.info(f"Title extracted from field: '{title_source}' = '{result.get(title_source)}'")
            else:
                logger.warning(f"Title fallback used: '{title}' - consider checking available fields in logs")
        
        # Don't include URL in sources since we don't want hyperlinks
        sources.append(Source(
            title=title,
            url=None,  # Set to None to prevent hyperlinks
            score=score,
            content=content[:200] if content else None,  # Truncate for response
        ))
    
    logger.info(f"Generated {len(sources)} sources from search results")
    
    # Generate RAG response
    response_text = openai_client.generate_rag_response(request.message, search_results)
    
    # Fallback if OpenAI is not available or returns None
    if not response_text:
        if search_results:
            # If we have search results but no OpenAI, return a simple message
            response_text = "I found some relevant information, but I'm unable to generate a detailed response at the moment. Please try again later."
        else:
            response_text = "I couldn't find relevant information for your question. Please try rephrasing your question or ask about NYC policies, services, or civic information."
    
    return ChatResponse(
        response=response_text,
        sources=sources,
    )


@api_app.get("/forum/threads", response_model=ForumResponse, tags=["forum"])
def read_forum_threads(repo: ForumRepository = Depends(get_forum_repo)) -> ForumResponse:
    """Fetch all forum threads."""
    return repo.fetch_forum_threads()


@api_app.get("/forum/threads/{thread_id}", response_model=ForumThreadResponse, tags=["forum"])
def read_thread_detail(thread_id: str, repo: ForumRepository = Depends(get_forum_repo)) -> ForumThreadResponse:
    """Fetch detailed thread with all posts."""
    thread_response = repo.fetch_thread_detail(thread_id)
    if not thread_response:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail="Thread not found")
    return thread_response


@api_app.post("/forum/threads/{thread_id}/posts", response_model=ForumThreadResponse, tags=["forum"])
def create_post(
    thread_id: str,
    request: CreatePostRequest,
    repo: ForumRepository = Depends(get_forum_repo)
) -> ForumThreadResponse:
    """Create a new post in a thread."""
    try:
        repo.create_post(thread_id, request.content, request.author, request.parent_post_id)
        thread_response = repo.fetch_thread_detail(thread_id)
        if not thread_response:
            from fastapi import HTTPException
            raise HTTPException(status_code=404, detail="Thread not found")
        return thread_response
    except ValueError as e:
        from fastapi import HTTPException
        raise HTTPException(status_code=404, detail=str(e))


@api_app.get("/chat/debug", tags=["chat"])
def chat_debug(query: str = Query(..., description="Search query to test")) -> dict:
    """
    Debug endpoint to test Azure Search directly and inspect raw results.
    
    This endpoint returns the raw search results to help identify:
    - Field names in the index
    - Result structure
    - Whether search is working
    """
    search_client = AzureSearchClient()
    
    logger.info(f"Debug search called with query: '{query}'")
    
    # Search for documents
    search_results = search_client.search(query, top=5)
    
    # Log the structure of results
    if search_results:
        logger.info(f"Debug search returned {len(search_results)} results")
        logger.debug(f"First result keys: {list(search_results[0].keys()) if search_results else []}")
    else:
        logger.warning("Debug search returned no results")
    
    return {
        "query": query,
        "result_count": len(search_results),
        "results": search_results,
        "first_result_keys": list(search_results[0].keys()) if search_results else [],
    }

# Mount the API app under /api
app.mount("/api", api_app)

# Serve static files if the directory exists
if STATIC_DIR.exists():
    # Serve assets from /assets path
    assets_dir = STATIC_DIR / "assets"
    if assets_dir.exists():
        app.mount("/assets", StaticFiles(directory=str(assets_dir)), name="assets")
    
    # Serve index.html for all non-API routes (SPA fallback)
    # This catch-all route will only match if /api and /assets mounts don't match
    # FastAPI checks mounts before route handlers, so this is safe
    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        """Serve the React app for all non-API routes."""
        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        return {"error": "Frontend not found"}

