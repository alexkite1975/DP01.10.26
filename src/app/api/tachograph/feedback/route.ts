import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { scanId, status } = body;
    return NextResponse.json({
      success: true,
      scanId,
      status: status || 'CONFIRMED_ACCURATE',
      reinforcedAt: new Date().toISOString()
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: 'Failed to record feedback', details: err.message },
      { status: 500 }
    );
  }
}
