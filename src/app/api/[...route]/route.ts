export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';
import { app } from '@/server/fleetops';

// Helper to adapt NextRequest to Express and return a Promise<NextResponse>
function handleRequest(req: NextRequest): Promise<NextResponse> {
  return new Promise(async (resolve) => {
    const url = new URL(req.url);
    const bodyText = req.method !== 'GET' && req.method !== 'HEAD' ? await req.text() : undefined;
    
    let parsedBody = undefined;
    if (bodyText) {
      try {
        parsedBody = JSON.parse(bodyText);
      } catch {
        parsedBody = bodyText;
      }
    }

    // Mock Express req
    const expressReq: any = {
      method: req.method,
      url: url.pathname + url.search,
      path: url.pathname,
      query: Object.fromEntries(url.searchParams.entries()),
      headers: Object.fromEntries(req.headers.entries()),
      body: parsedBody,
      rawBody: bodyText,
    };

    let responseHeaders = new Headers();
    let responseStatus = 200;
    let responseBody: any = null;

    // Mock Express res
    const expressRes: any = {
      statusCode: 200,
      setHeader: (name: string, value: string) => {
        responseHeaders.set(name, value);
        return expressRes;
      },
      header: (name: string, value: string) => {
        responseHeaders.set(name, value);
        return expressRes;
      },
      status: (code: number) => {
        responseStatus = code;
        return expressRes;
      },
      json: (data: any) => {
        responseHeaders.set('content-type', 'application/json');
        resolve(new NextResponse(JSON.stringify(data), {
          status: responseStatus,
          headers: responseHeaders,
        }));
      },
      send: (data: any) => {
        resolve(new NextResponse(data, {
          status: responseStatus,
          headers: responseHeaders,
        }));
      },
      end: (data?: any) => {
        resolve(new NextResponse(data, {
          status: responseStatus,
          headers: responseHeaders,
        }));
      },
    };

    try {
      app(expressReq, expressRes);
    } catch (err: any) {
      resolve(new NextResponse(JSON.stringify({ error: err.message }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      }));
    }
  });
}

export async function GET(req: NextRequest) {
  return handleRequest(req);
}

export async function POST(req: NextRequest) {
  return handleRequest(req);
}

export async function PUT(req: NextRequest) {
  return handleRequest(req);
}

export async function DELETE(req: NextRequest) {
  return handleRequest(req);
}

export async function PATCH(req: NextRequest) {
  return handleRequest(req);
}
