"use client"

import { Skeleton } from "@/components/ui/skeleton"
import { type Category } from "@/lib/api"

interface CategoryFilterProps {
  categories: Category[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  isLoading?: boolean
  onItemClick?: () => void
  headingSize?: "semibold" | "medium"
}

export function CategoryFilter({
  categories,
  selectedCategory,
  onCategoryChange,
  isLoading = false,
  onItemClick,
  headingSize = "semibold",
}: CategoryFilterProps) {
  const headingClass =
    headingSize === "semibold" ? "font-semibold mb-4" : "font-medium mb-3"

  if (isLoading) {
    return <CategoryFilterSkeleton headingSize={headingSize} />
  }

  return (
    <div>
      <h2 className={headingClass}>Categories</h2>
      <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
        <button
          onClick={() => {
            onCategoryChange("")
            onItemClick?.()
          }}
          className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
            !selectedCategory
              ? "bg-primary text-primary-foreground"
              : "hover:bg-secondary"
          }`}
        >
          All Products
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => {
              onCategoryChange(category.id.toString())
              onItemClick?.()
            }}
            className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
              selectedCategory === category.id.toString()
                ? "bg-primary text-primary-foreground"
                : "hover:bg-secondary"
            }`}
          >
            {category.name}
          </button>
        ))}
      </div>
    </div>
  )
}

export function CategoryFilterSkeleton({
  headingSize = "semibold",
}: {
  headingSize?: "semibold" | "medium"
}) {
  return (
    <div>
      <Skeleton
        className={`h-5 w-24 ${headingSize === "semibold" ? "mb-4" : "mb-3"}`}
      />
      <div className="space-y-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-9 w-full rounded-md" />
        ))}
      </div>
    </div>
  )
}
