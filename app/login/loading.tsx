import { Skeleton } from "@/components/ui/skeleton"

export default function LoginLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-6 w-40 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Footer */}
        <Skeleton className="h-4 w-48 mx-auto" />

        {/* Demo box */}
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  )
}
