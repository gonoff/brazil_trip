import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/flights/[id]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const flight = await prisma.flight.findUnique({
      where: { id: parseInt(id, 10) },
    });

    if (!flight) {
      return NextResponse.json({ error: "Flight not found" }, { status: 404 });
    }

    return NextResponse.json(flight);
  } catch (error) {
    console.error("Error fetching flight:", error);
    return NextResponse.json(
      { error: "Failed to fetch flight" },
      { status: 500 }
    );
  }
}

// PUT /api/flights/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const {
      airline,
      flightNumber,
      departureCity,
      arrivalCity,
      departureDatetime,
      arrivalDatetime,
      confirmationNumber,
      price,
      currency,
      notes,
    } = body;

    const flight = await prisma.flight.update({
      where: { id: parseInt(id, 10) },
      data: {
        airline,
        flightNumber,
        departureCity,
        arrivalCity,
        departureDatetime: departureDatetime ? new Date(departureDatetime) : undefined,
        arrivalDatetime: arrivalDatetime ? new Date(arrivalDatetime) : undefined,
        confirmationNumber,
        price: price !== undefined ? (price ? parseFloat(price) : null) : undefined,
        currency,
        notes,
      },
    });

    return NextResponse.json(flight);
  } catch (error) {
    console.error("Error updating flight:", error);
    return NextResponse.json(
      { error: "Failed to update flight" },
      { status: 500 }
    );
  }
}

// DELETE /api/flights/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.flight.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting flight:", error);
    return NextResponse.json(
      { error: "Failed to delete flight" },
      { status: 500 }
    );
  }
}
