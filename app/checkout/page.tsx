import { Suspense } from "react"
import { CheckoutContent } from "@/components/checkout/checkout-content"
import CheckoutLoading from "./loading"

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}