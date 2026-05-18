import {
  FilterSidebarSkeleton,
  ProductSearchBarSkeleton,
  ProductListSkeleton,
} from "@/components/products"
import { Skeleton } from "@/components/ui/skeleton"

export default function ProductsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Filter sidebar skeleton */}
            <FilterSidebarSkeleton />

            {/* Main content skeleton */}
            <div className="flex-1 min-w-0">
              {/* Search bar skeleton */}
              <ProductSearchBarSkeleton />

              {/* Results count skeleton */}
              <Skeleton className="h-4 w-40 mb-6" />

              {/* Product grid skeleton */}
              <ProductListSkeleton count={6} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}