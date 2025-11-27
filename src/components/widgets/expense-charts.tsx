"use client";

import { useMemo } from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  LineChart,
  Line,
  CartesianGrid,
} from "recharts";
import { Expense, ExpenseCategory, AppSettings } from "@/types";
import { formatBRL, formatUTCDate } from "@/lib/utils";

interface ExpenseChartsProps {
  expenses: Expense[];
  categories: ExpenseCategory[];
  settings: AppSettings;
}

// Category Pie Chart
export function CategoryPieChart({ expenses, categories }: Omit<ExpenseChartsProps, "settings">) {
  const data = useMemo(() => {
    const byCategory: Record<number, number> = {};
    expenses.forEach((exp) => {
      byCategory[exp.categoryId] = (byCategory[exp.categoryId] || 0) + Number(exp.amountBrl);
    });

    return categories
      .map((cat) => ({
        name: cat.name,
        value: byCategory[cat.id] || 0,
        color: cat.colorHex || "#666",
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses, categories]);

  const total = useMemo(() => data.reduce((sum, item) => sum + item.value, 0), [data]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
        No expenses to display
      </div>
    );
  }

  return (
    <div className="relative">
      <ResponsiveContainer width="100%" height={250}>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={90}
            paddingAngle={2}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => formatBRL(value)}
            contentStyle={{
              backgroundColor: "hsl(var(--popover))",
              border: "1px solid hsl(var(--border))",
              borderRadius: "var(--radius)",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
      {/* Center label */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="text-center">
          <div className="text-xl font-bold">{formatBRL(total)}</div>
          <div className="text-xs text-muted-foreground">Total</div>
        </div>
      </div>
      {/* Legend */}
      <div className="flex flex-wrap justify-center gap-3 mt-4">
        {data.map((entry) => (
          <div key={entry.name} className="flex items-center gap-1.5 text-xs">
            <div
              className="h-3 w-3 rounded-full"
              style={{ backgroundColor: entry.color }}
            />
            <span>{entry.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Daily Spending Bar Chart
export function DailySpendingChart({ expenses, categories }: Omit<ExpenseChartsProps, "settings">) {
  const data = useMemo(() => {
    const byDate: Record<string, Record<number, number>> = {};

    expenses.forEach((exp) => {
      const dateStr = formatUTCDate(exp.date, "MMM d");
      if (!byDate[dateStr]) {
        byDate[dateStr] = {};
      }
      byDate[dateStr][exp.categoryId] =
        (byDate[dateStr][exp.categoryId] || 0) + Number(exp.amountBrl);
    });

    // Sort by date and take last 14 days
    const sortedDates = Object.keys(byDate).slice(-14);

    return sortedDates.map((date) => {
      const entry: Record<string, number | string> = { date };
      categories.forEach((cat) => {
        entry[cat.name] = byDate[date][cat.id] || 0;
      });
      return entry;
    });
  }, [expenses, categories]);

  const activeCategories = useMemo(() => {
    const activeCatIds = new Set(expenses.map((e) => e.categoryId));
    return categories.filter((c) => activeCatIds.has(c.id));
  }, [expenses, categories]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
        No expenses to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(value) => `R$${value}`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [formatBRL(value), name]}
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        {activeCategories.map((cat) => (
          <Bar
            key={cat.id}
            dataKey={cat.name}
            stackId="a"
            fill={cat.colorHex || "#666"}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

// Cumulative Spending Line Chart
export function CumulativeSpendingChart({ expenses, settings }: Pick<ExpenseChartsProps, "expenses" | "settings">) {
  const data = useMemo(() => {
    // Group expenses by date
    const byDate: Record<string, number> = {};
    expenses.forEach((exp) => {
      const dateStr = formatUTCDate(exp.date, "yyyy-MM-dd");
      byDate[dateStr] = (byDate[dateStr] || 0) + Number(exp.amountBrl);
    });

    // Sort dates and calculate cumulative
    const sortedDates = Object.keys(byDate).sort();
    let cumulative = 0;

    return sortedDates.map((date) => {
      cumulative += byDate[date];
      return {
        date: formatUTCDate(new Date(date), "MMM d"),
        actual: cumulative,
        // Budget pace line (linear from 0 to total budget)
        budgetPace: settings.totalBudgetBrl
          ? (sortedDates.indexOf(date) + 1) / sortedDates.length * settings.totalBudgetBrl
          : undefined,
      };
    });
  }, [expenses, settings]);

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-[250px] text-muted-foreground text-sm">
        No expenses to display
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={250}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
        <XAxis
          dataKey="date"
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
        />
        <YAxis
          tick={{ fontSize: 11 }}
          stroke="hsl(var(--muted-foreground))"
          tickFormatter={(value) => `R$${value}`}
        />
        <Tooltip
          formatter={(value: number, name: string) => [
            formatBRL(value),
            name === "actual" ? "Spent" : "Budget Pace",
          ]}
          contentStyle={{
            backgroundColor: "hsl(var(--popover))",
            border: "1px solid hsl(var(--border))",
            borderRadius: "var(--radius)",
          }}
        />
        <Legend />
        <Line
          type="monotone"
          dataKey="actual"
          name="Spent"
          stroke="hsl(var(--primary))"
          strokeWidth={2}
          dot={{ r: 3 }}
        />
        {settings.totalBudgetBrl && (
          <Line
            type="monotone"
            dataKey="budgetPace"
            name="Budget Pace"
            stroke="hsl(var(--muted-foreground))"
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
}

// Mini Pie Chart for Dashboard
export function MiniPieChart({ expenses, categories }: Omit<ExpenseChartsProps, "settings">) {
  const data = useMemo(() => {
    const byCategory: Record<number, number> = {};
    expenses.forEach((exp) => {
      byCategory[exp.categoryId] = (byCategory[exp.categoryId] || 0) + Number(exp.amountBrl);
    });

    return categories
      .map((cat) => ({
        name: cat.name,
        value: byCategory[cat.id] || 0,
        color: cat.colorHex || "#666",
      }))
      .filter((item) => item.value > 0)
      .sort((a, b) => b.value - a.value);
  }, [expenses, categories]);

  if (data.length === 0) {
    return null;
  }

  return (
    <ResponsiveContainer width="100%" height={120}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={30}
          outerRadius={50}
          paddingAngle={2}
          dataKey="value"
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}
