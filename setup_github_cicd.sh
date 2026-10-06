#!/bin/bash
set -e

echo "=== 1. Granting deployment roles to Service Account ==="
for ROLE in roles/run.admin roles/iam.serviceAccountUser roles/cloudbuild.builds.editor roles/storage.admin; do
  gcloud projects add-iam-policy-binding drive-partners2 \
    --member="serviceAccount:smarthaul-ui-sa@drive-partners2.iam.gserviceaccount.com" \
    --role="$ROLE" \
    --condition=None \
    --quiet
done

echo "=== 2. Generating Key and Setting GitHub Secret ==="
gcloud iam service-accounts keys create /tmp/gcp-key.json \
  --iam-account=smarthaul-ui-sa@drive-partners2.iam.gserviceaccount.com

gh secret set GCP_SA_KEY < /tmp/gcp-key.json
rm -f /tmp/gcp-key.json
echo "✓ GitHub secret GCP_SA_KEY configured!"

echo "=== 3. Creating GitHub Actions Workflow ==="
mkdir -p .github/workflows
cat << 'YAML' > .github/workflows/deploy.yml
name: Deploy to Cloud Run

on:
  push:
    branches:
      - main

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Authenticate to Google Cloud
        uses: google-github-actions/auth@v2
        with:
          credentials_json: ${{ secrets.GCP_SA_KEY }}

      - name: Set up Cloud SDK
        uses: google-github-actions/setup-gcloud@v2

      - name: Deploy to Cloud Run (europe-west1)
        run: |
          gcloud run deploy smarthaul-ui \
            --source . \
            --region europe-west1 \
            --project drive-partners2 \
            --allow-unauthenticated
YAML

echo "=== 4. Pushing CI/CD Workflow to GitHub ==="
git add .github/workflows/deploy.yml
git commit -m "ci: add automated Cloud Run deployment on push to main"
git push origin main

echo "🎉 ALL DONE! Automatic GitHub deployment is now 100% active!"
