"use client";

import { useMemo } from "react";
import { TripCalendar } from "@/components/calendar/trip-calendar";
import { useCalendarDays, useUpdateCalendarDay } from "@/hooks/use-calendar-days";
import { useFlights } from "@/hooks/use-flights";
import { useHotels } from "@/hooks/use-hotels";
import { RegionCode } from "@/lib/constants";
import { CalendarDay } from "@/types";
import { Loader2 } from "lucide-react";

export default function CalendarPage() {
  const { data: calendarDays, isLoading: daysLoading, error } = useCalendarDays();
  const { data: flights, isLoading: flightsLoading } = useFlights();
  const { data: hotels, isLoading: hotelsLoading } = useHotels();
  const updateMutation = useUpdateCalendarDay();

  // Enrich calendar days with flight and hotel info
  const enrichedCalendarDays = useMemo(() => {
    if (!calendarDays) return [];

    // Helper to get UTC date string from a date (for DATE fields like calendar days, hotels)
    const toUTCDateStr = (date: Date | string) => {
      const d = new Date(date);
      return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}-${String(d.getUTCDate()).padStart(2, '0')}`;
    };

    // Helper to get local date string (for DATETIME fields like flights)
    const toLocalDateStr = (date: Date | string) => {
      const d = new Date(date);
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    };

    // Build sets for quick lookup
    const flightDepartureDates = new Set<string>();
    const flightArrivalDates = new Set<string>();
    const hotelCheckInDates = new Set<string>();
    const hotelCheckOutDates = new Set<string>();
    const hotelStayDates = new Set<string>();

    // Flights use datetime, so use local date extraction
    flights?.forEach((flight) => {
      flightDepartureDates.add(toLocalDateStr(flight.departureDatetime));
      flightArrivalDates.add(toLocalDateStr(flight.arrivalDatetime));
    });

    // Hotels use DATE fields, so use UTC date extraction
    hotels?.forEach((hotel) => {
      hotelCheckInDates.add(toUTCDateStr(hotel.checkInDate));
      hotelCheckOutDates.add(toUTCDateStr(hotel.checkOutDate));

      // Mark all nights of stay (check-in to day before check-out)
      const checkIn = new Date(hotel.checkInDate);
      const checkOut = new Date(hotel.checkOutDate);
      const current = new Date(checkIn.getUTCFullYear(), checkIn.getUTCMonth(), checkIn.getUTCDate());
      const end = new Date(checkOut.getUTCFullYear(), checkOut.getUTCMonth(), checkOut.getUTCDate());
      while (current < end) {
        hotelStayDates.add(`${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`);
        current.setDate(current.getDate() + 1);
      }
    });

    return calendarDays.map((day): CalendarDay => {
      const dateStr = toUTCDateStr(day.date);
      return {
        ...day,
        hasFlightDeparture: flightDepartureDates.has(dateStr),
        hasFlightArrival: flightArrivalDates.has(dateStr),
        hasHotelCheckIn: hotelCheckInDates.has(dateStr),
        hasHotelCheckOut: hotelCheckOutDates.has(dateStr),
        hasHotelStay: hotelStayDates.has(dateStr),
      };
    });
  }, [calendarDays, flights, hotels]);

  const handleUpdateDay = async (dayId: number, regionCode: RegionCode | null) => {
    await updateMutation.mutateAsync({
      id: dayId,
      data: { regionCode },
    });
  };

  const isLoading = daysLoading || flightsLoading || hotelsLoading;

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
          Click on a day to assign a region. January 6 - February 3, 2026.
        </p>
      </div>

      <TripCalendar
        calendarDays={enrichedCalendarDays}
        onUpdateDay={handleUpdateDay}
        isLoading={updateMutation.isPending}
      />
    </div>
  );
}
