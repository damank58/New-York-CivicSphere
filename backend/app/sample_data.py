"""
Static fallback payload to keep the UI working locally without Cosmos data.
"""
from __future__ import annotations

from datetime import datetime, timedelta, timezone


def utc_now() -> datetime:
    return datetime.now(tz=timezone.utc)


STUB_DASHBOARD = {
    "snapshot": {
        "greeting": "Good afternoon, Alex 👋",
        "subheading": "Here is what's happening in New York City.",
        "metrics": [
            {"label": "Local Policy Changes", "value": 4, "trend": "+12%"},
            {"label": "Nearby Events", "value": 5, "trend": "+8%"},
            {"label": "Service Alerts", "value": 3, "trend": "-5%"},
        ],
    },
    "stories": [
        {
            "id": "story-1",
            "title": "How the new transit proposal affects Midtown",
            "category": "Transportation",
            "summary": "City planners outline the congestion pricing impact and new subway upgrades.",
            "image_url": "https://placehold.co/320x200",
            "published_at": utc_now().isoformat(),
        },
        {
            "id": "story-2",
            "title": "What's changing with NYC's sustainability guidelines?",
            "category": "Environment",
            "summary": "A quick refresher on the latest green roof incentives.",
            "image_url": "https://placehold.co/320x200",
            "published_at": (utc_now() - timedelta(hours=5)).isoformat(),
        },
    ],
    "policies": [
        {
            "id": "policy-1",
            "title": "NYC Housing Affordability Act 2024",
            "status": "Active",
            "description": "Updated zoning rules for Midtown & Downtown cores.",
            "highlights": ["Increases moderate-income units", "Expands tenant protections"],
            "tags": ["Housing", "Development"],
        },
        {
            "id": "policy-2",
            "title": "Clean Streets Initiative Expansion",
            "status": "Public Comment",
            "description": "New targets for commercial sanitation partnerships.",
            "highlights": ["Adds 3,000 smart bins", "Offers grants to small biz"],
            "tags": ["Sanitation", "Community"],
        },
    ],
    "discussions": [
        {
            "id": "disc-1",
            "topic": "Proposed bike lane expansions on 5th Avenue",
            "category": "Transportation",
            "sentiment": "Positive",
            "replies_count": 42,
            "last_active_minutes": 18,
        },
        {
            "id": "disc-2",
            "topic": "Community input on new park development",
            "category": "Parks",
            "sentiment": "Mixed",
            "replies_count": 17,
            "last_active_minutes": 55,
        },
        {
            "id": "disc-3",
            "topic": "Affordable housing development in Brooklyn",
            "category": "Housing",
            "sentiment": "Mixed",
            "replies_count": 28,
            "last_active_minutes": 32,
        },
        {
            "id": "disc-4",
            "topic": "Subway line extension to Queens",
            "category": "Infrastructure",
            "sentiment": "Positive",
            "replies_count": 56,
            "last_active_minutes": 12,
        },
        {
            "id": "disc-5",
            "topic": "Congestion pricing implementation",
            "category": "Transportation",
            "sentiment": "Mixed",
            "replies_count": 89,
            "last_active_minutes": 5,
        },
        {
            "id": "disc-6",
            "topic": "Water main replacement project timeline",
            "category": "Infrastructure",
            "sentiment": "Neutral",
            "replies_count": 15,
            "last_active_minutes": 67,
        },
    ],
    "events": [
        {
            "id": "event-1",
            "name": "Downtown Borough Meeting",
            "venue": "Civic Hall",
            "category": "Townhall",
            "start_time": utc_now().isoformat(),
            "end_time": (utc_now() + timedelta(hours=1)).isoformat(),
        },
        {
            "id": "event-2",
            "name": "Water Resiliency Workshop",
            "venue": "Harlem REC",
            "category": "Workshop",
            "start_time": (utc_now() + timedelta(days=1)).isoformat(),
            "end_time": (utc_now() + timedelta(days=1, hours=2)).isoformat(),
        },
    ],
    "elections": [
        {
            "id": "elex-1",
            "title": "Proposition 1: Education",
            "description": "Funding to modernize district labs.",
            "stance": "Support",
            "votes": 1240,
        },
        {
            "id": "elex-2",
            "title": "Proposition 2: Climate Action",
            "description": "Expanding coastal resilience budget.",
            "stance": "Support",
            "votes": 980,
        },
    ],
}

