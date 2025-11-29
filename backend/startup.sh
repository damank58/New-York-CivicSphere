#!/bin/bash
# Startup script for Azure App Service

# Install dependencies
pip install -e .

# Start the application
uvicorn app.main:app --host 0.0.0.0 --port 8000

