"use client"

import { Skeleton } from "@/components/ui/skeleton"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface SortFilterProps {
  sortBy: string
  onSortChange: (sort: string) => void
  isLoading?: boolean
  headingSize?: "semibold" | "medium"
}

export function SortFilter({
  sortBy,
  onSortChange,
  isLoading = false,
  headingSize = "semibold",
}: SortFilterProps) {
  const headingClass =
    headingSize === "semibold" ? "font-semibold mb-4" : "font-medium mb-3"

  if (isLoading) {
    return <SortFilterSkeleton headingSize={headingSize} />
  }

  return (
    <div>
      <h2 className={headingClass}>Sort By</h2>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Newest</SelectItem>
          <SelectItem value="price-low">Price: Low to High</SelectItem>
          <SelectItem value="price-high">Price: High to Low</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

export function SortFilterSkeleton({
  headingSize = "semibold",
}: {
  headingSize?: "semibold" | "medium"
}) {
  return (
    <div>
      <Skeleton
        className={`h-5 w-16 ${headingSize === "semibold" ? "mb-4" : "mb-3"}`}
      />
      <Skeleton className="h-10 w-full rounded-md" />
    </div>
  )
}
