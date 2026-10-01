export interface VehicleTelemetryPing {
  vehicleId: string;
  driverId: string;
  shiftId?: string;
  timestamp: string;
  latitude: number;
  longitude: number;
  altitudeMeters?: number;
  speedKmh: number;
  headingDegrees: number;
  ignition: 'ON' | 'OFF' | 'ACCESSORY';
  odometerKm: number;
  fuelLevelPercent: number;
}

export interface ProximityVehicleResult {
  vehicleId: string;
  distanceKm: number;
  coordinates: { latitude: number; longitude: number };
  lastPingTime: string;
  speedKmh: number;
  headingDegrees: number;
}
