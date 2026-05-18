"use client"

import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import {
  BackButton,
  ProductInfo,
  ProductInfoSkeleton,
  ProductGallery,
  ProductGallerySkeleton,
} from "@/components/products"
import { getProductById, type Product } from "@/lib/api"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params)
  const productId = Number(resolvedParams.id)

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true)
      try {
        const productData = await getProductById(productId)

        if (!productData) {
          notFound()
        }

        setProduct(productData)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        notFound()
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1">
          <div className="container mx-auto px-4 py-8">
            <ProductDetailSkeleton />
          </div>
        </main>
      </div>
    )
  }

  if (!product) {
    return notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <BackButton />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <ProductGallery images={product.images} title={product.title} />
            <ProductInfo product={product} />
          </div>
        </div>
      </main>
    </div>
  )
}

/** Inline skeleton used by Suspense fallback — composes component skeletons */
function ProductDetailSkeleton() {
  return (
    <>
      {/* Back button skeleton */}
      <div className="h-6 w-16 mb-6 rounded bg-muted animate-pulse" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <ProductGallerySkeleton />
        <ProductInfoSkeleton />
      </div>
    </>
  )
}
