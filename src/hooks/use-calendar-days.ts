"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { CalendarDay } from "@/types";
import { RegionCode } from "@/lib/constants";

async function fetchCalendarDays(): Promise<CalendarDay[]> {
  const response = await fetch("/api/calendar-days");
  if (!response.ok) {
    throw new Error("Failed to fetch calendar days");
  }
  return response.json();
}

async function updateCalendarDay(
  id: number,
  data: { regionCode?: RegionCode | null; notes?: string }
): Promise<CalendarDay> {
  const response = await fetch(`/api/calendar-days/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to update calendar day");
  }
  return response.json();
}

export function useCalendarDays() {
  return useQuery({
    queryKey: ["calendarDays"],
    queryFn: fetchCalendarDays,
  });
}

export function useUpdateCalendarDay() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { regionCode?: RegionCode | null; notes?: string };
    }) => updateCalendarDay(id, data),
    onSuccess: (updatedDay) => {
      // Update the cache with the new day data
      queryClient.setQueryData<CalendarDay[]>(["calendarDays"], (old) => {
        if (!old) return [updatedDay];
        return old.map((day) => (day.id === updatedDay.id ? updatedDay : day));
      });
    },
  });
}
