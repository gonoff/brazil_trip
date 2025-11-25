import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/calendar-days/[id] - Get a single calendar day
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const calendarDay = await prisma.calendarDay.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        region: true,
        events: {
          orderBy: { startTime: "asc" },
        },
        expenses: {
          include: { category: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });

    if (!calendarDay) {
      return NextResponse.json(
        { error: "Calendar day not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(calendarDay);
  } catch (error) {
    console.error("Error fetching calendar day:", error);
    return NextResponse.json(
      { error: "Failed to fetch calendar day" },
      { status: 500 }
    );
  }
}

// PUT /api/calendar-days/[id] - Update a calendar day (region, notes)
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { regionId, notes, regionCode } = body;

    // If regionCode is provided, find the region by code
    let finalRegionId = regionId;
    if (regionCode !== undefined) {
      if (regionCode === null) {
        finalRegionId = null;
      } else {
        const region = await prisma.region.findUnique({
          where: { code: regionCode },
        });
        if (region) {
          finalRegionId = region.id;
        }
      }
    }

    const calendarDay = await prisma.calendarDay.update({
      where: { id: parseInt(id, 10) },
      data: {
        ...(finalRegionId !== undefined && { regionId: finalRegionId }),
        ...(notes !== undefined && { notes }),
      },
      include: {
        region: true,
        _count: {
          select: { events: true },
        },
      },
    });

    return NextResponse.json({
      ...calendarDay,
      eventsCount: calendarDay._count.events,
      _count: undefined,
    });
  } catch (error) {
    console.error("Error updating calendar day:", error);
    return NextResponse.json(
      { error: "Failed to update calendar day" },
      { status: 500 }
    );
  }
}
