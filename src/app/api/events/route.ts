import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/events
export async function GET() {
  try {
    const events = await prisma.event.findMany({
      include: {
        calendarDay: {
          include: { region: true },
        },
      },
      orderBy: [{ calendarDay: { date: "asc" } }, { startTime: "asc" }],
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}

// POST /api/events
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      calendarDayId,
      title,
      description,
      startTime,
      endTime,
      location,
      category,
    } = body;

    const event = await prisma.event.create({
      data: {
        calendarDayId: parseInt(calendarDayId, 10),
        title,
        description,
        startTime: startTime ? new Date(`1970-01-01T${startTime}:00`) : null,
        endTime: endTime ? new Date(`1970-01-01T${endTime}:00`) : null,
        location,
        category,
      },
      include: {
        calendarDay: {
          include: { region: true },
        },
      },
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json(
      { error: "Failed to create event" },
      { status: 500 }
    );
  }
}
