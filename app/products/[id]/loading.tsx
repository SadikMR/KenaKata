import { Skeleton } from "@/components/ui/skeleton"
import { ProductInfoSkeleton } from "@/components/products"

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Back button skeleton */}
          <Skeleton className="h-6 w-16 mb-6" />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Gallery skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="flex gap-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="w-20 h-20 rounded-lg" />
                ))}
              </div>
            </div>

            {/* Product info skeleton */}
            <ProductInfoSkeleton />
          </div>
        </div>
      </main>
    </div>
  )
}
