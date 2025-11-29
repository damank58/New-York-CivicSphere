"""
Centralized Pydantic settings for Azure + Cosmos integration.
"""
from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict


ENV_PATH = Path(__file__).resolve().parents[1] / ".env"


class Settings(BaseSettings):
    # Point the env_file to the backend/.env next to the package root so running from the repo root
    # or other CWDs still loads the intended file.
    model_config = SettingsConfigDict(env_file=str(ENV_PATH), env_file_encoding="utf-8", extra="ignore")

    app_name: str = "NY Civic Sphere API"
    azure_region: str = "eastus"
    cosmos_endpoint: str = ""
    cosmos_key: str = ""
    cosmos_database: str = "ny-civic-sphere"
    cosmos_container: str = "dashboard"
    azure_functions_base_url: str = ""
    ai_suggestion_function_key: str = ""
    # NYC calendar API configuration
    nyc_calendar_base_url: str = "https://api.nyc.gov/calendar/discover"
    nyc_calendar_key: str = ""
    # NYC calendar alerts API configuration
    nyc_calendar_alerts_base_url: str = "https://api.nyc.gov/public/api/GetCalendar"
    nyc_calendar_alerts_key: str = ""


@lru_cache
def get_settings() -> Settings:
    """
    Cache the settings instance to avoid re-parsing env files.
    """
    return Settings()

