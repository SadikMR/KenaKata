export interface Category {
  id: number
  name: string
  slug: string
  image: string
}

export interface Product {
  id: number
  title: string
  slug: string
  price: number
  description: string
  category: Category
  images: string[]
}

export interface User {
  id: number
  email: string
  name: string
  role: "customer" | "admin"
  avatar: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
}

export interface ProductFilters {
  title?: string
  price?: number
  price_min?: number
  price_max?: number
  categoryId?: number
  categorySlug?: string
  offset?: number
  limit?: number
}