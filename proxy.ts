// proxy.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Export as named "proxy" function
export function proxy(_request: NextRequest) {
  const response = NextResponse.next();

  // Add CSP header that allows Firebase and reCAPTCHA
  response.headers.set(
    "Content-Security-Policy",
    [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://apis.google.com https://www.gstatic.com https://www.google.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "connect-src 'self' https://identitytoolkit.googleapis.com https://securetoken.googleapis.com wss://localhost:3000 https://www.google.com",
      "frame-src 'self' https://www.google.com",
      "img-src 'self' data: https:",
      "font-src 'self' https://fonts.gstatic.com",
    ].join("; ")
  );

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
