import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}



/**
 * Format a number as currency
 * @param value The number to format
 * @param symbol Whether to include the currency symbol (default: true)
 * @returns Formatted currency string
 */
export function formatCurrency(value: number, symbol = true): string {
  return new Intl.NumberFormat('en-US', {
    style: symbol ? 'currency' : 'decimal',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(value);
}