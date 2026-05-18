import { Skeleton } from "@/components/ui/skeleton"

export default function RegisterLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <div className="w-full max-w-md rounded-lg border border-border bg-card p-6 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Skeleton className="h-8 w-32 mx-auto" />
          <Skeleton className="h-6 w-48 mx-auto" />
          <Skeleton className="h-4 w-56 mx-auto" />
        </div>

        {/* Form fields */}
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-10 w-full rounded-md" />
            </div>
          ))}

          {/* Submit button */}
          <Skeleton className="h-10 w-full rounded-md" />
        </div>

        {/* Footer link */}
        <Skeleton className="h-4 w-48 mx-auto" />
      </div>
    </div>
  )
}
