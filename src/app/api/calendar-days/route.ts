import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/calendar-days - Get all calendar days with their regions and event counts
export async function GET() {
  try {
    const calendarDays = await prisma.calendarDay.findMany({
      include: {
        region: true,
        _count: {
          select: { events: true },
        },
      },
      orderBy: { date: "asc" },
    });

    // Transform to include eventsCount
    const transformedDays = calendarDays.map((day) => ({
      ...day,
      eventsCount: day._count.events,
      _count: undefined,
    }));

    return NextResponse.json(transformedDays);
  } catch (error) {
    console.error("Error fetching calendar days:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar days" },
      { status: 500 }
    );
  }
}
