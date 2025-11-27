import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { differenceInDays } from "date-fns";
import { TRIP_DATES } from "@/lib/constants";

// GET /api/dashboard - Get aggregated dashboard data
export async function GET() {
  try {
    // Get settings
    let settings = await prisma.appSettings.findUnique({ where: { id: 1 } });
    if (!settings) {
      settings = await prisma.appSettings.create({
        data: { id: 1, exchangeRate: 5.4, totalBudgetBrl: 10000 },
      });
    }

    // Get expense categories with spent amounts
    const categories = await prisma.expenseCategory.findMany({
      orderBy: { name: "asc" },
    });

    const categoriesWithSpent = await Promise.all(
      categories.map(async (category) => {
        const spent = await prisma.expense.aggregate({
          where: { categoryId: category.id },
          _sum: { amountBrl: true },
        });
        return {
          ...category,
          spent: spent._sum.amountBrl?.toNumber() || 0,
        };
      })
    );

    // Calculate total budget from settings and total spent
    const totalBudget = settings.totalBudgetBrl?.toNumber() || 0;
    const totalSpent = categoriesWithSpent.reduce(
      (sum, cat) => sum + cat.spent,
      0
    );

    // Get region breakdown
    const calendarDaysWithRegions = await prisma.calendarDay.findMany({
      where: { regionId: { not: null } },
      include: { region: true },
    });

    const regionCounts: Record<number, { region: typeof calendarDaysWithRegions[0]['region']; days: number }> = {};
    calendarDaysWithRegions.forEach((day) => {
      if (day.region) {
        if (!regionCounts[day.region.id]) {
          regionCounts[day.region.id] = { region: day.region, days: 0 };
        }
        regionCounts[day.region.id].days++;
      }
    });

    const regionDays = Object.values(regionCounts).map((item) => ({
      region: item.region,
      days: item.days,
      percentage: (item.days / TRIP_DATES.totalDays) * 100,
    }));

    // Get counts
    const flightsCount = await prisma.flight.count();
    const hotelsCount = await prisma.hotel.count();
    const eventsCount = await prisma.event.count();

    // Get upcoming events (first 5)
    const upcomingEvents = await prisma.event.findMany({
      include: {
        calendarDay: { include: { region: true } },
      },
      orderBy: [{ calendarDay: { date: "asc" } }, { startTime: "asc" }],
      take: 5,
    });

    // Calculate days until trip
    const today = new Date();
    const daysUntilTrip = differenceInDays(TRIP_DATES.start, today);

    // Expenses by category for chart
    const expensesByCategory = categoriesWithSpent.map((cat) => ({
      category: cat,
      spent: cat.spent,
      // Calculate percentage based on daily budget × days × travelers (if daily budget set)
      percentage: cat.dailyBudgetPerPerson
        ? (cat.spent / (cat.dailyBudgetPerPerson.toNumber() * TRIP_DATES.totalDays * (settings.numberOfTravelers || 3))) * 100
        : 0,
    }));

    return NextResponse.json({
      totalBudget,
      totalSpent,
      remainingBudget: Math.max(totalBudget - totalSpent, 0),
      exchangeRate: settings.exchangeRate.toNumber(),
      daysUntilTrip: Math.max(daysUntilTrip, 0),
      totalDays: TRIP_DATES.totalDays,
      flightsCount,
      hotelsCount,
      eventsCount,
      expensesByCategory,
      regionDays,
      upcomingEvents,
    });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
