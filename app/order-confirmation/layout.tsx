import { Metadata } from "next"

export const metadata: Metadata = {
  title: "Order Confirmation",
  description: "Thank you for your purchase at KenaKata.",
}

export default function OrderConfirmationLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
