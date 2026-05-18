import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Cart",
  description: "View and manage items in your KenaKata shopping cart.",
}

export default function CartLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
