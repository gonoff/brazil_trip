import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Let all requests through - auth is handled client-side by AuthGate
  // The cookie is still set for potential future server-side auth needs
  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
