"use client";

import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Plane,
  Building2,
  CalendarCheck,
  Loader2,
  Clock,
  MapPin,
  PlaneTakeoff,
  PlaneLanding,
  LogIn,
  LogOut,
} from "lucide-react";
import { useDashboard } from "@/hooks/use-dashboard";
import { useExpenses, useExpenseCategories, useSettings } from "@/hooks/use-expenses";
import { useFlights } from "@/hooks/use-flights";
import { useHotels } from "@/hooks/use-hotels";
import { DailySpendingTracker } from "@/components/expenses/daily-spending-tracker";
import { NotificationSettings } from "@/components/notification-settings";
import { TripCountdown } from "@/components/widgets/trip-countdown";
import { REGIONS, RegionCode, getBudgetStatus, BUDGET_STATUS } from "@/lib/constants";
import { formatBRL, convertToUSD, formatUSD, formatUTCDate, formatUTCDateTime } from "@/lib/utils";
import { format } from "date-fns";

export function DashboardContent() {
  const { data: stats, isLoading, error } = useDashboard();
  const { data: expenses } = useExpenses();
  const { data: categories } = useExpenseCategories();
  const { data: settings } = useSettings();
  const { data: flights } = useFlights();
  const { data: hotels } = useHotels();

  // Build timeline of upcoming travel events
  const travelTimeline = (() => {
    const items: Array<{
      type: "flight" | "hotel-checkin" | "hotel-checkout";
      date: Date;
      data: any;
    }> = [];

    if (flights) {
      flights.forEach((flight) => {
        items.push({
          type: "flight",
          date: new Date(flight.departureDatetime),
          data: flight,
        });
      });
    }

    if (hotels) {
      hotels.forEach((hotel) => {
        items.push({
          type: "hotel-checkin",
          date: new Date(hotel.checkInDate),
          data: hotel,
        });
        items.push({
          type: "hotel-checkout",
          date: new Date(hotel.checkOutDate),
          data: hotel,
        });
      });
    }

    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  })();

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
      {/* Hero Section with Countdown */}
      <TripCountdown />

      {/* Notification Settings */}
      <div className="flex justify-center -mt-4">
        <NotificationSettings />
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
              <div className="text-3xl font-bold text-[#8B6914]">{stats.eventsCount}</div>
              <div className="text-sm text-muted-foreground">Events</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-3xl font-bold text-[#B85C38]">
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
                <Badge className="bg-[#C9A227] text-white">Warning</Badge>
              )}
              {budgetStatus === BUDGET_STATUS.OK && (
                <Badge className="bg-accent">On Track</Badge>
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
                  ? "[&>div]:bg-[#C9A227]"
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

      {/* Travel Timeline */}
      {travelTimeline.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Travel Timeline</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="relative">
              {/* Timeline line */}
              <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-border" />

              <div className="space-y-4">
                {travelTimeline.map((item, index) => (
                  <div key={`${item.type}-${item.data.id}-${index}`} className="relative flex gap-4 pl-10">
                    {/* Timeline dot */}
                    <div className={`absolute left-2 w-5 h-5 rounded-full border-2 border-background flex items-center justify-center ${
                      item.type === "flight"
                        ? "bg-accent"
                        : item.type === "hotel-checkin"
                        ? "bg-primary"
                        : "bg-muted-foreground"
                    }`}>
                      {item.type === "flight" && <Plane className="h-3 w-3 text-white" />}
                      {item.type === "hotel-checkin" && <LogIn className="h-3 w-3 text-white" />}
                      {item.type === "hotel-checkout" && <LogOut className="h-3 w-3 text-white" />}
                    </div>

                    {/* Content */}
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                        <span className="font-medium">
                          {item.type === "flight"
                            ? formatUTCDateTime(item.data.departureDatetime)
                            : formatUTCDate(item.date, "MMM d, yyyy")}
                        </span>
                        <Badge variant="outline" className="text-[10px] py-0">
                          {item.type === "flight" ? "Flight" : item.type === "hotel-checkin" ? "Check-in" : "Check-out"}
                        </Badge>
                      </div>

                      {item.type === "flight" ? (
                        <div className="bg-muted/50 rounded-xl p-3">
                          <div className="flex items-center gap-2 font-medium">
                            <span>{item.data.airline}</span>
                            <span className="text-muted-foreground">{item.data.flightNumber}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm mt-1">
                            <div className="flex items-center gap-1">
                              <PlaneTakeoff className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{item.data.departureCity}</span>
                            </div>
                            <span className="text-muted-foreground">→</span>
                            <div className="flex items-center gap-1">
                              <PlaneLanding className="h-3.5 w-3.5 text-muted-foreground" />
                              <span>{item.data.arrivalCity}</span>
                            </div>
                          </div>
                          {item.data.confirmationNumber && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Confirmation: {item.data.confirmationNumber}
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="bg-muted/50 rounded-xl p-3">
                          <div className="flex items-center gap-2">
                            <Building2 className="h-4 w-4 text-primary" />
                            <span className="font-medium">{item.data.name}</span>
                          </div>
                          {item.data.address && (
                            <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                              <MapPin className="h-3.5 w-3.5" />
                              <span>{item.data.address}</span>
                            </div>
                          )}
                          {item.data.confirmationNumber && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Confirmation: {item.data.confirmationNumber}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Setup Notice */}
      {error && (
        <Card className="border-[#C9A227]/30 bg-[#C9A227]/10">
          <CardContent className="pt-6">
            <div className="flex items-start gap-4">
              <div className="p-2 bg-[#C9A227]/20 rounded-lg">
                <span className="text-2xl">🔧</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Database Setup Required</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  To use this app, you need to set up a MySQL database. Update your{" "}
                  <code className="bg-secondary px-1 rounded">.env</code> file with your{" "}
                  <code className="bg-secondary px-1 rounded">DATABASE_URL</code>, then run:
                </p>
                <pre className="mt-2 p-2 bg-secondary rounded text-xs">
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
