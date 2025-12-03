#!/bin/bash
# Startup script for Azure App Service

# Install dependencies
pip install -r requirements.txt

# Start the application
# Azure App Service provides PORT environment variable, default to 8000 if not set
PORT=${PORT:-8000}
uvicorn app.main:app --host 0.0.0.0 --port $PORT

