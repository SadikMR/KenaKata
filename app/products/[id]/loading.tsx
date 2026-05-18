import { Skeleton } from "@/components/ui/skeleton"

export default function ProductDetailLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb skeleton */}
          <div className="flex items-center gap-2 mb-8">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-32" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Product image skeleton */}
            <div className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <div className="grid grid-cols-4 gap-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton key={i} className="aspect-square rounded-md" />
                ))}
              </div>
            </div>

            {/* Product details skeleton */}
            <div className="space-y-6">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-8 w-3/4 mb-4" />
                <Skeleton className="h-8 w-32" />
              </div>

              <Skeleton className="h-px w-full" />

              {/* Description skeleton */}
              <div className="space-y-2">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>

              <Skeleton className="h-px w-full" />

              {/* Actions skeleton */}
              <div className="flex gap-4">
                <Skeleton className="h-12 flex-1 rounded-md" />
                <Skeleton className="h-12 w-12 rounded-md" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
