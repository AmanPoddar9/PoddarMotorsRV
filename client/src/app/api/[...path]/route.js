import { NextResponse } from 'next/server';

const BACKEND_URL = 'https://poddar-motors-rv-hkxu.vercel.app';

async function proxyRequest(request, { params }) {
  // Join the path segments to reconstruct the API path
  const path = params.path.join('/');
  
  // Construct the full backend URL
  const backendUrl = `${BACKEND_URL}/api/${path}`;
  
  // Get the search params (query string) from the request URL
  const url = new URL(request.url);
  const searchParams = url.searchParams.toString();
  const finalUrl = searchParams ? `${backendUrl}?${searchParams}` : backendUrl;

  try {
    // Selectively forward headers to avoid conflicts
    const headers = new Headers();
    
    // Crucial headers to forward
    const headersToForward = ['cookie', 'content-type', 'authorization', 'accept', 'user-agent'];
    
    headersToForward.forEach(key => {
      const value = request.headers.get(key);
      if (value) {
        headers.set(key, value);
      }
    });

    // Prepare fetch options
    const fetchOptions = {
      method: request.method,
      headers: headers,
      // Don't set body for GET/HEAD requests
      body: (request.method !== 'GET' && request.method !== 'HEAD') ? await request.blob() : undefined,
    };

    const response = await fetch(finalUrl, fetchOptions);

    // Get the response body
    const data = await response.blob();

    // Create the Next.js response
    const nextResponse = new NextResponse(data, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    });

    return nextResponse;

  } catch (error) {
    console.error(`Proxy error for path ${path}:`, error);
    return NextResponse.json(
      { error: 'Backend proxy request failed', details: error.message },
      { status: 500 }
    );
  }
}

// Export handler for all standard HTTP methods
export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const DELETE = proxyRequest;
export const PATCH = proxyRequest;
export const OPTIONS = proxyRequest;
