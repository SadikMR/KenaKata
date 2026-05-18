"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useCart } from "@/lib/cart-context"
import { ShippingForm } from "./shipping-form"
import { PaymentMethodSelector } from "./payment-method-selector"
import { PaymentOverlay } from "./payment-overlay"
import { OrderSummary } from "./order-summary"
import {
  type CheckoutFormData,
  type FormErrors,
  type PaymentMethod,
  type PaymentStep,
  INITIAL_FORM_DATA,
  PAYMENT_STEPS_CARD,
  PAYMENT_STEPS_MOBILE,
  validateCheckoutForm,
} from "./checkout-types"

export function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { items, removeItem } = useCart()

  // Get selected item IDs from URL
  const selectedItemIds = useMemo(() => {
    const itemsParam = searchParams.get("items")
    if (!itemsParam) return new Set(items.map((i) => i.product.id))
    return new Set(itemsParam.split(",").map(Number).filter(Boolean))
  }, [searchParams, items])

  // Filter items to only selected ones
  const checkoutItems = useMemo(() => {
    return items.filter((item) => selectedItemIds.has(item.product.id))
  }, [items, selectedItemIds])

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card")
  const [paymentStep, setPaymentStep] = useState<PaymentStep>("idle")
  const [paymentProgress, setPaymentProgress] = useState(0)
  const [currentStepIndex, setCurrentStepIndex] = useState(0)
  const [formData, setFormData] = useState<CheckoutFormData>(INITIAL_FORM_DATA)
  const [errors, setErrors] = useState<FormErrors>({})

  const subtotal = checkoutItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  )
  const shipping = 0
  const total = subtotal + shipping

  const runPaymentFlow = async () => {
    const orderNumber = `ORD-${Math.floor(10000 + Math.random() * 90000)}`
    const steps = paymentMethod === "card" ? PAYMENT_STEPS_CARD : PAYMENT_STEPS_MOBILE

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i]
      setCurrentStepIndex(i)
      setPaymentStep(step.key as PaymentStep)
      setPaymentProgress(0)

      const startTime = Date.now()
      const duration = step.duration

      await new Promise<void>((resolve) => {
        const animate = () => {
          const elapsed = Date.now() - startTime
          const progress = Math.min((elapsed / duration) * 100, 100)
          setPaymentProgress(progress)

          if (elapsed < duration) {
            requestAnimationFrame(animate)
          } else {
            resolve()
          }
        }
        requestAnimationFrame(animate)
      })
    }

    setPaymentStep("success")

    // Remove only the checked out items from cart
    checkoutItems.forEach((item) => removeItem(item.product.id))

    // Small delay before redirect
    await new Promise((resolve) => setTimeout(resolve, 500))
    router.push(`/order-confirmation?order=${orderNumber}&payment=${paymentMethod}`)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const newErrors = validateCheckoutForm(formData, paymentMethod)
    setErrors(newErrors)
    if (Object.keys(newErrors).length > 0) return

    await runPaymentFlow()
  }

  const handleInputChange = (field: keyof CheckoutFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }))
    }
  }

  useEffect(() => {
    if (checkoutItems.length === 0 && paymentStep === "idle") {
      router.push("/cart")
    }
  }, [checkoutItems.length, router, paymentStep])

  if (checkoutItems.length === 0 && paymentStep === "idle") {
    return null
  }

  const isProcessing = paymentStep !== "idle"

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      {/* Payment Processing Overlay */}
      {isProcessing && (
        <PaymentOverlay
          paymentMethod={paymentMethod}
          paymentStep={paymentStep}
          paymentProgress={paymentProgress}
          currentStepIndex={currentStepIndex}
        />
      )}

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-8">
            <ShippingForm
              formData={formData}
              errors={errors}
              disabled={isProcessing}
              onInputChange={handleInputChange}
            />
            <PaymentMethodSelector
              paymentMethod={paymentMethod}
              formData={formData}
              errors={errors}
              total={total}
              isProcessing={isProcessing}
              onPaymentMethodChange={setPaymentMethod}
              onInputChange={handleInputChange}
            />
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <OrderSummary
              checkoutItems={checkoutItems}
              subtotal={subtotal}
              total={total}
              paymentMethod={paymentMethod}
            />
          </div>
        </div>
      </form>
    </div>
  )
}
