import { NextResponse } from 'next/server';
import { db } from '@/lib/firestore';

export async function GET() {
  try {
    const snapshot = await db.collection('dvsa_inspections')
      .orderBy('timestamp', 'desc')
      .limit(25)
      .get();

    const inspections = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json({ success: true, count: inspections.length, inspections });
  } catch (error: any) {
    console.error('Firestore GET error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const inspectionRecord = {
      vehicleReg: body.vehicleReg || 'GN21 EVX',
      trailerId: body.trailerId || 'TR-8492',
      trailerHeight: body.trailerHeight || '4.45m',
      driverName: body.driverName || 'Alex (In-Cab Operator)',
      timestamp: new Date().toISOString(),
      status: (body.defectsLogged && body.defectsLogged > 0) ? 'DEFECT_FLAGGED' : 'DVSA_PASSED',
      defectsLogged: body.defectsLogged || 0,
      totalItemsChecked: 32,
      digitalSignature: `DVSA-CERT-${Date.now().toString(36).toUpperCase()}`,
      cloudProject: 'drive-partners2'
    };

    const docRef = await db.collection('dvsa_inspections').add(inspectionRecord);

    return NextResponse.json({
      success: true,
      id: docRef.id,
      record: inspectionRecord
    });
  } catch (error: any) {
    console.error('Firestore POST error:', error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
