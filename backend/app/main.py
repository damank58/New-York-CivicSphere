"""
FastAPI entrypoint for NY Civic Sphere backend.
"""
from __future__ import annotations

from datetime import date, timedelta

from fastapi import Depends, FastAPI

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

app = FastAPI(title="NY Civic Sphere API", version="0.1.0")


def get_repo() -> DashboardRepository:
    return DashboardRepository()


@app.get("/health", tags=["meta"])
def health(settings: Settings = Depends(get_settings)) -> dict:
    return {"status": "ok", "region": settings.azure_region}


@app.get("/dashboard", response_model=DashboardResponse, tags=["dashboard"])
def read_dashboard(repo: DashboardRepository = Depends(get_repo)) -> DashboardResponse:
    return repo.fetch_dashboard()


@app.get("/dashboard/snapshot", response_model=CommunitySnapshot, tags=["dashboard"])
def read_snapshot(repo: DashboardRepository = Depends(get_repo)) -> CommunitySnapshot:
    return repo.fetch_snapshot()


@app.get("/dashboard/stories", response_model=list[Story], tags=["dashboard"])
def read_stories(repo: DashboardRepository = Depends(get_repo)) -> list[Story]:
    return repo.fetch_dashboard().stories


@app.get("/dashboard/policies", response_model=list[Policy], tags=["dashboard"])
def read_policies(repo: DashboardRepository = Depends(get_repo)) -> list[Policy]:
    return repo.fetch_dashboard().policies


@app.get("/dashboard/discussions", response_model=list[Discussion], tags=["dashboard"])
def read_discussions(repo: DashboardRepository = Depends(get_repo)) -> list[Discussion]:
    return repo.fetch_dashboard().discussions


@app.get("/dashboard/events", response_model=list[Event], tags=["dashboard"])
def read_events(repo: DashboardRepository = Depends(get_repo)) -> list[Event]:
    return repo.fetch_dashboard().events


@app.get("/dashboard/elections", response_model=list[Election], tags=["dashboard"])
def read_elections(repo: DashboardRepository = Depends(get_repo)) -> list[Election]:
    return repo.fetch_dashboard().elections


@app.post("/dashboard/ai-summary", tags=["dashboard"])
def ai_summary(repo: DashboardRepository = Depends(get_repo)) -> dict:
    summary = repo.fetch_ai_summary()
    return summary or {"message": "AI summary unavailable", "status": "fallback"}


@app.get("/dashboard/service-alerts", response_model=ServiceAlertsResponse, tags=["dashboard"])
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

