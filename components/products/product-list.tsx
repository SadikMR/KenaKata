"use client"

import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProductCard, ProductCardSkeleton } from "@/components/products/product-card"
import { Pagination } from "@/components/common/pagination"
import { type Product } from "@/lib/api"

interface ProductListProps {
  products: Product[]
  isLoading: boolean
  currentPage: number
  totalPages: number
  itemsPerPage: number
  onPageChange: (page: number) => void
  onClearFilters: () => void
}

export function ProductListSkeleton({ count = 6 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  )
}

function ProductListEmpty({ onClearFilters }: { onClearFilters: () => void }) {
  return (
    <div className="text-center py-16">
      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold mb-2">No products found</h3>
      <p className="text-muted-foreground mb-4">
        Try adjusting your search or filter criteria.
      </p>
      <Button onClick={onClearFilters} variant="outline">
        Clear filters
      </Button>
    </div>
  )
}

export function ProductList({
  products,
  isLoading,
  currentPage,
  totalPages,
  itemsPerPage,
  onPageChange,
  onClearFilters,
}: ProductListProps) {
  if (isLoading) {
    return <ProductListSkeleton />
  }

  if (products.length === 0) {
    return <ProductListEmpty onClearFilters={onClearFilters} />
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {(totalPages > 1 || products.length === itemsPerPage) && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
          hasNextPage={products.length === itemsPerPage}
        />
      )}
    </>
  )
}
