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
