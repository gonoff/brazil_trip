import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/expenses
export async function GET() {
  try {
    const expenses = await prisma.expense.findMany({
      include: {
        category: true,
        calendarDay: { include: { region: true } },
      },
      orderBy: { date: "desc" },
    });

    return NextResponse.json(expenses);
  } catch (error) {
    console.error("Error fetching expenses:", error);
    return NextResponse.json(
      { error: "Failed to fetch expenses" },
      { status: 500 }
    );
  }
}

// POST /api/expenses
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { date, amountBrl, categoryId, description, calendarDayId } = body;

    const expense = await prisma.expense.create({
      data: {
        date: new Date(date),
        amountBrl: parseFloat(amountBrl),
        categoryId: parseInt(categoryId, 10),
        description,
        calendarDayId: calendarDayId ? parseInt(calendarDayId, 10) : null,
      },
      include: {
        category: true,
        calendarDay: { include: { region: true } },
      },
    });

    return NextResponse.json(expense, { status: 201 });
  } catch (error) {
    console.error("Error creating expense:", error);
    return NextResponse.json(
      { error: "Failed to create expense" },
      { status: 500 }
    );
  }
}
