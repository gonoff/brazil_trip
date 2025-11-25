import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/hotels
export async function GET() {
  try {
    const hotels = await prisma.hotel.findMany({
      include: { region: true },
      orderBy: { checkInDate: "asc" },
    });

    return NextResponse.json(hotels);
  } catch (error) {
    console.error("Error fetching hotels:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotels" },
      { status: 500 }
    );
  }
}

// POST /api/hotels
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      address,
      city,
      regionId,
      checkInDate,
      checkOutDate,
      confirmationNumber,
      pricePerNight,
      totalCost,
      currency,
      notes,
    } = body;

    const hotel = await prisma.hotel.create({
      data: {
        name,
        address,
        city,
        regionId: regionId ? parseInt(regionId, 10) : null,
        checkInDate: new Date(checkInDate),
        checkOutDate: new Date(checkOutDate),
        confirmationNumber,
        pricePerNight: pricePerNight ? parseFloat(pricePerNight) : null,
        totalCost: totalCost ? parseFloat(totalCost) : null,
        currency: currency || "BRL",
        notes,
      },
      include: { region: true },
    });

    return NextResponse.json(hotel, { status: 201 });
  } catch (error) {
    console.error("Error creating hotel:", error);
    return NextResponse.json(
      { error: "Failed to create hotel" },
      { status: 500 }
    );
  }
}
