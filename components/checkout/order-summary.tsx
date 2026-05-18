"use client"

import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import type { CartItem } from "@/lib/cart-context"
import type { PaymentMethod } from "./checkout-types"
import { PAYMENT_METHODS } from "./checkout-types"

interface OrderSummaryProps {
  checkoutItems: CartItem[]
  subtotal: number
  total: number
  paymentMethod: PaymentMethod
}

export function OrderSummary({ checkoutItems, subtotal, total, paymentMethod }: OrderSummaryProps) {
  const selectedPaymentMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod)

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle>Order Summary</CardTitle>
        <CardDescription>
          {checkoutItems.length} item{checkoutItems.length !== 1 ? "s" : ""}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Items */}
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {checkoutItems.map((item) => (
            <div key={item.product.id} className="flex gap-3">
              <div className="w-16 h-16 flex-shrink-0 overflow-hidden rounded-md bg-muted">
                <Image
                  src={item.product.images[0]}
                  alt={item.product.title}
                  width={64}
                  height={64}
                  className="h-full w-full object-cover"
                />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-1">{item.product.title}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                <p className="text-sm font-medium">
                  ${(item.product.price * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}
        </div>
        <Separator />
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Shipping</span>
            <span className="text-green-600 dark:text-green-400">Free</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-semibold text-lg">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        {/* Payment Method Indicator */}
        <div className="pt-2 border-t border-border">
          <p className="text-xs text-muted-foreground mb-2">Paying with</p>
          <div className="flex items-center gap-2">
            {selectedPaymentMethod && (
              <>
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{
                    backgroundColor: selectedPaymentMethod.color
                      ? `${selectedPaymentMethod.color}20`
                      : "var(--secondary)",
                    color: selectedPaymentMethod.color || "var(--foreground)",
                  }}
                >
                  <selectedPaymentMethod.icon className="h-4 w-4" />
                </div>
                <span className="text-sm font-medium">{selectedPaymentMethod.name}</span>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
