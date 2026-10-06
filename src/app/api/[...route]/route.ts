import { NextRequest, NextResponse } from 'next/server';

const FLEETOPS_API_URL = 'https://fleetops-api-139081326033.europe-west2.run.app';
const AUTH_HEADER = 'Basic ' + Buffer.from('AlexKite1975:Kite-Tacho-2026!Uk').toString('base64');

async function handleProxy(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  const search = req.nextUrl.search;
  const targetUrl = `${FLEETOPS_API_URL}${pathname}${search}`;

  const headers = new Headers(req.headers);
  headers.set('Authorization', AUTH_HEADER);
  headers.delete('host');

  try {
    const body = ['GET', 'HEAD'].includes(req.method) ? undefined : await req.arrayBuffer();
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body,
      cache: 'no-store',
    });

    const data = await response.arrayBuffer();
    return new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });
  } catch (err: any) {
    return NextResponse.json({ error: 'Proxy dispatch failed', details: err.message }, { status: 502 });
  }
}

export const GET = handleProxy;
export const POST = handleProxy;
export const PUT = handleProxy;
export const DELETE = handleProxy;
