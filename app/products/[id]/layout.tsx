import { Metadata } from "next"
import { getProductById } from "@/lib/api"

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata(
  { params }: Props
): Promise<Metadata> {
  const resolvedParams = await params
  const id = Number(resolvedParams.id)
  
  try {
    const product = await getProductById(id)
    
    if (!product) {
      return {
        title: 'Product Not Found',
      }
    }

    // Use the first image for OpenGraph, or a fallback if no images exist
    const ogImage = product.images && product.images.length > 0 
      ? product.images[0] 
      : '/icon-light-32x32.png' // Fallback image

    return {
      title: product.title,
      description: product.description.substring(0, 160) + (product.description.length > 160 ? '...' : ''),
      openGraph: {
        title: `${product.title} | KenaKata`,
        description: product.description.substring(0, 160) + (product.description.length > 160 ? '...' : ''),
        images: [
          {
            url: ogImage,
            width: 800,
            height: 600,
            alt: product.title,
          },
        ],
      },
    }
  } catch (error) {
    return {
      title: 'Product',
    }
  }
}

export default function ProductDetailLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
