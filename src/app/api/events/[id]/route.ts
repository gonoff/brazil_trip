import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/events/[id]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const event = await prisma.event.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        calendarDay: {
          include: { region: true },
        },
      },
    });

    if (!event) {
      return NextResponse.json({ error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    return NextResponse.json(
      { error: "Failed to fetch event" },
      { status: 500 }
    );
  }
}

// PUT /api/events/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const event = await prisma.event.update({
      where: { id: parseInt(id, 10) },
      data: {
        calendarDayId: calendarDayId ? parseInt(calendarDayId, 10) : undefined,
        title,
        description,
        // Use Z suffix to parse time as UTC, avoiding timezone conversion issues
        startTime: startTime !== undefined
          ? (startTime ? new Date(`1970-01-01T${startTime}:00Z`) : null)
          : undefined,
        endTime: endTime !== undefined
          ? (endTime ? new Date(`1970-01-01T${endTime}:00Z`) : null)
          : undefined,
        location,
        category,
      },
      include: {
        calendarDay: {
          include: { region: true },
        },
      },
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json(
      { error: "Failed to update event" },
      { status: 500 }
    );
  }
}

// DELETE /api/events/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.event.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json(
      { error: "Failed to delete event" },
      { status: 500 }
    );
  }
}
