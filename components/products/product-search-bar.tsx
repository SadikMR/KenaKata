"use client"

import { Search, SlidersHorizontal } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductSearchBarProps {
  value: string
  onChange: (value: string) => void
  onMobileFilterOpen: () => void
}

export function ProductSearchBar({
  value,
  onChange,
  onMobileFilterOpen,
}: ProductSearchBarProps) {
  return (
    <div className="flex gap-4 mb-6">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search products..."
          className="pl-10 pr-10"
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
      </div>
      <Button
        variant="outline"
        className="lg:hidden"
        onClick={onMobileFilterOpen}
      >
        <SlidersHorizontal className="h-4 w-4 mr-2" />
        Filters
      </Button>
    </div>
  )
}

export function ProductSearchBarSkeleton() {
  return (
    <div className="flex gap-4 mb-6">
      <Skeleton className="h-10 flex-1 rounded-md" />
      <Skeleton className="h-10 w-24 rounded-md lg:hidden" />
    </div>
  )
}
