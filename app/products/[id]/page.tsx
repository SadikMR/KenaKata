"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { notFound } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { BackButton, ProductInfo, ProductInfoSkeleton } from "@/components/products"
import { getProductById, type Product } from "@/lib/api"

interface ProductDetailPageProps {
  params: Promise<{ id: string }>
}

export default function ProductDetailPage({ params }: ProductDetailPageProps) {
  const resolvedParams = use(params)
  const productId = Number(resolvedParams.id)
  const router = useRouter()

  const [product, setProduct] = useState<Product | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)

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
            <Skeleton className="h-6 w-16 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
              {/* Gallery skeleton */}
              <div className="space-y-4">
                <Skeleton className="aspect-square rounded-lg" />
                <div className="flex gap-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                  ))}
                </div>
              </div>
              {/* Info skeleton */}
              <ProductInfoSkeleton />
            </div>
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
            {/* Image Gallery (placeholder — Step 2 will extract this) */}
            <div className="space-y-4">
              <div className="aspect-square overflow-hidden rounded-lg bg-muted">
                <Image
                  src={product.images[selectedImage]}
                  alt={product.title}
                  width={600}
                  height={600}
                  className="h-full w-full object-cover"
                  priority
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex gap-3">
                  {product.images.slice(0, 3).map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`aspect-square w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                        selectedImage === index
                          ? "border-accent"
                          : "border-transparent hover:border-border"
                      }`}
                    >
                      <Image
                        src={image}
                        alt={`${product.title} thumbnail ${index + 1}`}
                        width={80}
                        height={80}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <ProductInfo product={product} />
          </div>
        </div>
      </main>
    </div>
  )
}
