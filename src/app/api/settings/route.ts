import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/settings
export async function GET() {
  try {
    let settings = await prisma.appSettings.findUnique({
      where: { id: 1 },
    });

    // Create default settings if they don't exist
    if (!settings) {
      settings = await prisma.appSettings.create({
        data: {
          id: 1,
          exchangeRate: 5.4,
          totalBudgetBrl: 10000,
          numberOfTravelers: 3,
        },
      });
    }

    // Convert Decimal fields to numbers
    return NextResponse.json({
      ...settings,
      exchangeRate: parseFloat(settings.exchangeRate.toString()),
      totalBudgetBrl: settings.totalBudgetBrl ? parseFloat(settings.totalBudgetBrl.toString()) : null,
    });
  } catch (error) {
    console.error("Error fetching settings:", error);
    return NextResponse.json(
      { error: "Failed to fetch settings" },
      { status: 500 }
    );
  }
}

// PUT /api/settings
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { exchangeRate, totalBudgetBrl, numberOfTravelers } = body;

    const settings = await prisma.appSettings.upsert({
      where: { id: 1 },
      update: {
        exchangeRate: exchangeRate !== undefined ? parseFloat(exchangeRate) : undefined,
        totalBudgetBrl: totalBudgetBrl !== undefined ? (totalBudgetBrl ? parseFloat(totalBudgetBrl) : null) : undefined,
        numberOfTravelers: numberOfTravelers !== undefined ? parseInt(numberOfTravelers, 10) : undefined,
      },
      create: {
        id: 1,
        exchangeRate: exchangeRate ? parseFloat(exchangeRate) : 5.4,
        totalBudgetBrl: totalBudgetBrl ? parseFloat(totalBudgetBrl) : 10000,
        numberOfTravelers: numberOfTravelers ? parseInt(numberOfTravelers, 10) : 3,
      },
    });

    // Convert Decimal fields to numbers
    return NextResponse.json({
      ...settings,
      exchangeRate: parseFloat(settings.exchangeRate.toString()),
      totalBudgetBrl: settings.totalBudgetBrl ? parseFloat(settings.totalBudgetBrl.toString()) : null,
    });
  } catch (error) {
    console.error("Error updating settings:", error);
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
