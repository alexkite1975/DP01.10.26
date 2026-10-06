export const dynamic = 'force-dynamic';
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
