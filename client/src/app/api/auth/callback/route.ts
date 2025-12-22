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
    
    // Set a cookie to indicate the user is logged in
    const response = NextResponse.redirect(process.env.NEXT_AUTH0_BASE_URL || 'http://localhost:3000');
    response.cookies.set('auth0.isAuthenticated', 'true', {
      httpOnly: false, // Allow client-side access for demo purposes
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Authentication error:', error);
    return new NextResponse(`Authentication failed: ${error.message}`, { status: 500 });
  }
}