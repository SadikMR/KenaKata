import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Products",
  description: "Browse our extensive collection of premium lifestyle and fashion essentials.",
}

export default function ProductsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
