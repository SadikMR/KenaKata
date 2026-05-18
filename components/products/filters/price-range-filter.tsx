"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { Slider } from "@/components/ui/slider"

interface PriceRangeFilterProps {
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  isLoading?: boolean
  min?: number
  max?: number
  step?: number
  headingSize?: "semibold" | "medium"
}

export function PriceRangeFilter({
  priceRange,
  onPriceChange,
  isLoading = false,
  min = 0,
  max = 1000,
  step = 10,
  headingSize = "semibold",
}: PriceRangeFilterProps) {
  const headingClass =
    headingSize === "semibold" ? "font-semibold mb-4" : "font-medium mb-3"

  if (isLoading) {
    return <PriceRangeFilterSkeleton headingSize={headingSize} />
  }

  return (
    <div>
      <h2 className={headingClass}>Price Range</h2>
      <div className="px-2">
        <Slider
          value={[priceRange[0], priceRange[1]]}
          onValueChange={(value) => onPriceChange([value[0], value[1]])}
          max={max}
          min={min}
          step={step}
          className="mb-4"
        />
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>${priceRange[0]}</span>
          <span>${priceRange[1]}</span>
        </div>
      </div>
    </div>
  )
}

export function PriceRangeFilterSkeleton({
  headingSize = "semibold",
}: {
  headingSize?: "semibold" | "medium"
}) {
  return (
    <div>
      <Skeleton
        className={`h-5 w-28 ${headingSize === "semibold" ? "mb-4" : "mb-3"}`}
      />
      <div className="px-2">
        <Skeleton className="h-5 w-full rounded-full mb-4" />
        <div className="flex justify-between">
          <Skeleton className="h-4 w-8" />
          <Skeleton className="h-4 w-12" />
        </div>
      </div>
    </div>
  )
}
