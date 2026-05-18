import { useState, useEffect } from "react"
import { getProducts, Product } from "@/lib/api"

interface UseSearchProductsOptions {
  limit?: number
  debounceDelay?: number
}

export function useSearchProducts(
  searchQuery: string,
  options: UseSearchProductsOptions = {}
) {
  const { limit = 5, debounceDelay = 500 } = options
  const [results, setResults] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([])
      setError(null)
      return
    }

    const timer = setTimeout(async () => {
      setIsLoading(true)
      setError(null)
      try {
        const products = await getProducts({
          title: searchQuery,
          limit,
        })
        setResults(products)
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to search products")
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, debounceDelay)

    return () => clearTimeout(timer)
  }, [searchQuery, limit, debounceDelay])

  return { results, isLoading, error }
}
