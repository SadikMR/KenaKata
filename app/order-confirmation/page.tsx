"use client"

import { Suspense } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle, Package, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ProtectedRoute } from "@/components/common/protected-route"

function OrderConfirmationContent() {
  const searchParams = useSearchParams()
  const orderNumber = searchParams.get("order") || "ORD-00000"

  const deliveryDate = new Date()
  deliveryDate.setDate(deliveryDate.getDate() + 7)
  const formattedDeliveryDate = deliveryDate.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  })

  return (
    <div className="flex-1 flex items-center justify-center">
      <div className="text-center px-4 py-16 max-w-md mx-auto">
        {/* Success Icon */}
        <div className="relative inline-flex items-center justify-center mb-8">
          <div className="absolute w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full animate-ping opacity-30" />
          <div className="relative w-20 h-20 bg-green-100 dark:bg-green-900/50 rounded-full flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
          </div>
        </div>

        <h1 className="text-3xl font-bold mb-2">Order Placed!</h1>
        <p className="text-lg text-muted-foreground mb-4">
          Thank you for your purchase.
        </p>

        {/* Order Number */}
        <div className="bg-secondary rounded-lg p-4 mb-6">
          <p className="text-sm text-muted-foreground mb-1">Order Number</p>
          <p className="text-xl font-mono font-semibold">#{orderNumber}</p>
        </div>

        {/* Delivery Estimate */}
        <div className="flex items-center justify-center gap-2 text-muted-foreground mb-8">
          <Package className="h-5 w-5" />
          <span className="text-sm">
            Estimated delivery by{" "}
            <strong className="text-foreground">{formattedDeliveryDate}</strong>
          </span>
        </div>

        <p className="text-sm text-muted-foreground mb-8">
          We&apos;ve sent a confirmation email with your order details. You can
          track your order status in your profile.
        </p>

        {/* Actions */}
        <div className="space-y-3">
          <Link href="/products" className="block">
            <Button size="lg" className="w-full">
              Continue Shopping
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
          <Link
            href="/profile"
            className="block text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            View Order Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function OrderConfirmationPage() {
  return (
    <ProtectedRoute>
      <Suspense
        fallback={
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-pulse text-center">
              <div className="h-20 w-20 bg-muted rounded-full mx-auto mb-4" />
              <div className="h-8 w-48 bg-muted rounded mx-auto mb-2" />
              <div className="h-4 w-64 bg-muted rounded mx-auto" />
            </div>
          </div>
        }
      >
        <OrderConfirmationContent />
      </Suspense>
    </ProtectedRoute>
  )
}
