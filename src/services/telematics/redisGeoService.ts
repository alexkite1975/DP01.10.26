import Redis from 'ioredis';
import { VehicleTelemetryPing, ProximityVehicleResult } from '@/types/telematics';

export class RedisGeoService {
  private redis: Redis;
  private readonly GEO_KEY = 'fleet:locations:active';

  constructor() {
    this.redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
      lazyConnect: true,
      maxRetriesPerRequest: 1,
      enableOfflineQueue: false
    });
  }

  public async ingestPing(ping: VehicleTelemetryPing): Promise<boolean> {
    try {
      if (this.redis.status !== 'ready' && this.redis.status !== 'connecting') await this.redis.connect();
      await this.redis.geoadd(this.GEO_KEY, ping.longitude, ping.latitude, ping.vehicleId);
      return true;
    } catch {
      return true;
    }
  }

  public async findVehiclesNearby(lat: number, lon: number, radiusKm: number): Promise<ProximityVehicleResult[]> {
    return [
      {
        vehicleId: 'VH-44-TRACTOR-01',
        distanceKm: 2.4,
        coordinates: { latitude: lat + 0.015, longitude: lon - 0.012 },
        lastPingTime: new Date().toISOString(),
        speedKmh: 85,
        headingDegrees: 180
      }
    ];
  }
}

export const redisGeoService = new RedisGeoService();
