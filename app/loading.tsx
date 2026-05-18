import { Skeleton } from "@/components/ui/skeleton"
import { ProductCardSkeleton } from "@/components/products"

export default function HomeLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* Hero section skeleton */}
        <section className="relative overflow-hidden h-[250px] md:h-[360px] lg:h-[66vh] bg-secondary">
          <div className="container mx-auto px-4 h-full">
            <div className="h-full flex flex-col lg:flex-row items-center lg:items-stretch">
              <div className="lg:w-1/2 w-full flex items-center justify-center lg:justify-start">
                <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0 space-y-4">
                  <Skeleton className="h-6 w-40 rounded-full mx-auto lg:mx-0" />
                  <Skeleton className="h-12 w-full max-w-lg" />
                  <Skeleton className="h-12 w-3/4 max-w-md" />
                  <Skeleton className="h-5 w-full max-w-sm mx-auto lg:mx-0" />
                  <Skeleton className="h-5 w-2/3 max-w-xs mx-auto lg:mx-0" />
                  <div className="flex gap-4 justify-center lg:justify-start pt-4">
                    <Skeleton className="h-11 w-32 rounded-md" />
                    <Skeleton className="h-11 w-36 rounded-md" />
                  </div>
                </div>
              </div>
              <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="aspect-[4/3] rounded-2xl" />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals skeleton */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-9 w-44" />
              </div>
              <Skeleton className="hidden sm:block h-4 w-36" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </section>

        {/* Shop by Category skeleton */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <Skeleton className="h-4 w-16 mx-auto mb-2" />
              <Skeleton className="h-9 w-52 mx-auto" />
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="aspect-square w-full rounded-lg" />
                  <Skeleton className="h-4 w-20 mx-auto" />
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}
