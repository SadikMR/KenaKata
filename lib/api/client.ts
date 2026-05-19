import { Product } from "./types"


/// Retrieve the base URL strictly from environment variables
const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://api.escuelajs.co/api/v1";

if (!BASE_URL) {
  throw new Error(
    "[API Client Error]: NEXT_PUBLIC_API_BASE_URL environment variable is missing. " +
    "Please define it in your .env or .env.local file."
  );
}
export const API_BASE_URL = BASE_URL;

export function sanitizeImageUrl(url: string): string {
  if (
    !url ||
    url.includes('[') ||
    url.includes('"') ||
    url.includes('placeimg.com')
  ) {
    return '/images/place-holder.jpg'
  }

  return url
}

export function sanitizeProduct(product: Product): Product {
  return {
    ...product,
    images: product.images?.map(sanitizeImageUrl) || ["https://placehold.co/600x400?text=No+Image"],
    category: {
      ...product.category,
      image: sanitizeImageUrl(product.category?.image || "")
    }
  }
}

// In-memory cache
const cache = new Map<string, { data: unknown; timestamp: number }>()
const CACHE_TTL = 60 * 1000 

export function getCached<T>(key: string): T | null {
  const cached = cache.get(key)
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data as T
  }
  return null
}

export function setCache<T>(key: string, data: T): void {
  cache.set(key, { data, timestamp: Date.now() })
}