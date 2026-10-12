#!/usr/bin/env bash
set -e

echo "=================================================="
echo "🚀 Deploying SmartHaul OS Production System"
echo "=================================================="
echo "Safety check: Preserving all custom pages, dashboards, and assets."

# Ensure dependencies are installed
if [ ! -d "node_modules" ]; then
  echo "Installing dependencies..."
  npm ci
fi

# Deploy directly via Google Cloud Build & Cloud Run without modifying any source files
echo "Deploying to Cloud Run europe-west1 on drive-partners2..."
gcloud run deploy smarthaul-ui \
  --source . \
  --region=europe-west1 \
  --project=drive-partners2 \
  --allow-unauthenticated

echo "✓ Deployment complete! Visit https://drivepartners.app"