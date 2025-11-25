import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET /api/expenses/[id]
export async function GET(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const expense = await prisma.expense.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        category: true,
        calendarDay: { include: { region: true } },
      },
    });

    if (!expense) {
      return NextResponse.json({ error: "Expense not found" }, { status: 404 });
    }

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error fetching expense:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense" },
      { status: 500 }
    );
  }
}

// PUT /api/expenses/[id]
export async function PUT(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { date, amountBrl, categoryId, description, calendarDayId } = body;

    const expense = await prisma.expense.update({
      where: { id: parseInt(id, 10) },
      data: {
        date: date ? new Date(date) : undefined,
        amountBrl: amountBrl !== undefined ? parseFloat(amountBrl) : undefined,
        categoryId: categoryId !== undefined ? parseInt(categoryId, 10) : undefined,
        description,
        calendarDayId: calendarDayId !== undefined ? (calendarDayId ? parseInt(calendarDayId, 10) : null) : undefined,
      },
      include: {
        category: true,
        calendarDay: { include: { region: true } },
      },
    });

    return NextResponse.json(expense);
  } catch (error) {
    console.error("Error updating expense:", error);
    return NextResponse.json(
      { error: "Failed to update expense" },
      { status: 500 }
    );
  }
}

// DELETE /api/expenses/[id]
export async function DELETE(request: Request, { params }: RouteParams) {
  try {
    const { id } = await params;
    await prisma.expense.delete({
      where: { id: parseInt(id, 10) },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting expense:", error);
    return NextResponse.json(
      { error: "Failed to delete expense" },
      { status: 500 }
    );
  }
}
