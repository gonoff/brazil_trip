"use client";

import { format, isSameMonth } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarDay as CalendarDayType } from "@/types";
import { REGIONS } from "@/lib/constants";

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
