import { NextRequest, NextResponse } from 'next/server';

const BACKEND_URL = 'https://poddar-motors-rv-hkxu.vercel.app';

export async function POST(request) {
  try {
    const body = await request.text();
    
    const response = await fetch(`${BACKEND_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: body,
    });

    const data = await response.text();
    
    // Create response with the backend's response body
    const nextResponse = new NextResponse(data, {
      status: response.status,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Forward all Set-Cookie headers from backend
    const setCookieHeaders = response.headers.getSetCookie?.() || [];
    setCookieHeaders.forEach(cookie => {
      nextResponse.headers.append('Set-Cookie', cookie);
    });

    return nextResponse;
  } catch (error) {
    console.error('Proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy request failed' },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';
