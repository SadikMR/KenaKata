import { Suspense } from "react"
import { CheckoutContent } from "@/components/checkout/checkout-content"
import { ProtectedRoute } from "@/components/common/protected-route"
import CheckoutLoading from "./loading"

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <Suspense fallback={<CheckoutLoading />}>
        <CheckoutContent />
      </Suspense>
    </ProtectedRoute>
  )
}