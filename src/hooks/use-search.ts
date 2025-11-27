"use client";

import { useMemo } from "react";
import { useFlights } from "@/hooks/use-flights";
import { useHotels } from "@/hooks/use-hotels";
import { useEvents } from "@/hooks/use-events";
import { useExpenses } from "@/hooks/use-expenses";
import { formatUTCDate } from "@/lib/utils";
import { format } from "date-fns";

export type SearchResultType = "expense" | "event" | "flight" | "hotel";

export interface SearchResult {
  type: SearchResultType;
  id: number;
  title: string;
  subtitle: string;
  date?: Date | string;
  href: string;
}

function fuzzyMatch(text: string, query: string): boolean {
  const lowerText = text.toLowerCase();
  const lowerQuery = query.toLowerCase();

  // Simple substring match
  if (lowerText.includes(lowerQuery)) return true;

  // Word starts with query
  const words = lowerText.split(/\s+/);
  if (words.some(word => word.startsWith(lowerQuery))) return true;

  return false;
}

export function useSearch(query: string) {
  const { data: flights, isLoading: flightsLoading } = useFlights();
  const { data: hotels, isLoading: hotelsLoading } = useHotels();
  const { data: events, isLoading: eventsLoading } = useEvents();
  const { data: expenses, isLoading: expensesLoading } = useExpenses();

  const isLoading = flightsLoading || hotelsLoading || eventsLoading || expensesLoading;

  const results = useMemo(() => {
    if (!query.trim() || query.length < 2) {
      return [];
    }

    const searchResults: SearchResult[] = [];

    // Search flights
    if (flights) {
      flights.forEach((flight) => {
        const searchText = `${flight.airline} ${flight.flightNumber} ${flight.departureCity} ${flight.arrivalCity} ${flight.confirmationNumber || ""}`;
        if (fuzzyMatch(searchText, query)) {
          searchResults.push({
            type: "flight",
            id: flight.id,
            title: `${flight.airline} ${flight.flightNumber}`,
            subtitle: `${flight.departureCity} → ${flight.arrivalCity}`,
            date: flight.departureDatetime,
            href: "/flights",
          });
        }
      });
    }

    // Search hotels
    if (hotels) {
      hotels.forEach((hotel) => {
        const searchText = `${hotel.name} ${hotel.address || ""} ${hotel.confirmationNumber || ""}`;
        if (fuzzyMatch(searchText, query)) {
          searchResults.push({
            type: "hotel",
            id: hotel.id,
            title: hotel.name,
            subtitle: hotel.address || "No address",
            date: hotel.checkInDate,
            href: "/hotels",
          });
        }
      });
    }

    // Search events
    if (events) {
      events.forEach((event) => {
        const searchText = `${event.title} ${event.description || ""} ${event.location || ""}`;
        if (fuzzyMatch(searchText, query)) {
          searchResults.push({
            type: "event",
            id: event.id,
            title: event.title,
            subtitle: event.location || event.description || "No details",
            date: event.calendarDay?.date,
            href: "/events",
          });
        }
      });
    }

    // Search expenses
    if (expenses) {
      expenses.forEach((expense) => {
        const searchText = `${expense.description || ""} ${expense.category?.name || ""}`;
        if (fuzzyMatch(searchText, query)) {
          searchResults.push({
            type: "expense",
            id: expense.id,
            title: expense.description || expense.category?.name || "Expense",
            subtitle: `R$ ${Number(expense.amountBrl).toFixed(2)} - ${expense.category?.name || ""}`,
            date: expense.date,
            href: "/expenses",
          });
        }
      });
    }

    // Sort by relevance (exact matches first) and then by date
    return searchResults.sort((a, b) => {
      const aExact = a.title.toLowerCase().includes(query.toLowerCase());
      const bExact = b.title.toLowerCase().includes(query.toLowerCase());
      if (aExact && !bExact) return -1;
      if (!aExact && bExact) return 1;
      return 0;
    });
  }, [query, flights, hotels, events, expenses]);

  return { results, isLoading };
}
