import { auth0 } from "./lib/auth0";

/**
 *  Proxy is basically adding middleware on to anything
 */
export async function proxy(request: Request) {
  // Note that proxy uses the standard Request type
  return await auth0.middleware(request);
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
