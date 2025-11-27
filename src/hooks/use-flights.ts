"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Flight, FlightFormData } from "@/types";
import { checkOnlineStatus } from "@/lib/offline-utils";

async function fetchFlights(): Promise<Flight[]> {
  const response = await fetch("/api/flights");
  if (!response.ok) throw new Error("Failed to fetch flights");
  return response.json();
}

async function createFlight(data: FlightFormData): Promise<Flight> {
  const response = await fetch("/api/flights", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create flight");
  return response.json();
}

async function updateFlight(id: number, data: Partial<FlightFormData>): Promise<Flight> {
  const response = await fetch(`/api/flights/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update flight");
  return response.json();
}

async function deleteFlight(id: number): Promise<void> {
  const response = await fetch(`/api/flights/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete flight");
}

export function useFlights() {
  return useQuery({
    queryKey: ["flights"],
    queryFn: fetchFlights,
  });
}

export function useCreateFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: FlightFormData) => {
      checkOnlineStatus();
      return createFlight(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
    },
  });
}

export function useUpdateFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<FlightFormData> }) => {
      checkOnlineStatus();
      return updateFlight(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
    },
  });
}

export function useDeleteFlight() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      checkOnlineStatus();
      return deleteFlight(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["flights"] });
    },
  });
}
