"use client"

import { useState, useEffect } from "react"
import { ProductCard, ProductCardSkeleton } from "@/components/products"
import { getRelatedProducts, type Product } from "@/lib/api"

interface RelatedProductsProps {
  productId: number
}

export function RelatedProducts({ productId }: RelatedProductsProps) {
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchRelated() {
      setIsLoading(true)
      try {
        const related = await getRelatedProducts(productId)
        setProducts(related.slice(0, 4))
      } catch (error) {
        console.error("Failed to fetch related products:", error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchRelated()
  }, [productId])

  if (isLoading) {
    return <RelatedProductsSkeleton />
  }

  if (products.length === 0) {
    return null
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}

export function RelatedProductsSkeleton() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}
