export default function CheckoutLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="h-8 w-32 bg-muted rounded animate-pulse mb-8" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          {/* Shipping skeleton */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="h-6 w-48 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-10 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-3 gap-4">
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
              <div className="h-10 bg-muted rounded animate-pulse" />
            </div>
          </div>
          {/* Payment skeleton */}
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="h-6 w-40 bg-muted rounded animate-pulse" />
            <div className="grid grid-cols-2 gap-4">
              <div className="h-20 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
              <div className="h-20 bg-muted rounded animate-pulse" />
            </div>
            <div className="h-10 bg-muted rounded animate-pulse" />
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="rounded-lg border border-border bg-card p-6 space-y-4">
            <div className="h-6 w-32 bg-muted rounded animate-pulse" />
            <div className="space-y-3">
              <div className="flex gap-3">
                <div className="w-16 h-16 bg-muted rounded animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-muted rounded animate-pulse" />
                  <div className="h-3 w-16 bg-muted rounded animate-pulse" />
                </div>
              </div>
            </div>
            <div className="h-px bg-border" />
            <div className="h-6 bg-muted rounded animate-pulse" />
          </div>
        </div>
      </div>
    </div>
  )
}
