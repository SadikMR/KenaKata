"use client"

import { X } from "lucide-react"
import { type Category } from "@/lib/api"

interface ActiveFiltersProps {
  categories: Category[]
  selectedCategory: string
  searchQuery: string
  priceRange: [number, number]
  onCategoryChange: (category: string) => void
  onSearchChange: (query: string) => void
  onPriceChange: (range: [number, number]) => void
  onClearAll: () => void
}

export function ActiveFilters({
  categories,
  selectedCategory,
  searchQuery,
  priceRange,
  onCategoryChange,
  onSearchChange,
  onPriceChange,
  onClearAll,
}: ActiveFiltersProps) {
  const hasFilters =
    searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000

  if (!hasFilters) return null

  return (
    <div className="flex flex-wrap gap-2 mb-6">
      {selectedCategory && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
          {categories.find((c) => c.id.toString() === selectedCategory)?.name}
          <button onClick={() => onCategoryChange("")}>
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      {searchQuery && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
          &quot;{searchQuery}&quot;
          <button onClick={() => onSearchChange("")}>
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      {(priceRange[0] > 0 || priceRange[1] < 1000) && (
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
          ${priceRange[0]} - ${priceRange[1]}
          <button onClick={() => onPriceChange([0, 1000])}>
            <X className="h-3 w-3" />
          </button>
        </span>
      )}
      <button
        onClick={onClearAll}
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        Clear all
      </button>
    </div>
  )
}
