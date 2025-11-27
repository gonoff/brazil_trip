"use client";

import { format, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDay as CalendarDayType } from "@/types";
import { REGIONS } from "@/lib/constants";
import { Plane, Building2, PlaneTakeoff, PlaneLanding } from "lucide-react";

interface CalendarDayProps {
  date: Date;
  calendarDay?: CalendarDayType;
  currentMonth: Date;
  isSelected?: boolean;
  onClick?: () => void;
}

export function CalendarDayCell({
  date,
  calendarDay,
  currentMonth,
  isSelected,
  onClick,
}: CalendarDayProps) {
  const isCurrentMonth = isSameMonth(date, currentMonth);
  const regionCode = calendarDay?.region?.code as keyof typeof REGIONS | undefined;
  const region = regionCode ? REGIONS[regionCode] : null;
  const eventsCount = calendarDay?.eventsCount || 0;

  const hasFlightDeparture = calendarDay?.hasFlightDeparture;
  const hasFlightArrival = calendarDay?.hasFlightArrival;
  const hasHotelCheckIn = calendarDay?.hasHotelCheckIn;
  const hasHotelCheckOut = calendarDay?.hasHotelCheckOut;
  const hasHotelStay = calendarDay?.hasHotelStay;

  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex flex-col items-center justify-start p-2 min-h-[80px] border border-border rounded-lg transition-all",
        "hover:ring-2 hover:ring-primary hover:ring-offset-1",
        !isCurrentMonth && "opacity-40",
        isSelected && "ring-2 ring-primary ring-offset-2",
        region ? "text-white" : "bg-card"
      )}
      style={{
        backgroundColor: region ? region.colorHex : undefined,
      }}
    >
      <span
        className={cn(
          "text-sm font-medium",
          region ? "text-white" : "text-foreground"
        )}
      >
        {format(date, "d")}
      </span>

      {region && (
        <span className="text-xs mt-1 opacity-90 truncate w-full text-center">
          {region.name.split(" ")[0]}
        </span>
      )}

      {/* Icons row for flights and hotels */}
      <div className="flex items-center gap-0.5 mt-auto mb-1">
        {hasFlightDeparture && (
          <PlaneTakeoff
            className={cn(
              "h-3.5 w-3.5",
              region ? "text-white/90" : "text-blue-500"
            )}
          />
        )}
        {hasFlightArrival && (
          <PlaneLanding
            className={cn(
              "h-3.5 w-3.5",
              region ? "text-white/90" : "text-blue-500"
            )}
          />
        )}
        {(hasHotelCheckIn || hasHotelStay) && (
          <Building2
            className={cn(
              "h-3.5 w-3.5",
              hasHotelCheckIn
                ? (region ? "text-white" : "text-amber-600")
                : (region ? "text-white/70" : "text-amber-400")
            )}
          />
        )}
      </div>

      {eventsCount > 0 && (
        <div
          className={cn(
            "absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-full text-xs font-medium",
            region ? "bg-white/20 text-white" : "bg-primary text-primary-foreground"
          )}
        >
          {eventsCount}
        </div>
      )}

      {calendarDay?.notes && (
        <div
          className={cn(
            "absolute top-1 right-1 h-2 w-2 rounded-full",
            region ? "bg-white/50" : "bg-accent"
          )}
        />
      )}
    </button>
  );
}
