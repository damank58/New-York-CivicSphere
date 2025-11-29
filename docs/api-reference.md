# NY Civic Sphere API Reference

The FastAPI backend exposes secure endpoints intended for Azure App Service deployments. This document summarizes each route, expected inputs, and sample JSON responses.

> Base URL examples:
> - Local development: `http://localhost:8000`
> - Azure App Service: `https://{app-name}.azurewebsites.net`

## Authentication
All endpoints are currently open while the MVP stabilizes. Azure AD tokens can be added later via FastAPI dependency overrides.

## Endpoints

### 1. Health Check
- **Method & Path**: `GET /health`
- **Description**: Confirms the API and Azure region configuration.
- **Input Parameters**: none
- **Response Example**:
```json
{
  "status": "ok",
  "region": "eastus"
}
```

### 2. Full Dashboard
- **Method & Path**: `GET /dashboard`
- **Description**: Retrieves the entire dashboard payload (snapshot, stories, policies, discussions, events, elections).
- **Input Parameters**: none
- **Response Example**:
```json
{
  "snapshot": {
    "greeting": "Good afternoon, Alex 👋",
    "subheading": "Here is what's happening in New York City.",
    "metrics": [
      { "label": "Local Policy Changes", "value": 4, "trend": "+12%" }
    ]
  },
  "stories": [{ "id": "story-1", "title": "How the new transit proposal affects Midtown", "...": "..." }],
  "policies": [{ "id": "policy-1", "title": "NYC Housing Affordability Act 2024", "...": "..." }],
  "discussions": [],
  "events": [],
  "elections": []
}
```

### 3. Community Snapshot
- **Method & Path**: `GET /dashboard/snapshot`
- **Description**: Returns the hero snapshot (greeting + KPI metrics).
- **Input Parameters**: none
- **Response Example**:
```json
{
  "greeting": "Good afternoon, Alex 👋",
  "subheading": "Here is what's happening in New York City.",
  "metrics": [
    { "label": "Local Policy Changes", "value": 4, "trend": "+12%" },
    { "label": "Nearby Events", "value": 5, "trend": "+8%" }
  ]
}
```

### 4. Featured Stories
- **Method & Path**: `GET /dashboard/stories`
- **Description**: List of featured civic stories with imagery metadata.
- **Input Parameters**: none
- **Response Example**:
```json
[
  {
    "id": "story-1",
    "title": "How the new transit proposal affects Midtown",
    "category": "Transportation",
    "summary": "City planners outline the congestion pricing impact...",
    "image_url": "https://placehold.co/320x200",
    "published_at": "2024-11-28T17:00:00Z"
  }
]
```

### 5. Policies & Rules
- **Method & Path**: `GET /dashboard/policies`
- **Description**: Lists legislative updates and their highlights.
- **Input Parameters**: none
- **Response Example**:
```json
[
  {
    "id": "policy-1",
    "title": "NYC Housing Affordability Act 2024",
    "status": "Active",
    "description": "Updated zoning rules for Midtown & Downtown cores.",
    "highlights": ["Increases moderate-income units", "Expands tenant protections"],
    "tags": ["Housing", "Development"]
  }
]
```

### 6. Discussions
- **Method & Path**: `GET /dashboard/discussions`
- **Description**: Trending discussion threads, metrics, and sentiment.
- **Input Parameters**: none
- **Response Example**:
```json
[
  {
    "id": "disc-1",
    "topic": "Proposed bike lane expansions on 5th Avenue",
    "category": "Transportation",
    "sentiment": "Positive",
    "replies_count": 42,
    "last_active_minutes": 18
  }
]
```

### 7. Events Near You
- **Method & Path**: `GET /dashboard/events`
- **Description**: Retrieves civic meeting and workshop metadata.
- **Input Parameters**: none
- **Response Example**:
```json
[
  {
    "id": "event-1",
    "name": "Downtown Borough Meeting",
    "venue": "Civic Hall",
    "category": "Townhall",
    "start_time": "2024-11-28T18:00:00Z",
    "end_time": "2024-11-28T19:00:00Z"
  }
]
```

### 8. Elections & Ballot Info
- **Method & Path**: `GET /dashboard/elections`
- **Description**: Summaries of ballot propositions with stance guidance.
- **Input Parameters**: none
- **Response Example**:
```json
[
  {
    "id": "elex-1",
    "title": "Proposition 1: Education",
    "description": "Funding to modernize district labs.",
    "stance": "Support",
    "votes": 1240
  }
]
```

### 9. AI Summary
- **Method & Path**: `POST /dashboard/ai-summary`
- **Description**: Calls the Azure Function to generate an AI briefing. Returns a fallback message if the function is not configured.
- **Input Parameters**: none (the backend packages payload internally)
- **Response Example**:
```json
{
  "summary": "Transit upgrades and housing affordability are the top issues today."
}
```
or fallback:
```json
{
  "message": "AI summary unavailable",
  "status": "fallback"
}
```

## Azure Integrations
- **Cosmos DB**: The repository attempts to read `{ type: \"dashboard\" }` documents from the configured container. Missing credentials automatically fall back to stub data so the UI keeps working.
- **Azure Functions**: The `/dashboard/ai-summary` endpoint posts to `https://<function-app>/api/generate-dashboard-summary` with the latest snapshot + story payload. Authentication uses the `x-functions-key` header when provided.

