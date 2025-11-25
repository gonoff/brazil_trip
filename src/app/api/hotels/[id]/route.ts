import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/hotels/[id]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const hotel = await prisma.hotel.findUnique({
      where: { id: parseInt(id, 10) },
      include: { region: true },
    });

    if (!hotel) {
      return NextResponse.json({ error: "Hotel not found" }, { status: 404 });
    }

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error fetching hotel:", error);
    return NextResponse.json(
      { error: "Failed to fetch hotel" },
      { status: 500 }
    );
  }
}

// PUT /api/hotels/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
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

    const hotel = await prisma.hotel.update({
      where: { id: parseInt(id, 10) },
      data: {
        name,
        address,
        city,
        regionId: regionId !== undefined ? (regionId ? parseInt(regionId, 10) : null) : undefined,
        checkInDate: checkInDate ? new Date(checkInDate) : undefined,
        checkOutDate: checkOutDate ? new Date(checkOutDate) : undefined,
        confirmationNumber,
        pricePerNight: pricePerNight !== undefined ? (pricePerNight ? parseFloat(pricePerNight) : null) : undefined,
        totalCost: totalCost !== undefined ? (totalCost ? parseFloat(totalCost) : null) : undefined,
        currency,
        notes,
      },
      include: { region: true },
    });

    return NextResponse.json(hotel);
  } catch (error) {
    console.error("Error updating hotel:", error);
    return NextResponse.json(
      { error: "Failed to update hotel" },
      { status: 500 }
    );
  }
}

// DELETE /api/hotels/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.hotel.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting hotel:", error);
    return NextResponse.json(
      { error: "Failed to delete hotel" },
      { status: 500 }
    );
  }
}
