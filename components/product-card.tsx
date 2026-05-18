import Link from "next/link"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import type { Product } from "@/lib/api"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group overflow-hidden border-border hover:border-accent transition-colors h-full">
        <div className="aspect-square overflow-hidden bg-muted">
          <Image
            src={product.images[0]}
            alt={product.title}
            width={400}
            height={400}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </div>
        <CardContent className="p-4">
          <p className="text-xs text-muted-foreground mb-1">{product.category.name}</p>
          <h3 className="font-medium text-sm line-clamp-1 group-hover:text-accent transition-colors">
            {product.title}
          </h3>
          <p className="font-semibold mt-2">${product.price.toFixed(2)}</p>
        </CardContent>
      </Card>
    </Link>
  )
}