import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/regions - Get all regions
export async function GET() {
  try {
    const regions = await prisma.region.findMany({
      orderBy: { name: "asc" },
    });

    return NextResponse.json(regions);
  } catch (error) {
    console.error("Error fetching regions:", error);
    return NextResponse.json(
      { error: "Failed to fetch regions" },
      { status: 500 }
    );
  }
}
