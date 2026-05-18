"use client"

import { Check, Loader2, ShieldCheck, CreditCard, Truck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { PaymentMethod, PaymentStep } from "./checkout-types"
import { PAYMENT_METHODS, PAYMENT_STEPS_CARD, PAYMENT_STEPS_MOBILE } from "./checkout-types"

interface PaymentOverlayProps {
  paymentMethod: PaymentMethod
  paymentStep: PaymentStep
  paymentProgress: number
  currentStepIndex: number
}

export function PaymentOverlay({
  paymentMethod,
  paymentStep,
  paymentProgress,
  currentStepIndex,
}: PaymentOverlayProps) {
  const currentPaymentSteps = paymentMethod === "card" ? PAYMENT_STEPS_CARD : PAYMENT_STEPS_MOBILE
  const selectedPaymentMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod)

  return (
    <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-sm flex items-center justify-center">
      <Card className="w-full max-w-md mx-4">
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Processing Your Order</CardTitle>
          <CardDescription>
            {paymentMethod === "card"
              ? "Please wait while we process your card payment"
              : `Please wait while we verify your ${selectedPaymentMethod?.name} payment`}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            {currentPaymentSteps.map((step, index) => {
              const isActive = index === currentStepIndex
              const isComplete = index < currentStepIndex || paymentStep === "success"

              return (
                <div key={step.key} className="flex items-center gap-3">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
                      isComplete
                        ? "bg-green-600 text-white"
                        : isActive
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {isComplete ? (
                      <Check className="h-4 w-4" />
                    ) : isActive ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <span className="text-sm">{index + 1}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${isActive ? "text-foreground" : "text-muted-foreground"}`}
                    >
                      {step.label}
                    </p>
                    {isActive && <Progress value={paymentProgress} className="h-1.5 mt-1" />}
                  </div>
                </div>
              )
            })}
          </div>

          {/* Security badges */}
          <div className="flex items-center justify-center gap-4 pt-4 border-t border-border">
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <ShieldCheck className="h-4 w-4" />
              <span>Secure</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <CreditCard className="h-4 w-4" />
              <span>Encrypted</span>
            </div>
            <div className="flex items-center gap-1 text-muted-foreground text-xs">
              <Truck className="h-4 w-4" />
              <span>Fast Delivery</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
