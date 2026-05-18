import { CreditCard, Smartphone, Wallet } from "lucide-react"
import * as z from "zod"

export type PaymentMethod = "card" | "bkash" | "nagad" | "rocket"
export type PaymentStep = "idle" | "validating" | "processing" | "confirming" | "success"

export const checkoutSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().min(1, "Email is required").email("Please enter a valid email"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  city: z.string().min(1, "City is required"),
  zip: z.string().min(1, "ZIP/Postal code is required"),
  country: z.string().min(1, "Country is required"),
  paymentMethod: z.enum(["card", "bkash", "nagad", "rocket"]),
  
  cardNumber: z.string().optional(),
  expiry: z.string().optional(),
  cvv: z.string().optional(),
  
  mobileNumber: z.string().optional(),
  transactionId: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.paymentMethod === "card") {
    if (!data.cardNumber?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Card number is required", path: ["cardNumber"] })
    } else if (data.cardNumber.replace(/\s/g, "").length < 16) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Please enter a valid card number", path: ["cardNumber"] })
    }
    if (!data.expiry?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Expiry date is required", path: ["expiry"] })
    } else if (!/^\d{2}\/\d{2}$/.test(data.expiry)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Use MM/YY format", path: ["expiry"] })
    }
    if (!data.cvv?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CVV is required", path: ["cvv"] })
    } else if (data.cvv.length < 3) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "CVV must be 3-4 digits", path: ["cvv"] })
    }
  } else {
    if (!data.mobileNumber?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Mobile number is required", path: ["mobileNumber"] })
    } else if (!/^01[3-9]\d{8}$/.test(data.mobileNumber.replace(/\s/g, ""))) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid Bangladeshi mobile number", path: ["mobileNumber"] })
    }
    if (!data.transactionId?.trim()) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Transaction ID is required", path: ["transactionId"] })
    } else if (data.transactionId.length < 8) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Enter a valid transaction ID", path: ["transactionId"] })
    }
  }
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

export const PAYMENT_METHODS = [
  {
    id: "card" as PaymentMethod,
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, American Express",
  },
  {
    id: "bkash" as PaymentMethod,
    name: "bKash",
    icon: Smartphone,
    description: "Pay with bKash mobile wallet",
    color: "#E2136E",
  },
  {
    id: "nagad" as PaymentMethod,
    name: "Nagad",
    icon: Smartphone,
    description: "Pay with Nagad digital wallet",
    color: "#F6921E",
  },
  {
    id: "rocket" as PaymentMethod,
    name: "Rocket",
    icon: Wallet,
    description: "Pay with Dutch-Bangla Rocket",
    color: "#8C3494",
  },
]

export const PAYMENT_STEPS_CARD = [
  { key: "validating", label: "Validating card", duration: 1200 },
  { key: "processing", label: "Processing payment", duration: 1800 },
  { key: "confirming", label: "Confirming order", duration: 1000 },
]

export const PAYMENT_STEPS_MOBILE = [
  { key: "validating", label: "Verifying transaction", duration: 1500 },
  { key: "processing", label: "Processing payment", duration: 2000 },
  { key: "confirming", label: "Confirming order", duration: 1000 },
]

export const INITIAL_FORM_DATA: CheckoutFormData = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  zip: "",
  country: "bd",
  paymentMethod: "card",
  cardNumber: "",
  expiry: "",
  cvv: "",
  mobileNumber: "",
  transactionId: "",
}

// --- Formatting helpers ---
export function formatCardNumber(value: string) {
  const cleaned = value.replace(/\D/g, "").slice(0, 16)
  const groups = cleaned.match(/.{1,4}/g)
  return groups ? groups.join(" ") : cleaned
}

export function formatExpiry(value: string) {
  const cleaned = value.replace(/\D/g, "").slice(0, 4)
  if (cleaned.length >= 2) {
    return `${cleaned.slice(0, 2)}/${cleaned.slice(2)}`
  }
  return cleaned
}

export function formatMobileNumber(value: string) {
  return value.replace(/\D/g, "").slice(0, 11)
}
