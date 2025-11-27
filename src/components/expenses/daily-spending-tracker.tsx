"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatBRL, formatUSD, formatUTCDate } from "@/lib/utils";
import { getBudgetStatus, BUDGET_STATUS } from "@/lib/constants";
import { ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Expense, ExpenseCategory, AppSettings } from "@/types";

interface DailySpendingTrackerProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  settings: AppSettings;
}

interface DailySpending {
  date: string;
  displayDate: string;
  byCategory: Record<number, number>;
  total: number;
}

export function DailySpendingTracker({
  expenses,
  categories,
  settings,
}: DailySpendingTrackerProps) {
  const [expandedDays, setExpandedDays] = useState<Set<string>>(new Set());

  const { exchangeRate, numberOfTravelers } = settings;

  // Group expenses by date and category
  const dailySpending = useMemo(() => {
    const byDate: Record<string, DailySpending> = {};

    expenses.forEach((expense) => {
      const dateStr = formatUTCDate(expense.date, "yyyy-MM-dd");
      const displayDate = formatUTCDate(expense.date, "EEE, MMM d");

      if (!byDate[dateStr]) {
        byDate[dateStr] = {
          date: dateStr,
          displayDate,
          byCategory: {},
          total: 0,
        };
      }

      const amount = Number(expense.amountBrl);
      byDate[dateStr].byCategory[expense.categoryId] =
        (byDate[dateStr].byCategory[expense.categoryId] || 0) + amount;
      byDate[dateStr].total += amount;
    });

    // Sort by date descending (most recent first)
    return Object.values(byDate).sort((a, b) => b.date.localeCompare(a.date));
  }, [expenses]);

  // Create a map of categories by id for quick lookup
  const categoryMap = useMemo(() => {
    const map: Record<number, ExpenseCategory> = {};
    categories.forEach((cat) => {
      map[cat.id] = cat;
    });
    return map;
  }, [categories]);

  const toggleDay = (date: string) => {
    const newExpanded = new Set(expandedDays);
    if (newExpanded.has(date)) {
      newExpanded.delete(date);
    } else {
      newExpanded.add(date);
    }
    setExpandedDays(newExpanded);
  };

  // Calculate daily limit per category for all travelers combined
  const getDailyLimit = (category: ExpenseCategory): number => {
    const dailyPerPerson = category.dailyBudgetPerPerson || 0;
    // Convert from USD to BRL and multiply by number of travelers
    return dailyPerPerson * exchangeRate * numberOfTravelers;
  };

  if (dailySpending.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Daily Spending Tracker</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            No expenses recorded yet. Add expenses to track daily spending.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Daily Spending Tracker</CardTitle>
        <p className="text-sm text-muted-foreground">
          Track spending against daily limits for {numberOfTravelers} travelers
        </p>
      </CardHeader>
      <CardContent className="space-y-3">
        {dailySpending.map((day) => {
          const isExpanded = expandedDays.has(day.date);

          // Check if any category exceeded its limit
          const hasOverspending = categories.some((cat) => {
            const spent = day.byCategory[cat.id] || 0;
            const limit = getDailyLimit(cat);
            return limit > 0 && spent > limit;
          });

          return (
            <div
              key={day.date}
              className="border rounded-lg overflow-hidden"
            >
              {/* Day Header */}
              <button
                onClick={() => toggleDay(day.date)}
                className="w-full flex items-center justify-between p-3 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{day.displayDate}</span>
                  {hasOverspending && (
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {formatBRL(day.total)}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </div>
              </button>

              {/* Expanded Category Details */}
              {isExpanded && (
                <div className="px-3 pb-3 space-y-3 border-t bg-muted/20">
                  {categories.map((category) => {
                    const spent = day.byCategory[category.id] || 0;
                    const dailyLimit = getDailyLimit(category);
                    const percentage = dailyLimit > 0 ? (spent / dailyLimit) * 100 : 0;
                    const status = dailyLimit > 0
                      ? getBudgetStatus(spent, dailyLimit, category.warningThresholdPercent)
                      : BUDGET_STATUS.OK;

                    // Skip categories with no spending and no limit
                    if (spent === 0 && dailyLimit === 0) return null;

                    return (
                      <div key={category.id} className="pt-3">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div
                              className="h-3 w-3 rounded-full"
                              style={{ backgroundColor: category.colorHex || "#666" }}
                            />
                            <span className="text-sm font-medium">
                              {category.name}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {status === BUDGET_STATUS.EXCEEDED && (
                              <Badge variant="destructive" className="text-xs">
                                Over
                              </Badge>
                            )}
                            {status === BUDGET_STATUS.WARNING && (
                              <Badge className="bg-[#C9A227] text-white text-xs">
                                Warning
                              </Badge>
                            )}
                            <span className="text-sm">
                              {formatBRL(spent)}
                              {dailyLimit > 0 && (
                                <span className="text-muted-foreground">
                                  {" "}/ {formatBRL(dailyLimit)}
                                </span>
                              )}
                            </span>
                          </div>
                        </div>
                        {dailyLimit > 0 && (
                          <Progress
                            value={Math.min(percentage, 100)}
                            className={`h-2 ${
                              status === BUDGET_STATUS.EXCEEDED
                                ? "[&>div]:bg-destructive"
                                : status === BUDGET_STATUS.WARNING
                                ? "[&>div]:bg-[#C9A227]"
                                : ""
                            }`}
                          />
                        )}
                        {dailyLimit === 0 && spent > 0 && (
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary/50"
                              style={{ width: "100%" }}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
