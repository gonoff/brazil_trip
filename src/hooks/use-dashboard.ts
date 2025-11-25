"use client";

import { useQuery } from "@tanstack/react-query";
import { DashboardStats } from "@/types";

async function fetchDashboardStats(): Promise<DashboardStats> {
  const response = await fetch("/api/dashboard");
  if (!response.ok) throw new Error("Failed to fetch dashboard stats");
  return response.json();
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardStats,
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
