"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Expense, ExpenseFormData, ExpenseCategory, AppSettings } from "@/types";
import { checkOnlineStatus } from "@/lib/offline-utils";

// Expenses
async function fetchExpenses(): Promise<Expense[]> {
  const response = await fetch("/api/expenses");
  if (!response.ok) throw new Error("Failed to fetch expenses");
  return response.json();
}

async function createExpense(data: ExpenseFormData): Promise<Expense> {
  const response = await fetch("/api/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to create expense");
  return response.json();
}

async function updateExpense(id: number, data: Partial<ExpenseFormData>): Promise<Expense> {
  const response = await fetch(`/api/expenses/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update expense");
  return response.json();
}

async function deleteExpense(id: number): Promise<void> {
  const response = await fetch(`/api/expenses/${id}`, { method: "DELETE" });
  if (!response.ok) throw new Error("Failed to delete expense");
}

export function useExpenses() {
  return useQuery({
    queryKey: ["expenses"],
    queryFn: fetchExpenses,
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: ExpenseFormData) => {
      checkOnlineStatus();
      return createExpense(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });
}

export function useUpdateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: Partial<ExpenseFormData> }) => {
      checkOnlineStatus();
      return updateExpense(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });
}

export function useDeleteExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      checkOnlineStatus();
      return deleteExpense(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenses"] });
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });
}

// Expense Categories
async function fetchExpenseCategories(): Promise<ExpenseCategory[]> {
  const response = await fetch("/api/expense-categories");
  if (!response.ok) throw new Error("Failed to fetch expense categories");
  return response.json();
}

async function updateExpenseCategory(
  id: number,
  data: { dailyBudgetPerPerson?: number; warningThresholdPercent?: number }
): Promise<ExpenseCategory> {
  const response = await fetch("/api/expense-categories", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, ...data }),
  });
  if (!response.ok) throw new Error("Failed to update expense category");
  return response.json();
}

export function useExpenseCategories() {
  return useQuery({
    queryKey: ["expenseCategories"],
    queryFn: fetchExpenseCategories,
  });
}

export function useUpdateExpenseCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: { dailyBudgetPerPerson?: number; warningThresholdPercent?: number };
    }) => {
      checkOnlineStatus();
      return updateExpenseCategory(id, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["expenseCategories"] });
    },
  });
}

// App Settings
async function fetchSettings(): Promise<AppSettings> {
  const response = await fetch("/api/settings");
  if (!response.ok) throw new Error("Failed to fetch settings");
  return response.json();
}

async function updateSettings(data: Partial<AppSettings>): Promise<AppSettings> {
  const response = await fetch("/api/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error("Failed to update settings");
  return response.json();
}

export function useSettings() {
  return useQuery({
    queryKey: ["settings"],
    queryFn: fetchSettings,
  });
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<AppSettings>) => {
      checkOnlineStatus();
      return updateSettings(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
  });
}
