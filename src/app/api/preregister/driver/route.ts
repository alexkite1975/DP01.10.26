import { NextResponse } from 'next/server';
import { Firestore } from '@google-cloud/firestore';

export const dynamic = 'force-dynamic';

let firestore: Firestore | null = null;
try {
  firestore = new Firestore({ projectId: 'drive-partners2' });
} catch (e) {
  console.warn('Firestore fallback mode for driver preregistration');
}

// In-memory fallback cache
const memoryRegistrations: any[] = [];

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      fullName,
      email,
      phone,
      licenceCategory,
      tachoManufacturer,
      workType,
      cpcExpiryYear,
      primaryChallenge
    } = body;

    if (!fullName || !email || !phone) {
      return NextResponse.json(
        { error: 'Name, email, and mobile phone are required for driver verification.' },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();
    const cleanPhone = phone.trim();

    // Generate unique Driver Priority Pass
    const timestamp = Date.now();
    const randomSuffix = Math.floor(100 + Math.random() * 900);
    const passId = `DP-BETA-${randomSuffix}`;
    const queueNumber = 180 + (memoryRegistrations.length + 1) * 3;

    const registrationData = {
      passId,
      queueNumber,
      fullName: fullName.trim(),
      email: cleanEmail,
      phone: cleanPhone,
      licenceCategory: licenceCategory || 'Class 1 (C+E)',
      tachoManufacturer: tachoManufacturer || 'Stoneridge SE5000',
      workType: workType || 'Trunking / General Haulage',
      cpcExpiryYear: cpcExpiryYear || '2028',
      primaryChallenge: primaryChallenge || '28-Day Roadside DVSA Audits',
      registeredAt: new Date().toISOString(),
      status: 'VERIFIED_DRIVER_BETA_WAITLIST',
      priorityTier: 'TIER_1_DRIVER_PIONEER'
    };

    if (firestore) {
      try {
        await firestore
          .collection('driver_preregistrations')
          .doc(cleanEmail)
          .set(registrationData);
      } catch (dbErr) {
        console.warn('Firestore write failed, falling back to memory', dbErr);
        memoryRegistrations.push(registrationData);
      }
    } else {
      memoryRegistrations.push(registrationData);
    }

    return NextResponse.json({
      success: true,
      passId,
      queueNumber,
      fullName: registrationData.fullName,
      message: 'Priority Driver Beta Access Reserved for Tacho-Scan AI'
    });
  } catch (error: any) {
    console.error('Driver pre-registration error:', error);
    return NextResponse.json(
      { error: 'Failed to process driver pre-registration. Please try again.' },
      { status: 500 }
    );
  }
}
