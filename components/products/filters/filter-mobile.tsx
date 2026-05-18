"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FilterContent, type FilterContentProps } from "./filter-content"

interface FilterMobileProps extends Omit<FilterContentProps, "onItemClick" | "headingSize"> {
  isOpen: boolean
  onClose: () => void
}

export function FilterMobile({
  isOpen,
  onClose,
  ...filterProps
}: FilterMobileProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-card border-l border-border p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold">Filters</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="space-y-6">
          <FilterContent
            {...filterProps}
            onItemClick={onClose}
            headingSize="medium"
          />
        </div>
      </div>
    </div>
  )
}
