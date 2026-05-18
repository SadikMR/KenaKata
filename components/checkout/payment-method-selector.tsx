"use client"

import { CreditCard, Check, Loader2, ShieldCheck } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  type CheckoutFormData,
  type FormErrors,
  type PaymentMethod,
  PAYMENT_METHODS,
  formatCardNumber,
  formatExpiry,
  formatMobileNumber,
} from "./checkout-types"

interface PaymentMethodSelectorProps {
  paymentMethod: PaymentMethod
  formData: CheckoutFormData
  errors: FormErrors
  total: number
  isProcessing: boolean
  onPaymentMethodChange: (method: PaymentMethod) => void
  onInputChange: (field: keyof CheckoutFormData, value: string) => void
}

export function PaymentMethodSelector({
  paymentMethod,
  formData,
  errors,
  total,
  isProcessing,
  onPaymentMethodChange,
  onInputChange,
}: PaymentMethodSelectorProps) {
  const selectedPaymentMethod = PAYMENT_METHODS.find((m) => m.id === paymentMethod)
  const isMobileBanking = paymentMethod === "bkash" || paymentMethod === "nagad" || paymentMethod === "rocket"

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Payment Method
        </CardTitle>
        <CardDescription>Choose your preferred payment method</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <RadioGroup
          value={paymentMethod}
          onValueChange={(value) => onPaymentMethodChange(value as PaymentMethod)}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
          disabled={isProcessing}
        >
          {PAYMENT_METHODS.map((method) => (
            <Label
              key={method.id}
              htmlFor={method.id}
              className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                paymentMethod === method.id
                  ? "border-accent bg-accent/5"
                  : "border-border hover:border-accent/50"
              }`}
            >
              <RadioGroupItem value={method.id} id={method.id} className="sr-only" />
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center"
                style={{
                  backgroundColor: method.color ? `${method.color}20` : "var(--secondary)",
                  color: method.color || "var(--foreground)",
                }}
              >
                <method.icon className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">{method.name}</p>
                <p className="text-xs text-muted-foreground">{method.description}</p>
              </div>
              {paymentMethod === method.id && <Check className="h-5 w-5 text-accent" />}
            </Label>
          ))}
        </RadioGroup>

        <Separator />

        {/* Card Payment Fields */}
        {paymentMethod === "card" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                placeholder="1234 5678 9012 3456"
                value={formData.cardNumber}
                onChange={(e) => onInputChange("cardNumber", formatCardNumber(e.target.value))}
                className={errors.cardNumber ? "border-destructive" : ""}
                disabled={isProcessing}
              />
              {errors.cardNumber && <p className="text-sm text-destructive">{errors.cardNumber}</p>}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  placeholder="MM/YY"
                  value={formData.expiry}
                  onChange={(e) => onInputChange("expiry", formatExpiry(e.target.value))}
                  className={errors.expiry ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {errors.expiry && <p className="text-sm text-destructive">{errors.expiry}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  placeholder="123"
                  maxLength={4}
                  value={formData.cvv}
                  onChange={(e) =>
                    onInputChange("cvv", e.target.value.replace(/\D/g, "").slice(0, 4))
                  }
                  className={errors.cvv ? "border-destructive" : ""}
                  disabled={isProcessing}
                />
                {errors.cvv && <p className="text-sm text-destructive">{errors.cvv}</p>}
              </div>
            </div>
            <div className="rounded-lg bg-secondary/50 p-3 text-sm">
              <p className="font-medium text-foreground">Test Card</p>
              <p className="text-muted-foreground">
                Use 4242 4242 4242 4242, any future date, and any 3 digits for CVV
              </p>
            </div>
          </div>
        )}

        {/* Mobile Banking Fields */}
        {isMobileBanking && (
          <div className="space-y-4">
            <div
              className="rounded-lg p-4 border"
              style={{
                borderColor: selectedPaymentMethod?.color,
                backgroundColor: `${selectedPaymentMethod?.color}10`,
              }}
            >
              <h4 className="font-medium mb-2">How to pay with {selectedPaymentMethod?.name}</h4>
              <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                <li>Go to your {selectedPaymentMethod?.name} app</li>
                <li>Select &quot;Send Money&quot; or &quot;Payment&quot;</li>
                <li>
                  Enter merchant number:{" "}
                  <span className="font-mono font-medium text-foreground">
                    {paymentMethod === "bkash"
                      ? "01712345678"
                      : paymentMethod === "nagad"
                        ? "01812345678"
                        : "01612345678"}
                  </span>
                </li>
                <li>
                  Enter amount:{" "}
                  <span className="font-medium text-foreground">${total.toFixed(2)}</span>
                </li>
                <li>Complete the payment and note the Transaction ID</li>
                <li>Enter the details below</li>
              </ol>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mobileNumber">Your {selectedPaymentMethod?.name} Number</Label>
              <Input
                id="mobileNumber"
                placeholder="01XXXXXXXXX"
                value={formData.mobileNumber}
                onChange={(e) => onInputChange("mobileNumber", formatMobileNumber(e.target.value))}
                className={errors.mobileNumber ? "border-destructive" : ""}
                disabled={isProcessing}
              />
              {errors.mobileNumber && (
                <p className="text-sm text-destructive">{errors.mobileNumber}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionId">Transaction ID (TrxID)</Label>
              <Input
                id="transactionId"
                placeholder="e.g., 8N7A5B3C1D"
                value={formData.transactionId}
                onChange={(e) => onInputChange("transactionId", e.target.value.toUpperCase())}
                className={errors.transactionId ? "border-destructive" : ""}
                disabled={isProcessing}
              />
              {errors.transactionId && (
                <p className="text-sm text-destructive">{errors.transactionId}</p>
              )}
              <p className="text-xs text-muted-foreground">
                You&apos;ll receive the Transaction ID after completing the payment in your{" "}
                {selectedPaymentMethod?.name} app
              </p>
            </div>

            <div className="rounded-lg bg-secondary/50 p-3 text-sm">
              <p className="font-medium text-foreground">Test Transaction</p>
              <p className="text-muted-foreground">
                Use any 11-digit number and any 8+ character Transaction ID for testing
              </p>
            </div>
          </div>
        )}

        <Button type="submit" className="w-full" size="lg" disabled={isProcessing}>
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <ShieldCheck className="h-4 w-4 mr-2" />
              Pay ${total.toFixed(2)}
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
