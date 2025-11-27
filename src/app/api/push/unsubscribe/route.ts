import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { endpoint } = await request.json();

    await prisma.pushSubscription.delete({
      where: { endpoint },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete push subscription:", error);
    return NextResponse.json(
      { error: "Failed to delete subscription" },
      { status: 500 }
    );
  }
}
