import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Plane,
  Building2,
  Wallet,
  CalendarCheck,
  ArrowRight,
} from "lucide-react";
import { TRIP_DATES } from "@/lib/constants";

export default function HomePage() {
  const daysUntilTrip = Math.ceil(
    (TRIP_DATES.start.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-primary/10 border border-primary/20 rounded-xl p-8 text-center">
        <h1 className="text-4xl font-bold mb-2">Brazil Trip Planner</h1>
        <p className="text-xl text-muted-foreground mb-4">
          January 1 - February 7, 2026 • {TRIP_DATES.totalDays} days
        </p>
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
      </div>

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
    </div>
  );
}
