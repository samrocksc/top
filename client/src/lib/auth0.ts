// client/src/lib/auth0.ts
import { initAuth0 } from '@auth0/nextjs-auth0';

export default initAuth0({
  issuerBaseURL: process.env.NEXT_AUTH0_ISSUER_BASE_URL,
  clientID: process.env.NEXT_AUTH0_CLIENT_ID,
  secret: 'your-secret-key-at-least-32-characters-long',
  authorizationParams: {
    scope: 'openid profile email',
    audience: process.env.NEXT_AUTH0_API_AUDIENCE,
  },
  routes: {
    callback: '/api/auth/callback',
    postLogoutRedirect: '/',
  },
});

export { withApiAuthRequired, withPageAuthRequired } from '@auth0/nextjs-auth0/server';