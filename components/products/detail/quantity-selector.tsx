"use client"

import { Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface QuantitySelectorProps {
  quantity: number
  onIncrement: () => void
  onDecrement: () => void
  min?: number
}

export function QuantitySelector({
  quantity,
  onIncrement,
  onDecrement,
  min = 1,
}: QuantitySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">Quantity</label>
      <div className="flex items-center gap-3">
        <div className="flex items-center border border-border rounded-md">
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-r-none"
            onClick={onDecrement}
            disabled={quantity <= min}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            className="h-10 w-10 rounded-l-none"
            onClick={onIncrement}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
