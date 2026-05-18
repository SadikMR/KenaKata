import { Skeleton } from "@/components/ui/skeleton"
import {
  ProductInfoSkeleton,
  ProductGallerySkeleton,
  RelatedProductsSkeleton,
} from "@/components/products"

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back button skeleton */}
          <Skeleton className="h-6 w-16 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <ProductGallerySkeleton />
            <ProductInfoSkeleton />
          </div>

          {/* Related products skeleton */}
          <section className="mt-16">
            <Skeleton className="h-8 w-48 mb-6" />
            <RelatedProductsSkeleton />
          </section>
        </div>
      </main>
    </div>
  )
}
