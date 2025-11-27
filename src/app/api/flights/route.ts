import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/flights - Get all flights
export async function GET() {
  try {
    const flights = await prisma.flight.findMany({
      orderBy: { departureDatetime: "asc" },
    });

    return NextResponse.json(flights);
  } catch (error) {
    console.error("Error fetching flights:", error);
    return NextResponse.json(
      { error: "Failed to fetch flights" },
      { status: 500 }
    );
  }
}

// POST /api/flights - Create a new flight
export async function POST(request: Request) {
  try {
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

    // Append 'Z' to force UTC interpretation - treat times as local airport time
    const parseAsUTC = (datetime: string) => new Date(datetime + ":00.000Z");

    const flight = await prisma.flight.create({
      data: {
        airline,
        flightNumber,
        departureCity,
        arrivalCity,
        departureDatetime: parseAsUTC(departureDatetime),
        arrivalDatetime: parseAsUTC(arrivalDatetime),
        confirmationNumber,
        price: price ? parseFloat(price) : null,
        currency: currency || "BRL",
        notes,
      },
    });

    return NextResponse.json(flight, { status: 201 });
  } catch (error) {
    console.error("Error creating flight:", error);
    return NextResponse.json(
      { error: "Failed to create flight" },
      { status: 500 }
    );
  }
}
