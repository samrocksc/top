// client/src/app/api/auth/callback/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');
  const errorDescription = searchParams.get('error_description');
  
  // Handle Auth0 errors
  if (error) {
    console.error('Auth0 error:', error, errorDescription);
    return new NextResponse(`Authentication failed: ${error} - ${errorDescription}`, { status: 400 });
  }
  
  // Handle missing code
  if (!code) {
    return new NextResponse('Missing authorization code. This endpoint should only be accessed through Auth0 callback.', { status: 400 });
  }
  
  try {
    // Exchange the authorization code for tokens
    const tokenResponse = await fetch(`${process.env.NEXT_AUTH0_ISSUER_BASE_URL}/oauth/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        grant_type: 'authorization_code',
        client_id: process.env.NEXT_AUTH0_CLIENT_ID,
        client_secret: process.env.NEXT_AUTH0_CLIENT_SECRET,
        code,
        redirect_uri: `${process.env.NEXT_AUTH0_BASE_URL}/api/auth/callback`,
      }),
    });
    
    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text();
      throw new Error(`Token exchange failed: ${tokenResponse.statusText} - ${errorText}`);
    }
    
    const tokens = await tokenResponse.json();
    
    console.log('Received tokens from Auth0:', Object.keys(tokens));
    
    // Create a simple HTML page that stores the token in localStorage and redirects
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Authentication Success</title>
      </head>
      <body>
        <script>
          // Store the access token in localStorage
          ${tokens.access_token ? `localStorage.setItem('auth0.access_token', '${tokens.access_token}');` : ''}
          localStorage.setItem('auth0.isAuthenticated', 'true');
          
          // Redirect to the main application
          window.location.href = '${process.env.NEXT_AUTH0_BASE_URL || 'http://localhost:3000'}';
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
  } catch (error) {
    console.error('Authentication error:', error);
    return new NextResponse(`Authentication failed: ${error.message}`, { status: 500 });
  }
}