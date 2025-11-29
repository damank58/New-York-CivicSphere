"""
FastAPI entrypoint for NY Civic Sphere backend.
"""
from __future__ import annotations

from datetime import date, timedelta
from pathlib import Path

from fastapi import Depends, FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from .clients.nyc_calendar_alerts import NYCCalendarAlertsClient
from .config import get_settings, Settings
from .repositories.dashboard import DashboardRepository
from .schemas import (
    CommunitySnapshot,
    DashboardResponse,
    Discussion,
    Election,
    Event,
    Policy,
    ServiceAlertsResponse,
    Story,
)

# Get the static files directory (where frontend build will be copied)
STATIC_DIR = Path(__file__).resolve().parents[1] / "static"

# Create main app and API app
app = FastAPI(title="NY Civic Sphere", version="0.1.0")
api_app = FastAPI(title="NY Civic Sphere API", version="0.1.0")


def get_repo() -> DashboardRepository:
    return DashboardRepository()


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

# Mount the API app under /api
app.mount("/api", api_app)

# Serve static files if the directory exists
if STATIC_DIR.exists():
    # Serve assets from /assets path
    app.mount("/assets", StaticFiles(directory=str(STATIC_DIR / "assets")), name="assets")
    
    # Serve index.html for all non-API routes (SPA fallback)
    @app.get("/{full_path:path}")
    def serve_spa(full_path: str):
        """Serve the React app for all non-API routes."""
        index_path = STATIC_DIR / "index.html"
        if index_path.exists():
            return FileResponse(index_path)
        return {"error": "Frontend not found"}

