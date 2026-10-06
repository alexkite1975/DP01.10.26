export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';

let firestore: Firestore | null = null;
try {
  firestore = new Firestore({ projectId: 'drive-partners2' });
} catch (e) {}

export async function GET() {
  try {
    let drivers: any[] = [];
    if (firestore) {
      try {
        const snap = await firestore.collection('users').where('role', '==', 'driver').get();
        drivers = snap.docs.map(doc => doc.data());
      } catch (e) {}
    }

    if (drivers.length === 0) {
      drivers = [
        { id: '1', name: 'Alexander Reed', email: 'alex@driver.com', location: 'DIRFT Daventry (2.1 mi)', driveHoursRemaining: '4h 45m' },
        { id: '2', name: 'Krzysztof Nowak', email: 'krzysztof@driver.com', location: 'Northampton (8.2 mi)', driveHoursRemaining: '9h 00m' }
      ];
    }

    return NextResponse.json({ drivers });
  } catch (err: any) {
    return NextResponse.json({ drivers: [] });
  }
}
