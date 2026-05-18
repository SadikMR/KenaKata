"use client"

import { CreditCard, Check, Loader2, ShieldCheck } from "lucide-react"
import { useFormContext } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  type CheckoutFormData,
  PAYMENT_METHODS,
  formatCardNumber,
  formatExpiry,
  formatMobileNumber,
} from "./checkout-types"

interface PaymentMethodSelectorProps {
  total: number
  isProcessing: boolean
}

export function PaymentMethodSelector({
  total,
  isProcessing,
}: PaymentMethodSelectorProps) {
  const { control, watch } = useFormContext<CheckoutFormData>()
  const paymentMethod = watch("paymentMethod")
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
        <FormField
          control={control}
          name="paymentMethod"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  disabled={isProcessing}
                >
                  {PAYMENT_METHODS.map((method) => (
                    <FormItem key={method.id} className="flex items-center space-x-3 space-y-0">
                      <FormLabel
                        className={`flex items-center gap-4 p-4 rounded-lg border-2 cursor-pointer w-full transition-all ${
                          field.value === method.id
                            ? "border-accent bg-accent/5"
                            : "border-border hover:border-accent/50"
                        }`}
                      >
                        <FormControl>
                          <RadioGroupItem value={method.id} className="sr-only" />
                        </FormControl>
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center shrink-0"
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
                        {field.value === method.id && <Check className="h-5 w-5 text-accent shrink-0" />}
                      </FormLabel>
                    </FormItem>
                  ))}
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Separator />

        {/* Card Payment Fields */}
        {paymentMethod === "card" && (
          <div className="space-y-4">
            <FormField
              control={control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Card Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      disabled={isProcessing}
                      {...field}
                      onChange={(e) => field.onChange(formatCardNumber(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={control}
                name="expiry"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Expiry Date</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/YY"
                        disabled={isProcessing}
                        {...field}
                        onChange={(e) => field.onChange(formatExpiry(e.target.value))}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CVV</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="123"
                        maxLength={4}
                        disabled={isProcessing}
                        {...field}
                        onChange={(e) =>
                          field.onChange(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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

            <FormField
              control={control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Your {selectedPaymentMethod?.name} Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="01XXXXXXXXX"
                      disabled={isProcessing}
                      {...field}
                      onChange={(e) => field.onChange(formatMobileNumber(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={control}
              name="transactionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Transaction ID (TrxID)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="e.g., 8N7A5B3C1D"
                      disabled={isProcessing}
                      {...field}
                      onChange={(e) => field.onChange(e.target.value.toUpperCase())}
                    />
                  </FormControl>
                  <FormMessage />
                  <p className="text-xs text-muted-foreground">
                    You&apos;ll receive the Transaction ID after completing the payment in your{" "}
                    {selectedPaymentMethod?.name} app
                  </p>
                </FormItem>
              )}
            />

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
