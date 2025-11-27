"use client";

import { useState, useMemo } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameDay,
} from "date-fns";
import { CalendarDayCell } from "./calendar-day";
import { RegionSelector } from "./region-selector";
import { RegionLegend } from "./region-legend";
import { CalendarDay } from "@/types";
import { TRIP_DATES, type RegionCode } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface TripCalendarProps {
  calendarDays: CalendarDay[];
  onUpdateDay: (dayId: number, regionCode: RegionCode | null) => Promise<void>;
  isLoading?: boolean;
}

export function TripCalendar({
  calendarDays,
  onUpdateDay,
  isLoading,
}: TripCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(TRIP_DATES.start);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [popoverOpen, setPopoverOpen] = useState(false);

  // Generate calendar grid for current month view
  const calendarGrid = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days: Date[] = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentMonth]);

  // Map calendar days by date string for quick lookup
  const calendarDayMap = useMemo(() => {
    const map = new Map<string, CalendarDay>();
    calendarDays.forEach((day) => {
      // Use UTC date to avoid timezone issues
      const d = new Date(day.date);
      const dateStr = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
      map.set(dateStr, day);
    });
    return map;
  }, [calendarDays]);

  // Count days per region
  const regionDays = useMemo(() => {
    const counts: Record<string, number> = {};
    calendarDays.forEach((day) => {
      if (day.region?.code) {
        counts[day.region.code] = (counts[day.region.code] || 0) + 1;
      }
    });
    return counts;
  }, [calendarDays]);

  const getCalendarDay = (date: Date) => {
    const dateStr = format(date, "yyyy-MM-dd");
    return calendarDayMap.get(dateStr);
  };

  const handleSelectRegion = async (regionCode: RegionCode | null) => {
    if (!selectedDate) return;

    const calendarDay = getCalendarDay(selectedDate);
    if (calendarDay) {
      await onUpdateDay(calendarDay.id, regionCode);
    }
  };

  const handleDayClick = (date: Date) => {
    const calendarDay = getCalendarDay(date);
    if (calendarDay) {
      setSelectedDate(date);
      setPopoverOpen(true);
    }
  };

  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => addDays(startOfMonth(prev), -1));
  };

  const goToNextMonth = () => {
    setCurrentMonth((prev) => addDays(endOfMonth(prev), 1));
  };

  const isJanuary = currentMonth.getMonth() === 0 && currentMonth.getFullYear() === 2026;
  const isFebruary = currentMonth.getMonth() === 1 && currentMonth.getFullYear() === 2026;

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          size="icon"
          onClick={goToPreviousMonth}
          disabled={isJanuary}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>

        <h2 className="text-xl font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h2>

        <Button
          variant="outline"
          size="icon"
          onClick={goToNextMonth}
          disabled={isFebruary}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {WEEKDAYS.map((day) => (
          <div
            key={day}
            className="text-center text-xs md:text-sm font-medium text-muted-foreground py-1 md:py-2"
          >
            <span className="hidden md:inline">{day}</span>
            <span className="md:hidden">{day[0]}</span>
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1 md:gap-2">
        {calendarGrid.map((date, index) => {
          const calendarDay = getCalendarDay(date);
          const isSelected = selectedDate && isSameDay(date, selectedDate);
          const isTripDay = calendarDay !== undefined;

          if (!isTripDay) {
            // Render empty/disabled cell for dates outside trip range
            return (
              <div
                key={index}
                className="min-h-[60px] md:min-h-[80px] p-1 md:p-2 border border-border/50 rounded-lg bg-muted/30 opacity-30"
              >
                <span className="text-xs md:text-sm text-muted-foreground">
                  {format(date, "d")}
                </span>
              </div>
            );
          }

          return (
            <RegionSelector
              key={index}
              calendarDay={calendarDay}
              date={date}
              onSelectRegion={handleSelectRegion}
              open={popoverOpen && !!isSelected}
              onOpenChange={(open) => {
                if (!open) setPopoverOpen(false);
              }}
            >
              <div>
                <CalendarDayCell
                  date={date}
                  calendarDay={calendarDay}
                  currentMonth={currentMonth}
                  isSelected={isSelected ?? false}
                  onClick={() => handleDayClick(date)}
                />
              </div>
            </RegionSelector>
          );
        })}
      </div>

      {/* Legend */}
      <RegionLegend regionDays={regionDays} />
    </div>
  );
}
