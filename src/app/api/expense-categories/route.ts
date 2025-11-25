import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// GET /api/expense-categories - Get all categories with spent amounts
export async function GET() {
  try {
    const categories = await prisma.expenseCategory.findMany({
      orderBy: { name: "asc" },
      include: {
        _count: { select: { expenses: true } },
      },
    });

    // Calculate spent amount for each category
    const categoriesWithSpent = await Promise.all(
      categories.map(async (category) => {
        const spent = await prisma.expense.aggregate({
          where: { categoryId: category.id },
          _sum: { amountBrl: true },
        });

        return {
          ...category,
          spent: spent._sum.amountBrl?.toNumber() || 0,
          _count: undefined,
        };
      })
    );

    return NextResponse.json(categoriesWithSpent);
  } catch (error) {
    console.error("Error fetching expense categories:", error);
    return NextResponse.json(
      { error: "Failed to fetch expense categories" },
      { status: 500 }
    );
  }
}

// PUT /api/expense-categories - Update category budget limits
export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { id, budgetLimit, warningThresholdPercent } = body;

    const category = await prisma.expenseCategory.update({
      where: { id },
      data: {
        budgetLimit: budgetLimit !== undefined ? parseFloat(budgetLimit) : undefined,
        warningThresholdPercent: warningThresholdPercent !== undefined ? warningThresholdPercent : undefined,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("Error updating expense category:", error);
    return NextResponse.json(
      { error: "Failed to update expense category" },
      { status: 500 }
    );
  }
}
