import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Currency conversion utilities
export const DEFAULT_EXCHANGE_RATE = 5.4;

export function convertToUSD(amountBRL: number, rate: number = DEFAULT_EXCHANGE_RATE): number {
  return amountBRL / rate;
}

export function convertToBRL(amountUSD: number, rate: number = DEFAULT_EXCHANGE_RATE): number {
  return amountUSD * rate;
}

export function formatBRL(amount: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount);
}

export function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
}

export function formatCurrency(amountBRL: number, rate: number = DEFAULT_EXCHANGE_RATE): string {
  const usd = convertToUSD(amountBRL, rate);
  return `${formatBRL(amountBRL)} (~${formatUSD(usd)})`;
}

// Format UTC date without timezone conversion
// Use this when displaying dates from the database to avoid timezone shift
export function formatUTCDate(date: Date | string, formatStr: string): string {
  const d = new Date(date);
  // Create a new date using UTC values to avoid timezone shift
  const utcDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  return format(utcDate, formatStr);
}

// Format UTC time (HH:mm) without timezone conversion
// Use for flight times which are stored as UTC but represent local airport time
export function formatUTCTime(datetime: Date | string): string {
  const d = new Date(datetime);
  const hours = d.getUTCHours().toString().padStart(2, '0');
  const minutes = d.getUTCMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Format UTC datetime for display (date + time)
export function formatUTCDateTime(datetime: Date | string, dateFormat: string = "MMM d, yyyy"): string {
  const d = new Date(datetime);
  const utcDate = new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  const time = formatUTCTime(datetime);
  return `${format(utcDate, dateFormat)} at ${time}`;
}

// Get UTC datetime string for form inputs (yyyy-MM-ddTHH:mm)
export function getUTCDateTimeLocal(datetime: Date | string): string {
  const d = new Date(datetime);
  const year = d.getUTCFullYear();
  const month = (d.getUTCMonth() + 1).toString().padStart(2, '0');
  const day = d.getUTCDate().toString().padStart(2, '0');
  const hours = d.getUTCHours().toString().padStart(2, '0');
  const minutes = d.getUTCMinutes().toString().padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}
