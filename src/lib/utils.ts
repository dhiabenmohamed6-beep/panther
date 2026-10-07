import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const STORE_CURRENCY = "TND";

export function formatPrice(price: number | string, currency: string = STORE_CURRENCY) {
  const numPrice = typeof price === "string" ? parseFloat(price) : price;
  const safeCurrency = /^[A-Za-z]{3}$/.test(currency) ? currency.toUpperCase() : STORE_CURRENCY;
  return new Intl.NumberFormat("fr-TN", {
    style: "currency",
    currency: safeCurrency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numPrice);
}

export function formatDate(date: Date | string) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(date));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}