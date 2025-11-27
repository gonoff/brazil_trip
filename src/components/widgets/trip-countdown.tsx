"use client";

import { useEffect, useState } from "react";
import { Plane, Building2, CalendarCheck, MapPin } from "lucide-react";
import { TRIP_DATES } from "@/lib/constants";
import { useDashboard } from "@/hooks/use-dashboard";

type TripPhase = "planning" | "traveling" | "completed";

interface TimeRemaining {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

function getTimeRemaining(targetDate: Date): TimeRemaining {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  return { days, hours, minutes, seconds };
}

function getTripPhase(): TripPhase {
  const now = new Date();
  if (now < TRIP_DATES.start) return "planning";
  if (now <= TRIP_DATES.end) return "traveling";
  return "completed";
}

function getTripDay(): number {
  const now = new Date();
  const diff = now.getTime() - TRIP_DATES.start.getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24)) + 1;
}

export function TripCountdown() {
  const { data: stats } = useDashboard();
  const [timeRemaining, setTimeRemaining] = useState<TimeRemaining>(
    getTimeRemaining(TRIP_DATES.start)
  );
  const [phase, setPhase] = useState<TripPhase>(getTripPhase());
  const [tripDay, setTripDay] = useState<number>(getTripDay());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(getTimeRemaining(TRIP_DATES.start));
      setPhase(getTripPhase());
      setTripDay(getTripDay());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const flightsCount = stats?.flightsCount ?? 0;
  const hotelsCount = stats?.hotelsCount ?? 0;
  const eventsCount = stats?.eventsCount ?? 0;

  return (
    <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 sm:p-8">
      <div className="text-center mb-6">
        <h1 className="text-3xl sm:text-4xl font-bold mb-2">Brazil Trip Planner</h1>
        <p className="text-lg text-muted-foreground">
          January 6 - February 3, 2026
        </p>
      </div>

      {/* Phase-specific content */}
      {phase === "planning" && (
        <>
          {/* Countdown */}
          <div className="flex justify-center gap-4 sm:gap-6 mb-6">
            <CountdownUnit value={timeRemaining.days} label="Days" />
            <CountdownUnit value={timeRemaining.hours} label="Hours" />
            <CountdownUnit value={timeRemaining.minutes} label="Mins" />
            <CountdownUnit value={timeRemaining.seconds} label="Secs" />
          </div>

          {/* Phase indicator */}
          <div className="text-center mb-4">
            <span className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium">
              <MapPin className="h-4 w-4" />
              Planning Phase
            </span>
          </div>
        </>
      )}

      {phase === "traveling" && (
        <>
          {/* Trip progress */}
          <div className="text-center mb-6">
            <div className="inline-flex flex-col items-center bg-accent text-accent-foreground px-8 py-4 rounded-2xl">
              <span className="text-4xl sm:text-5xl font-bold">Day {tripDay}</span>
              <span className="text-sm opacity-80">of {TRIP_DATES.totalDays}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="max-w-xs mx-auto mb-4">
            <div className="h-2 bg-background/50 rounded-full overflow-hidden">
              <div
                className="h-full bg-accent transition-all duration-500"
                style={{ width: `${(tripDay / TRIP_DATES.totalDays) * 100}%` }}
              />
            </div>
            <p className="text-center text-sm text-muted-foreground mt-2">
              {TRIP_DATES.totalDays - tripDay} days remaining
            </p>
          </div>
        </>
      )}

      {phase === "completed" && (
        <div className="text-center mb-6">
          <div className="inline-flex flex-col items-center bg-accent text-accent-foreground px-8 py-4 rounded-2xl">
            <span className="text-2xl font-bold">Trip Completed!</span>
            <span className="text-sm opacity-80">{TRIP_DATES.totalDays} amazing days</span>
          </div>
        </div>
      )}

      {/* Quick Stats */}
      <div className="flex justify-center gap-4 sm:gap-8">
        <QuickStat
          icon={<Plane className="h-4 w-4" />}
          value={flightsCount}
          label="Flights"
        />
        <QuickStat
          icon={<Building2 className="h-4 w-4" />}
          value={hotelsCount}
          label="Hotels"
        />
        <QuickStat
          icon={<CalendarCheck className="h-4 w-4" />}
          value={eventsCount}
          label="Events"
        />
      </div>
    </div>
  );
}

function CountdownUnit({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-background/80 backdrop-blur rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px]">
        <span className="text-2xl sm:text-4xl font-bold tabular-nums">
          {value.toString().padStart(2, "0")}
        </span>
      </div>
      <span className="text-xs sm:text-sm text-muted-foreground mt-1">{label}</span>
    </div>
  );
}

function QuickStat({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 text-sm">
      <div className="p-1.5 bg-background/50 rounded">{icon}</div>
      <div>
        <span className="font-semibold">{value}</span>
        <span className="text-muted-foreground ml-1 hidden sm:inline">{label}</span>
      </div>
    </div>
  );
}
