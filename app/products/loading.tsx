import { Skeleton } from "@/components/ui/skeleton"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"

export default function ProductsLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <Skeleton className="h-8 w-48 mb-2" />
              <Skeleton className="h-4 w-32" />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <Skeleton className="h-10 flex-1 md:w-[300px]" />
              <Skeleton className="h-10 w-[180px]" />
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar filters skeleton */}
            <aside className="w-full lg:w-64 shrink-0">
              <div className="space-y-6">
                <div className="space-y-3">
                  <Skeleton className="h-5 w-24" />
                  {Array.from({ length: 6 }).map((_, i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
                <div className="space-y-3">
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
            </aside>

            {/* Product grid skeleton */}
            <div className="flex-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="space-y-4">
                    <Skeleton className="aspect-square w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <div className="flex justify-between">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}