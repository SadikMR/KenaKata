"use client"

import { useState } from "react"
import { Heart, ShoppingCart, AlertCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { QuantitySelector } from "./quantity-selector"
import { useCart } from "@/lib/cart-context"
import { useAuth } from "@/lib/auth-context"
import type { Product } from "@/lib/api"

interface ProductInfoProps {
  product: Product
}

export function ProductInfo({ product }: ProductInfoProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [addedToCart, setAddedToCart] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const { addItem } = useCart()
  const { user } = useAuth()

  const handleAddToCart = () => {
    // Check if user is logged in
    if (!user) {
      setError("You must be logged in to add items to cart")
      setTimeout(() => {
        router.push("/login")
      }, 1500)
      return
    }

    // Try to add item to cart
    const success = addItem(product, quantity)

    if (success) {
      setAddedToCart(true)
      setError(null)
      setTimeout(() => setAddedToCart(false), 2000)
    } else {
      setError("Failed to add item to cart")
    }
  }

  return (
    <div className="space-y-6">
      {/* Category & Title */}
      <div>
        <Badge variant="secondary" className="mb-3">
          {product.category.name}
        </Badge>
        <h1 className="text-3xl font-bold">{product.title}</h1>
      </div>

      {/* Price */}
      <p className="text-3xl font-bold">${product.price.toFixed(2)}</p>

      {/* Description */}
      <p className="text-muted-foreground leading-relaxed">
        {product.description}
      </p>

      {/* Quantity */}
      <QuantitySelector
        quantity={quantity}
        onIncrement={() => setQuantity((q) => q + 1)}
        onDecrement={() => setQuantity((q) => Math.max(1, q - 1))}
      />

      {/* Error Message */}
      {error && (
        <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-md">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{error}</span>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Button
          className="w-full"
          size="lg"
          onClick={handleAddToCart}
          disabled={addedToCart}
        >
          {addedToCart ? (
            "Added to Cart!"
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          variant="outline"
          size="lg"
          className="w-full"
          onClick={() => setIsWishlisted(!isWishlisted)}
        >
          <Heart
            className={`mr-2 h-5 w-5 ${isWishlisted ? "fill-accent text-accent" : ""
              }`}
          />
          {isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
        </Button>
      </div>
    </div>
  )
}

export function ProductInfoSkeleton() {
  return (
    <div className="space-y-6">
      {/* Category & Title */}
      <div>
        <Skeleton className="h-6 w-20 mb-3 rounded-full" />
        <Skeleton className="h-10 w-3/4" />
      </div>

      {/* Price */}
      <Skeleton className="h-8 w-24" />

      {/* Description */}
      <div className="space-y-2">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>

      {/* Quantity */}
      <div className="space-y-3">
        <Skeleton className="h-4 w-16" />
        <Skeleton className="h-10 w-32 rounded-md" />
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Skeleton className="h-12 w-full rounded-md" />
        <Skeleton className="h-12 w-full rounded-md" />
      </div>
    </div>
  )
}
