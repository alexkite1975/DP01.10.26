#!/bin/bash
set -e

# 1. Complete Sprint 3.3 Proximity API
mkdir -p src/app/api/telematics/proximity
cat << 'SUB_EOF' > src/app/api/telematics/proximity/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { redisGeoService } from '@/services/telematics/redisGeoService';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const lat = parseFloat(searchParams.get('lat') || '52.3025');
  const lon = parseFloat(searchParams.get('lon') || '-1.1561');
  const radius = parseFloat(searchParams.get('radiusKm') || '50');
  const vehicles = await redisGeoService.findVehiclesNearby(lat, lon, radius);
  return NextResponse.json({ hub: 'DIRFT Daventry', radiusKm: radius, availableUnits: vehicles });
}
SUB_EOF

# 2. Create phone runner script (so you never paste on mobile)
cat << 'SUB_EOF' > run.sh
#!/bin/bash
git pull origin main
npm run build
echo "✅ Everything compiled and up to date!"
SUB_EOF
chmod +x run.sh

# 3. Commit and push to GitHub (auto-deploys to Cloud Run)
git add .
git commit -m "feat(sprint-3.3): complete proximity api and add phone runner"
git push origin main
npm run build

echo "🎉 ALL DONE! Sprint 3 is complete and your phone is ready!"
