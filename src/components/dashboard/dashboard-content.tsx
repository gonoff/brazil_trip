"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Calendar,
  Plane,
  Building2,
  Wallet,
  CalendarCheck,
  ArrowRight,
  Loader2,
  Clock,
  MapPin,
} from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { useExpenses, useExpenseCategories, useSettings } from "@/hooks/use-expenses";
import { DailySpendingTracker } from "@/components/expenses/daily-spending-tracker";
import { NotificationSettings } from "@/components/notification-settings";
import { TRIP_DATES, REGIONS, RegionCode, getBudgetStatus, BUDGET_STATUS } from "@/lib/constants";
import { formatBRL, convertToUSD, formatUSD, formatUTCDate } from "@/lib/utils";
import { format } from "date-fns";

export function DashboardContent() {
  const { data: stats, isLoading, error } = useDashboard();
  const { data: expenses } = useExpenses();
  const { data: categories } = useExpenseCategories();
  const { data: settings } = useSettings();

  const daysUntilTrip = Math.ceil(
    (TRIP_DATES.start.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const budgetStatus = stats
    ? getBudgetStatus(stats.totalSpent, stats.totalBudget, 80)
    : BUDGET_STATUS.OK;

  const budgetPercentage = stats && stats.totalBudget > 0
    ? (stats.totalSpent / stats.totalBudget) * 100
    : 0;

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 sm:p-8 text-center">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Brazil Trip Planner</h1>
        <p className="text-lg sm:text-xl text-muted-foreground mb-4">
          January 6 - February 3, 2026 • {TRIP_DATES.totalDays} days
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <div className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-lg font-medium">
            {daysUntilTrip > 0 ? (
              <>
                <span>{daysUntilTrip}</span>
                <span className="text-primary-foreground/80">days until departure</span>
              </>
            ) : (
              <span>Trip in progress!</span>
            )}
          </div>
          <NotificationSettings />
        </div>
      </div>

      {/* Stats Overview */}
      {stats && !error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-primary">{stats.flightsCount}</div>
              <div className="text-sm text-muted-foreground">Flights</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-accent">{stats.hotelsCount}</div>
              <div className="text-sm text-muted-foreground">Hotels</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-blue-600">{stats.eventsCount}</div>
              <div className="text-sm text-muted-foreground">Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-orange-500">
                {Math.round(budgetPercentage)}%
              </div>
              <div className="text-sm text-muted-foreground">Budget Used</div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Budget Overview */}
      {stats && !error && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Budget Overview</span>
              {budgetStatus === BUDGET_STATUS.EXCEEDED && (
                <Badge variant="destructive">Over Budget</Badge>
              )}
              {budgetStatus === BUDGET_STATUS.WARNING && (
                <Badge className="bg-yellow-500">Warning</Badge>
              )}
              {budgetStatus === BUDGET_STATUS.OK && (
                <Badge className="bg-green-600">On Track</Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span>
                Spent: {formatBRL(stats.totalSpent)} (~{formatUSD(convertToUSD(stats.totalSpent, stats.exchangeRate))})
              </span>
              <span>
                Budget: {formatBRL(stats.totalBudget)} (~{formatUSD(convertToUSD(stats.totalBudget, stats.exchangeRate))})
              </span>
            </div>
            <Progress
              value={Math.min(budgetPercentage, 100)}
              className={
                budgetStatus === BUDGET_STATUS.EXCEEDED
                  ? "[&>div]:bg-destructive"
                  : budgetStatus === BUDGET_STATUS.WARNING
                  ? "[&>div]:bg-yellow-500"
                  : ""
              }
            />
            <div className="text-sm text-muted-foreground">
              Remaining: {formatBRL(stats.remainingBudget)} (~{formatUSD(convertToUSD(stats.remainingBudget, stats.exchangeRate))})
            </div>
          </CardContent>
        </Card>
      )}

      {/* Region Breakdown & Upcoming Events */}
      {stats && !error && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Region Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>Days by Region</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.regionDays.length > 0 ? (
                stats.regionDays.map((item) => {
                  const regionCode = item.region?.code as RegionCode | undefined;
                  const region = regionCode ? REGIONS[regionCode] : null;
                  return (
                    <div key={item.region?.id} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div
                          className="h-3 w-3 rounded-full"
                          style={{ backgroundColor: region?.colorHex || "#666" }}
                        />
                        <span className="text-sm">{item.region?.name}</span>
                      </div>
                      <span className="text-sm font-medium">
                        {item.days} days ({Math.round(item.percentage)}%)
                      </span>
                    </div>
                  );
                })
              ) : (
                <p className="text-sm text-muted-foreground">
                  No regions assigned yet. <Link href="/calendar" className="text-primary underline">Open calendar</Link> to start planning.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Upcoming Events */}
          <Card>
            <CardHeader>
              <CardTitle>Upcoming Events</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {stats.upcomingEvents.length > 0 ? (
                stats.upcomingEvents.map((event) => (
                  <div key={event.id} className="flex items-start gap-3 p-2 rounded-lg bg-muted/50">
                    <CalendarCheck className="h-4 w-4 mt-0.5 text-primary" />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">{event.title}</div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        {event.calendarDay && (
                          <span>{formatUTCDate(event.calendarDay.date, "MMM d")}</span>
                        )}
                        {event.startTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            {format(new Date(event.startTime), "h:mm a")}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">
                  No events scheduled. <Link href="/events" className="text-primary underline">Add events</Link> to see them here.
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      )}

      {/* Daily Spending Tracker */}
      {expenses && categories && settings && expenses.length > 0 && (
        <DailySpendingTracker
          expenses={expenses}
          categories={categories}
          settings={settings}
        />
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link href="/calendar">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-lg">Calendar</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Plan your daily locations
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                Open Calendar <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/flights">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Plane className="h-6 w-6 text-blue-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Flights</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track your flight bookings
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                View Flights <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/hotels">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Building2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <CardTitle className="text-lg">Hotels</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Manage accommodations
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                View Hotels <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/expenses">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-orange-500/10 rounded-lg">
                <Wallet className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Expenses</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Track spending & budget
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                View Expenses <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>

        <Link href="/events">
          <Card className="hover:border-primary transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center gap-4">
              <div className="p-2 bg-purple-500/10 rounded-lg">
                <CalendarCheck className="h-6 w-6 text-purple-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Events</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Schedule activities
                </p>
              </div>
            </CardHeader>
            <CardContent>
              <Button variant="ghost" className="w-full justify-between">
                View Events <ArrowRight className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Setup Notice */}
      {error && (
        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-amber-100 rounded-lg">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h3 className="font-semibold text-amber-900">Database Setup Required</h3>
                <p className="text-sm text-amber-700 mt-1">
                  To use this app, you need to set up a MySQL database. Update your{" "}
                  <code className="bg-amber-100 px-1 rounded">.env</code> file with your{" "}
                  <code className="bg-amber-100 px-1 rounded">DATABASE_URL</code>, then run:
                </p>
                <pre className="mt-2 p-2 bg-amber-100 rounded text-xs text-amber-900">
                  npx prisma migrate dev{"\n"}
                  npm run db:seed
                </pre>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
