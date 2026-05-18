"use client"

import { useState } from "react"
import Image from "next/image"
import { Skeleton } from "@/components/ui/skeleton"

interface ProductGalleryProps {
  images: string[]
  title: string
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0)

  return (
    <div className="space-y-4">
      <div className="aspect-square overflow-hidden rounded-lg bg-muted">
        <Image
          src={images[selectedImage]}
          alt={title}
          width={600}
          height={600}
          className="h-full w-full object-cover"
          priority
        />
      </div>
      {images.length > 1 && (
        <div className="flex gap-3">
          {images.slice(0, 3).map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`aspect-square w-20 overflow-hidden rounded-lg border-2 transition-colors ${
                selectedImage === index
                  ? "border-accent"
                  : "border-transparent hover:border-border"
              }`}
            >
              <Image
                src={image}
                alt={`${title} thumbnail ${index + 1}`}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export function ProductGallerySkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="aspect-square w-full rounded-lg" />
      <div className="flex gap-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="w-20 h-20 rounded-lg" />
        ))}
      </div>
    </div>
  )
}
