import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://poddar-motors-rv-hkxu.vercel.app';

export async function GET(request) {
  try {
    const url = new URL(request.url);
    const searchParams = url.searchParams.toString();
    const finalUrl = searchParams 
      ? `${BACKEND_URL}/api/listings?${searchParams}` 
      : `${BACKEND_URL}/api/listings`;

    console.log('Fetching listings from:', finalUrl);

    const response = await fetch(finalUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Forward minimal headers
        'Accept': 'application/json',
      },
      // Important: No cache for fresh admin data
      cache: 'no-store',
    });

    if (!response.ok) {
      console.error(`Backend returned ${response.status}`);
      return NextResponse.json({ error: 'Backend error' }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Listings proxy error:', error);
    return NextResponse.json(
      { error: 'Proxy failed', details: error.message },
      { status: 500 }
    );
  }
}
