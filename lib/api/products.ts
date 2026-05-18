import { API_BASE_URL, getCached, setCache, sanitizeProduct } from "./client"
import { Product, ProductFilters } from "./types"

export async function getProducts(filters?: ProductFilters): Promise<Product[]> {
  const params = new URLSearchParams()
  
  if (filters) {
    if (filters.title) params.append("title", filters.title)
    if (filters.price !== undefined) params.append("price", filters.price.toString())
    if (filters.price_min !== undefined) params.append("price_min", filters.price_min.toString())
    if (filters.price_max !== undefined) params.append("price_max", filters.price_max.toString())
    if (filters.categoryId) params.append("categoryId", filters.categoryId.toString())
    if (filters.categorySlug) params.append("categorySlug", filters.categorySlug)
    if (filters.offset !== undefined) params.append("offset", filters.offset.toString())
    if (filters.limit !== undefined) params.append("limit", filters.limit.toString())
  }

  const cacheKey = `products:${params.toString()}`
  const cached = getCached<Product[]>(cacheKey)
  if (cached) return cached

  const url = `${API_BASE_URL}/products${params.toString() ? `?${params.toString()}` : ""}`
  const response = await fetch(url, { next: { revalidate: 60 } })
  
  if (!response.ok) throw new Error("Failed to fetch products")
  
  const products: Product[] = await response.json()
  const sanitized = products.map(sanitizeProduct)
  setCache(cacheKey, sanitized)
  return sanitized
}

export async function getProductById(id: number): Promise<Product | null> {
  const cacheKey = `product:${id}`
  const cached = getCached<Product>(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, { next: { revalidate: 60 } })
    if (!response.ok) return null
    
    const product: Product = await response.json()
    const sanitized = sanitizeProduct(product)
    setCache(cacheKey, sanitized)
    return sanitized
  } catch {
    return null
  }
}

export async function getRelatedProducts(id: number): Promise<Product[]> {
  const cacheKey = `related:${id}`
  const cached = getCached<Product[]>(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}/related`, { next: { revalidate: 60 } })
    if (!response.ok) return []
    
    const products: Product[] = await response.json()
    const sanitized = products.map(sanitizeProduct)
    setCache(cacheKey, sanitized)
    return sanitized
  } catch {
    return []
  }
}