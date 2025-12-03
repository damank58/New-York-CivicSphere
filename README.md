# NY Civic Sphere

AI-powered civic engagement platform providing New Yorkers with access to local government info, policy updates, ballot questions, community discussions, and AI-assisted insights. 


## Project Stack

- Backend: FastAPI (Python), Azure-ready APIs
- Frontend: React + TypeScript, Vite, Tailwind CSS
- Cloud: Azure App Service, Functions, Cosmos DB, Cognitive Services


## Project Structure

```
backend/   # FastAPI app for Azure App Service
frontend/  # React + Vite UI
docs/      # API reference and future architecture docs
```

## Prerequisites
- Python 3.10+
- Node.js 18+
- Azure subscriptions for App Service, Functions, and Cosmos DB (when deploying)

## Backend (FastAPI)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate
pip install -e .
uvicorn app.main:app --reload --port 8000
```

Configuration values are read via environment variables (see `backend/env.example`). When `COSMOS_ENDPOINT` or `AZURE_FUNCTIONS_BASE_URL` are absent, the API falls back to rich stub data so the UI still renders.

## Frontend (React / Vite)

```bash
cd frontend
npm install
npm run dev
```

The Vite dev server proxies `/api/*` calls to `http://localhost:8000` so both stacks run in tandem.

## Deployment Notes
- **Azure App Service**: Deploy the FastAPI container or codebase, set the environment variables from the `.env` template, and enable managed identity if Cosmos DB uses RBAC.
- **Cosmos DB**: Store dashboard payload documents `{ "type": "dashboard", "payload": { ... } }`. The repository picks the latest record.
- **Azure Functions**: Provide a Function endpoint under `/api/generate-dashboard-summary` to power the AI assistant. Add the function's host key to `AI_SUGGESTION_FUNCTION_KEY`.

## API Documentation
See `docs/api-reference.md` for each endpoint's method, parameters, and sample JSON payloads.

## Architecture Diagram


<img width="984" height="554" alt="Screenshot 2025-12-03 at 11 54 26 AM" src="https://github.com/user-attachments/assets/28f6d0b1-5f61-4140-8375-9fbd24ddf0f4" />


## Team Members

- Damanpreet Kaur
- Olabimpe Sanni


