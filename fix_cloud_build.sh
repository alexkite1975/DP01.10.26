#!/bin/bash
set -e

cd ~/smarthaul-ui

echo "1. Creating production Dockerfile for Cloud Run..."
cat << 'DOCKER_EOF' > Dockerfile
FROM node:18-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm ci --prefer-offline --no-audit || npm install --no-audit

# Copy application code
COPY . .

# Set production environment and build Next.js
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

RUN npm run build

EXPOSE 8080

CMD ["npm", "start"]
DOCKER_EOF

echo "2. Creating .dockerignore..."
cat << 'IGNORE_EOF' > .dockerignore
node_modules
.next
.git
Dockerfile*
.dockerignore
npm-debug.log
IGNORE_EOF

echo "3. Committing Dockerfile and latest Drive Partners workflows to git..."
git add .
git commit -m "fix(build): add production Dockerfile and complete Drive Partners workflows" || echo "No changes to commit"

# Push to remote if git credentials exist
git push origin HEAD || echo "Notice: Push skipped (local changes ready)"

echo "4. Submitting fresh Cloud Build to verify..."
gcloud builds submit --tag europe-west2-docker.pkg.dev/drive-partners2/cloud-run-source-deploy/drivepartners3.1/smarthaul-ui:latest .

echo "=================================================="
echo "✅ Cloud Build Fixed! Step 0 Docker error is resolved."
echo "=================================================="
