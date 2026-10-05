import { NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';

let firestore: Firestore | null = null;
try {
  firestore = new Firestore({ projectId: 'drive-partners2' });
} catch (e) {
  console.warn('Firestore fallback mode');
}

const memoryUsers = new Map<string, any>();

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, email, password, name, role, phone, navApp } = body;

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const userId = email.toLowerCase().trim();

    if (action === 'signup') {
      const userData = {
        id: userId,
        email: userId,
        password,
        name: name || (role === 'driver' ? 'HGV Driver' : 'Fleet Operator'),
        role: role || 'driver',
        phone: phone || '+44 7700 900123',
        licenceNo: 'REED901244A99DP',
        cpcExpiry: '12/05/2030',
        navApp: navApp || 'Google Maps',
        status: 'Available',
        location: 'Northampton (DIRFT Hub)',
        driveHoursRemaining: '4h 45m',
        createdAt: new Date().toISOString()
      };

      if (firestore) {
        try {
          await firestore.collection('users').doc(userId).set(userData);
        } catch (dbErr) {
          memoryUsers.set(userId, userData);
        }
      } else {
        memoryUsers.set(userId, userData);
      }

      return NextResponse.json({ success: true, user: userData });
    }

    if (action === 'login') {
      let user: any = null;
      if (firestore) {
        try {
          const doc = await firestore.collection('users').doc(userId).get();
          if (doc.exists) user = doc.data();
        } catch (e) {
          user = memoryUsers.get(userId);
        }
      } else {
        user = memoryUsers.get(userId);
      }

      if (!user || user.password !== password) {
        return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
      }

      return NextResponse.json({ success: true, user });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
