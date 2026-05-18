"use client"

import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  /** Maximum number of page buttons to show */
  maxVisible?: number
  /** Whether to disable the "next" button (useful when total is unknown) */
  hasNextPage?: boolean
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisible = 5,
  hasNextPage = true,
}: PaginationProps) {
  if (totalPages <= 1 && !hasNextPage) return null

  const getPageNumbers = () => {
    const pages: number[] = []
    const half = Math.floor(maxVisible / 2)

    let start = Math.max(1, currentPage - half)
    const end = Math.min(totalPages, start + maxVisible - 1)

    // Adjust start if we're near the end
    if (end - start + 1 < maxVisible) {
      start = Math.max(1, end - maxVisible + 1)
    }

    for (let i = start; i <= end; i++) {
      pages.push(i)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-8">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>

      <div className="flex items-center gap-1">
        {getPageNumbers().map((pageNum) => (
          <Button
            key={pageNum}
            variant={currentPage === pageNum ? "default" : "outline"}
            size="icon"
            onClick={() => onPageChange(pageNum)}
            className="w-10 h-10"
          >
            {pageNum}
          </Button>
        ))}
      </div>

      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNextPage || currentPage >= totalPages}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  )
}
