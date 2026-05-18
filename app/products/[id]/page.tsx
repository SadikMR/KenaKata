"use client"

import { useState, useEffect, use } from "react"
import { notFound } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import {
  BackButton,
  ProductInfo,
  ProductInfoSkeleton,
  ProductGallery,
  ProductGallerySkeleton,
  RelatedProducts,
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
  const [hasError, setHasError] = useState(false)

  // Scroll to top on navigation
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [productId])

  useEffect(() => {
    async function fetchProduct() {
      setIsLoading(true)
      setHasError(false)
      try {
        const productData = await getProductById(productId)

        if (!productData) {
          setHasError(true)
          return
        }

        setProduct(productData)
      } catch (error) {
        console.error("Failed to fetch product:", error)
        setHasError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProduct()
  }, [productId])

  if (hasError && !isLoading) {
    return notFound()
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <BackButton />

          {/* Product Detail — gallery + info load together */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {isLoading || !product ? (
              <ProductGallerySkeleton />
            ) : (
              <ProductGallery images={product.images} title={product.title} />
            )}

            {isLoading || !product ? (
              <ProductInfoSkeleton />
            ) : (
              <ProductInfo product={product} />
            )}
          </div>

          {/* Related Products — loads independently */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">Related Products</h2>
            <RelatedProducts productId={productId} />
          </section>
        </div>
      </main>
    </div>
  )
}
