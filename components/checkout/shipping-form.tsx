"use client"

import { Truck } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { CheckoutFormData, FormErrors } from "./checkout-types"

interface ShippingFormProps {
  formData: CheckoutFormData
  errors: FormErrors
  disabled: boolean
  onInputChange: (field: keyof CheckoutFormData, value: string) => void
}

export function ShippingForm({ formData, errors, disabled, onInputChange }: ShippingFormProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Truck className="h-5 w-5" />
          Shipping Information
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => onInputChange("firstName", e.target.value)}
              className={errors.firstName ? "border-destructive" : ""}
              disabled={disabled}
            />
            {errors.firstName && (
              <p className="text-sm text-destructive">{errors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => onInputChange("lastName", e.target.value)}
              className={errors.lastName ? "border-destructive" : ""}
              disabled={disabled}
            />
            {errors.lastName && (
              <p className="text-sm text-destructive">{errors.lastName}</p>
            )}
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => onInputChange("email", e.target.value)}
              className={errors.email ? "border-destructive" : ""}
              disabled={disabled}
            />
            {errors.email && (
              <p className="text-sm text-destructive">{errors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone Number</Label>
            <Input
              id="phone"
              type="tel"
              placeholder="01XXXXXXXXX"
              value={formData.phone}
              onChange={(e) => onInputChange("phone", e.target.value)}
              className={errors.phone ? "border-destructive" : ""}
              disabled={disabled}
            />
            {errors.phone && (
              <p className="text-sm text-destructive">{errors.phone}</p>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="address">Address</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => onInputChange("address", e.target.value)}
            className={errors.address ? "border-destructive" : ""}
            disabled={disabled}
          />
          {errors.address && (
            <p className="text-sm text-destructive">{errors.address}</p>
          )}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => onInputChange("city", e.target.value)}
              className={errors.city ? "border-destructive" : ""}
              disabled={disabled}
            />
            {errors.city && (
              <p className="text-sm text-destructive">{errors.city}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="zip">ZIP/Postal Code</Label>
            <Input
              id="zip"
              value={formData.zip}
              onChange={(e) => onInputChange("zip", e.target.value)}
              className={errors.zip ? "border-destructive" : ""}
              disabled={disabled}
            />
            {errors.zip && (
              <p className="text-sm text-destructive">{errors.zip}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={formData.country}
              onValueChange={(value) => onInputChange("country", value)}
              disabled={disabled}
            >
              <SelectTrigger className={errors.country ? "border-destructive" : ""}>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="bd">Bangladesh</SelectItem>
                <SelectItem value="in">India</SelectItem>
                <SelectItem value="pk">Pakistan</SelectItem>
                <SelectItem value="np">Nepal</SelectItem>
                <SelectItem value="lk">Sri Lanka</SelectItem>
                <SelectItem value="us">United States</SelectItem>
                <SelectItem value="uk">United Kingdom</SelectItem>
              </SelectContent>
            </Select>
            {errors.country && (
              <p className="text-sm text-destructive">{errors.country}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
