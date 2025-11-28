import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Skip auth check for the auth verification endpoint itself
  if (request.nextUrl.pathname === "/api/auth/verify") {
    return NextResponse.next();
  }

  // Check for auth cookie on API routes
  if (request.nextUrl.pathname.startsWith("/api/")) {
    const authCookie = request.cookies.get("brazil-trip-auth");

    if (!authCookie || authCookie.value !== "authenticated") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: "/api/:path*",
};
