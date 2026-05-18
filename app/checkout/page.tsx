import { Suspense } from "react"
import { Metadata } from "next"
import { CheckoutContent } from "@/components/checkout/checkout-content"
import { ProtectedRoute } from "@/components/common/protected-route"
import CheckoutLoading from "./loading"

export const metadata: Metadata = {
  title: "Checkout",
  description: "Complete your KenaKata order securely.",
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutContent />
      </Suspense>
    </ProtectedRoute>
  )
}