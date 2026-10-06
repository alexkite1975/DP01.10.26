#!/bin/bash
set -e

echo "🚀 Building & Deploying SmartHaul to Cloud Run (1Gi RAM)..."
gcloud run deploy smarthaul-ui \
  --source . \
  --region europe-west2 \
  --platform managed \
  --allow-unauthenticated \
  --project drive-partners2 \
  --memory 1Gi \
  --cpu 1 \
  --quiet

echo "✅ Optimization & Deployment complete!"
