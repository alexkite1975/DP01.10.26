export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { redisGeoService } from '@/services/telematics/redisGeoService';
import { VehicleTelemetryPing } from '@/types/telematics';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const ping: VehicleTelemetryPing = {
      vehicleId: body.vehicleId || 'DG21EDP',
      driverId: body.driverId || 'DRV-8492',
      shiftId: body.shiftId,
      timestamp: body.timestamp || new Date().toISOString(),
      latitude: Number(body.latitude || 52.3025),
      longitude: Number(body.longitude || -1.1561),
      speedKmh: Number(body.speedKmh || 88),
      headingDegrees: Number(body.headingDegrees || 164),
      ignition: body.ignition || 'ON',
      odometerKm: Number(body.odometerKm || 142850),
      fuelLevelPercent: Number(body.fuelLevelPercent || 78)
    };
    await redisGeoService.ingestPing(ping);
    return NextResponse.json({ status: 'ACKNOWLEDGED', vehicleId: ping.vehicleId });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const nearby = await redisGeoService.findVehiclesNearby(52.3025, -1.1561, 50);
  return NextResponse.json({ vehicles: nearby });
}
