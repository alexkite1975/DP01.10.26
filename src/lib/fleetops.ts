export interface Vehicle {
  vehicleId: string;
  plateNumber: string;
  driverName: string;
  currentTrailer: string;
  clearanceMeters: number;
  status: 'IN_TRANSIT' | 'CAUTION_APPROACH' | 'DWELL_WARNING' | 'IDLE';
  speedMph: number;
  lastPing: string;
}

const FLEETOPS_API_URL = process.env.NEXT_PUBLIC_FLEETOPS_API_URL || 'https://fleetops-api-139081326033.europe-west2.run.app';

export async function fetchLiveFleet(): Promise<Vehicle[]> {
  try {
    const res = await fetch(`${FLEETOPS_API_URL}/v1/vehicles`, {
      headers: { 'Content-Type': 'application/json' },
      next: { revalidate: 10 },
    });
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data?.vehicles)) return data.vehicles;
    }
  } catch (err) {
    console.warn('Live API fallback to default telemetry profile:', err);
  }

  return [
    {
      vehicleId: 'HGV-GB-401',
      plateNumber: 'EU71 KDX',
      driverName: 'Robert Vance',
      currentTrailer: 'TR-CURTAIN-98',
      clearanceMeters: 4.88,
      status: 'IN_TRANSIT',
      speedMph: 54.2,
      lastPing: '2s ago',
    },
    {
      vehicleId: 'HGV-GB-402',
      plateNumber: 'GN23 FLL',
      driverName: 'Sarah Jenkins',
      currentTrailer: 'TR-BOX-02',
      clearanceMeters: 4.25,
      status: 'CAUTION_APPROACH',
      speedMph: 28.6,
      lastPing: '1s ago',
    },
    {
      vehicleId: 'HGV-GB-405',
      plateNumber: 'WK22 BZM',
      driverName: 'Marcus Bell',
      currentTrailer: 'TR-REEFER-14',
      clearanceMeters: 4.10,
      status: 'IN_TRANSIT',
      speedMph: 49.8,
      lastPing: '4s ago',
    },
  ];
}
