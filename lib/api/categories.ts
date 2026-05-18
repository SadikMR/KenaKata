import { API_BASE_URL, getCached, setCache, sanitizeImageUrl, sanitizeProduct } from "./client"
import { Category, Product } from "./types"

export async function getCategories(): Promise<Category[]> {
  const cacheKey = "categories"
  const cached = getCached<Category[]>(cacheKey)
  if (cached) return cached

  const response = await fetch(`${API_BASE_URL}/categories`, { next: { revalidate: 300 } })
  if (!response.ok) throw new Error("Failed to fetch categories")
  
  const categories: Category[] = await response.json()
  const sanitized = categories.map(cat => ({
    ...cat,
    image: sanitizeImageUrl(cat.image)
  }))
  setCache(cacheKey, sanitized)
  return sanitized
}

export async function getCategoryById(id: number): Promise<Category | null> {
  const cacheKey = `category:${id}`
  const cached = getCached<Category>(cacheKey)
  if (cached) return cached

  try {
    const response = await fetch(`${API_BASE_URL}/categories/${id}`, { next: { revalidate: 300 } })
    if (!response.ok) return null
    
    const category = await response.json()
    setCache(cacheKey, category)
    return category
  } catch {
    return null
  }
}

export async function getProductsByCategory(categoryId: number, limit?: number, offset?: number): Promise<Product[]> {
  const params = new URLSearchParams()
  if (limit !== undefined) params.append("limit", limit.toString())
  if (offset !== undefined) params.append("offset", offset.toString())
  
  const cacheKey = `category-products:${categoryId}:${params.toString()}`
  const cached = getCached<Product[]>(cacheKey)
  if (cached) return cached

  const url = `${API_BASE_URL}/categories/${categoryId}/products${params.toString() ? `?${params.toString()}` : ""}`
  const response = await fetch(url, { next: { revalidate: 60 } })
  
  if (!response.ok) throw new Error("Failed to fetch products by category")
  
  const products: Product[] = await response.json()
  const sanitized = products.map(sanitizeProduct)
  setCache(cacheKey, sanitized)
  return sanitized
}