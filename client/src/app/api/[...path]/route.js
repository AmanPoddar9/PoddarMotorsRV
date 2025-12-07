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
    // Forward the request to the backend
    const headers = new Headers(request.headers);
    // Remove host header to avoid issues
    headers.delete('host');
    
    // Authorization headers and cookies are important to forward
    // Browsers automatically attach cookies to same-origin requests (to Next.js)
    // We forward them to the backend manually here
    
    // Prepare fetch options
    const fetchOptions = {
      method: request.method,
      headers: headers,
      // Don't set body for GET/HEAD requests
      body: (request.method !== 'GET' && request.method !== 'HEAD') ? await request.blob() : undefined,
      // Important: this allows the backend to receive the cookies
      // and we will forward Set-Cookie back
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
