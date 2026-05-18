"use client"

import { CategoryFilter } from "./category-filter"
import { PriceRangeFilter } from "./price-range-filter"
import { SortFilter } from "./sort-filter"
import { type Category } from "@/lib/api"

export interface FilterContentProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  sortBy: string
  onSortChange: (sort: string) => void
  priceRange: [number, number]
  onPriceChange: (range: [number, number]) => void
  /** Whether the filter data is still loading */
  isLoading?: boolean
  /** Called after an item is selected (e.g. to close mobile drawer) */
  onItemClick?: () => void
  headingSize?: "semibold" | "medium"
}

export function FilterContent({
  categories,
  selectedCategory,
  onCategoryChange,
  sortBy,
  onSortChange,
  priceRange,
  onPriceChange,
  isLoading = false,
  onItemClick,
  headingSize = "semibold",
}: FilterContentProps) {
  return (
    <>
      <CategoryFilter
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryChange={onCategoryChange}
        isLoading={isLoading}
        onItemClick={onItemClick}
        headingSize={headingSize}
      />

      <PriceRangeFilter
        priceRange={priceRange}
        onPriceChange={onPriceChange}
        isLoading={isLoading}
        headingSize={headingSize}
      />

      <SortFilter
        sortBy={sortBy}
        onSortChange={onSortChange}
        isLoading={isLoading}
        headingSize={headingSize}
      />
    </>
  )
}
