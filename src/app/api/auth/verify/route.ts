import { NextResponse } from "next/server";
import { cookies } from "next/headers";

// POST /api/auth/verify - Verify PIN and set session cookie
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { pin } = body;

    const correctPin = process.env.APP_PIN;

    if (!correctPin) {
      console.error("APP_PIN not configured in environment");
      return NextResponse.json(
        { valid: false, error: "Authentication not configured" },
        { status: 500 }
      );
    }

    const isValid = pin === correctPin;

    if (isValid) {
      // Set a simple session cookie
      const cookieStore = await cookies();
      cookieStore.set("brazil-trip-auth", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 days
        path: "/",
      });
    }

    return NextResponse.json({ valid: isValid });
  } catch (error) {
    console.error("Error verifying PIN:", error);
    return NextResponse.json(
      { valid: false, error: "Failed to verify PIN" },
      { status: 500 }
    );
  }
}

// DELETE /api/auth/verify - Clear session (logout)
export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("brazil-trip-auth");
  return NextResponse.json({ success: true });
}
