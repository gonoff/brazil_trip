"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Calendar, DollarSign } from "lucide-react";
import {
  CategoryPieChart,
  DailySpendingChart,
  CumulativeSpendingChart,
} from "@/components/widgets/expense-charts";
import { Expense, ExpenseCategory, AppSettings } from "@/types";
import { formatBRL, formatUSD, convertToUSD, formatUTCDate } from "@/lib/utils";

interface ExpenseAnalyticsProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  settings: AppSettings;
}

export function ExpenseAnalytics({ expenses, categories, settings }: ExpenseAnalyticsProps) {
  const [activeTab, setActiveTab] = useState("categories");

  const stats = useMemo(() => {
    if (expenses.length === 0) {
      return null;
    }

    const total = expenses.reduce((sum, e) => sum + Number(e.amountBrl), 0);
    const dates = expenses.map((e) => formatUTCDate(e.date, "yyyy-MM-dd"));
    const uniqueDates = [...new Set(dates)];
    const avgDaily = total / uniqueDates.length;

    // Find highest spending day
    const byDate: Record<string, number> = {};
    expenses.forEach((e) => {
      const dateStr = formatUTCDate(e.date, "yyyy-MM-dd");
      byDate[dateStr] = (byDate[dateStr] || 0) + Number(e.amountBrl);
    });

    const highestDay = Object.entries(byDate).reduce(
      (max, [date, amount]) => (amount > max.amount ? { date, amount } : max),
      { date: "", amount: 0 }
    );

    // Find top category
    const byCategory: Record<number, number> = {};
    expenses.forEach((e) => {
      byCategory[e.categoryId] = (byCategory[e.categoryId] || 0) + Number(e.amountBrl);
    });

    const topCategoryId = Object.entries(byCategory).reduce(
      (max, [id, amount]) => (amount > max.amount ? { id: parseInt(id), amount } : max),
      { id: 0, amount: 0 }
    );

    const topCategory = categories.find((c) => c.id === topCategoryId.id);

    return {
      total,
      avgDaily,
      daysWithExpenses: uniqueDates.length,
      highestDayDate: highestDay.date,
      highestDayAmount: highestDay.amount,
      topCategory: topCategory?.name || "N/A",
      topCategoryAmount: topCategoryId.amount,
      totalExpenses: expenses.length,
    };
  }, [expenses, categories]);

  if (!stats) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          No expenses to analyze. Add some expenses first!
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Spent</p>
                <p className="text-lg font-semibold">{formatBRL(stats.total)}</p>
                <p className="text-xs text-muted-foreground">
                  ~{formatUSD(convertToUSD(stats.total, settings.exchangeRate))}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <TrendingUp className="h-5 w-5 text-accent" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg Daily</p>
                <p className="text-lg font-semibold">{formatBRL(stats.avgDaily)}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.daysWithExpenses} days tracked
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <TrendingDown className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Highest Day</p>
                <p className="text-lg font-semibold">{formatBRL(stats.highestDayAmount)}</p>
                <p className="text-xs text-muted-foreground">
                  {stats.highestDayDate && formatUTCDate(new Date(stats.highestDayDate), "MMM d")}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#C9A227]/10 rounded-lg">
                <Calendar className="h-5 w-5 text-[#C9A227]" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Top Category</p>
                <p className="text-lg font-semibold">{stats.topCategory}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBRL(stats.topCategoryAmount)}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <Card>
        <CardHeader>
          <CardTitle>Spending Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="categories">By Category</TabsTrigger>
              <TabsTrigger value="daily">Daily</TabsTrigger>
              <TabsTrigger value="trends">Trends</TabsTrigger>
            </TabsList>

            <TabsContent value="categories" className="pt-4">
              <CategoryPieChart expenses={expenses} categories={categories} />
            </TabsContent>

            <TabsContent value="daily" className="pt-4">
              <DailySpendingChart expenses={expenses} categories={categories} />
            </TabsContent>

            <TabsContent value="trends" className="pt-4">
              <CumulativeSpendingChart expenses={expenses} settings={settings} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
