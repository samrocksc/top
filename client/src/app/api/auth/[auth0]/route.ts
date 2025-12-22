// client/src/app/api/auth/[auth0]/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Since the automatic route mounting isn't working, we'll implement the basic redirects manually
export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const pathSegments = url.pathname.split('/').filter(Boolean);
  const action = pathSegments[pathSegments.length - 1];
  
  if (action === 'login') {
    // Redirect to Auth0 for login
    const authUrl = new URL(`${process.env.NEXT_AUTH0_ISSUER_BASE_URL}/authorize`);
    authUrl.searchParams.set('response_type', 'code');
    authUrl.searchParams.set('client_id', process.env.NEXT_AUTH0_CLIENT_ID || '');
    authUrl.searchParams.set('redirect_uri', `${process.env.NEXT_AUTH0_BASE_URL}/api/auth/callback`);
    authUrl.searchParams.set('scope', 'openid profile email');
    authUrl.searchParams.set('audience', process.env.NEXT_AUTH0_API_AUDIENCE || '');
    
    console.log('Redirecting to Auth0:', authUrl.toString());
    return NextResponse.redirect(authUrl.toString());
  }
  
  if (action === 'logout') {
    // Redirect to Auth0 for logout
    const logoutUrl = new URL(`${process.env.NEXT_AUTH0_ISSUER_BASE_URL}/v2/logout`);
    logoutUrl.searchParams.set('returnTo', process.env.NEXT_AUTH0_BASE_URL || 'http://localhost:3000');
    logoutUrl.searchParams.set('client_id', process.env.NEXT_AUTH0_CLIENT_ID || '');
    
    // Create a simple HTML page that clears localStorage and redirects
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Logging Out</title>
      </head>
      <body>
        <script>
          // Clear authentication data from localStorage
          localStorage.removeItem('auth0.isAuthenticated');
          localStorage.removeItem('auth0.access_token');
          
          // Redirect to Auth0 for logout
          window.location.href = '${logoutUrl.toString()}';
        </script>
      </body>
      </html>
    `;
    
    return new NextResponse(html, {
      status: 200,
      headers: {
        'Content-Type': 'text/html',
      },
    });
  }
  
  // Don't handle callback here, let the dedicated callback route handle it
  if (action === 'callback') {
    // This will allow the /api/auth/callback/route.ts to handle the request
    return new NextResponse('This route is handled by a separate handler', { status: 404 });
  }
  
  return new NextResponse('Not found', { status: 404 });
}