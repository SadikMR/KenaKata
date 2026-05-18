"use client"

import { FilterContent, type FilterContentProps } from "./filter-content"
import { CategoryFilterSkeleton } from "./category-filter"
import { PriceRangeFilterSkeleton } from "./price-range-filter"
import { SortFilterSkeleton } from "./sort-filter"

type FilterSidebarProps = Omit<FilterContentProps, "onItemClick" | "headingSize">

export function FilterSidebar(props: FilterSidebarProps) {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-8">
        <FilterContent {...props} headingSize="semibold" />
      </div>
    </aside>
  )
}

export function FilterSidebarSkeleton() {
  return (
    <aside className="hidden lg:block w-64 flex-shrink-0">
      <div className="sticky top-24 space-y-8">
        <CategoryFilterSkeleton />
        <PriceRangeFilterSkeleton />
        <SortFilterSkeleton />
      </div>
    </aside>
  )
}
