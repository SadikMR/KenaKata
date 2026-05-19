'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { Heart, ShoppingCart } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Button } from '@/components/ui/button'
import { useCart } from '@/lib/cart-context'
import { useWishlist } from '@/lib/wishlist-context'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'
import type { Product } from '@/lib/api'

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart()
  const { isWishlisted, toggleWishlist } = useWishlist()
  const { user } = useAuth()
  const router = useRouter()
  const [addedToCart, setAddedToCart] = useState(false)

  const isFavorited = isWishlisted(product.id)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      router.push('/login')
      return
    }

    const success = addItem(product, 1)
    if (success) {
      setAddedToCart(true)
      setTimeout(() => setAddedToCart(false), 2000)
    }
  }

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleWishlist(product.id)
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg h-full">
        <div className="relative aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.title}
            width={400}
            height={400}
            className="h-full w-full pl-4 pr-4 object-cover transition-transform duration-300 group-hover:scale-105"
          />
          {/* Wishlist Heart Button */}
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 h-9 w-9 bg-background/80 hover:bg-background transition-all"
            onClick={handleToggleWishlist}
          >
            <Heart
              className={`h-5 w-5 transition-all ${isFavorited ? 'fill-red-500 text-red-500' : 'text-muted-foreground'
                }`}
            />
          </Button>
        </div>
        <CardContent className="p-4 space-y-3">
          <div>
            <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
            <h3 className="font-medium text-sm line-clamp-2 group-hover:text-foreground transition-colors">
              {product.title}
            </h3>
          </div>
          <div className="flex items-center justify-between">
            <p className="font-semibold">${product.price.toFixed(2)}</p>
            <Button
              size="sm"
              variant={addedToCart ? 'default' : 'outline'}
              onClick={handleAddToCart}
              className="gap-1"
            >
              <ShoppingCart className="h-4 w-4" />
              {addedToCart ? 'Added' : 'Add'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

export function ProductCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <Skeleton className="h-3 w-16" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-20" />
    </div>
  )
}
