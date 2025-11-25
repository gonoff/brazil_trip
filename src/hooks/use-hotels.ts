"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Hotel, HotelFormData } from "@/types";

async function fetchHotels(): Promise<Hotel[]> {
  const response = await fetch("/api/hotels");
  if (!response.ok) throw new Error("Failed to fetch hotels");
  return response.json();
}

async function createHotel(data: HotelFormData): Promise<Hotel> {
  const response = await fetch("/api/hotels", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create hotel");
  return response.json();
}

async function updateHotel(id: number, data: Partial<HotelFormData>): Promise<Hotel> {
  const response = await fetch(`/api/hotels/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update hotel");
  return response.json();
}

async function deleteHotel(id: number): Promise<void> {
  const response = await fetch(`/api/hotels/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) throw new Error("Failed to delete hotel");
}

export function useHotels() {
  return useQuery({
    queryKey: ["hotels"],
    queryFn: fetchHotels,
  });
}

export function useCreateHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
}

export function useUpdateHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<HotelFormData> }) =>
      updateHotel(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
}

export function useDeleteHotel() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteHotel,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["hotels"] });
    },
  });
}
