"use client";

import { TripCalendar } from "@/components/calendar/trip-calendar";
import { useCalendarDays, useUpdateCalendarDay } from "@/hooks/use-calendar-days";
import { RegionCode } from "@/lib/constants";
import { Loader2 } from "lucide-react";

export default function CalendarPage() {
  const { data: calendarDays, isLoading, error } = useCalendarDays();
  const updateMutation = useUpdateCalendarDay();

  const handleUpdateDay = async (dayId: number, regionCode: RegionCode | null) => {
    await updateMutation.mutateAsync({
      id: dayId,
      data: { regionCode },
    });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive">Failed to load calendar data</p>
        <p className="text-sm text-muted-foreground mt-2">
          Make sure the database is connected and seeded.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Trip Calendar</h1>
        <p className="text-muted-foreground mt-1">
          Click on a day to assign a region. January 1 - February 7, 2026.
        </p>
      </div>

      <TripCalendar
        calendarDays={calendarDays || []}
        onUpdateDay={handleUpdateDay}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
