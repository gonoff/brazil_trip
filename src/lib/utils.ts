import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

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
