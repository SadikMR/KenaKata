import { CreditCard, Smartphone, Wallet } from "lucide-react"

export interface CheckoutFormData {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  zip: string
  country: string
  cardNumber: string
  expiry: string
  cvv: string
  mobileNumber: string
  transactionId: string
}

export interface FormErrors {
  [key: string]: string
}

export type PaymentMethod = "card" | "bkash" | "nagad" | "rocket"
export type PaymentStep = "idle" | "validating" | "processing" | "confirming" | "success"

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

// --- Validation ---

export function validateCheckoutForm(
  formData: CheckoutFormData,
  paymentMethod: PaymentMethod
): FormErrors {
  const newErrors: FormErrors = {}

  if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
  if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
  if (!formData.email.trim()) {
    newErrors.email = "Email is required"
  } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
    newErrors.email = "Please enter a valid email"
  }
  if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
  if (!formData.address.trim()) newErrors.address = "Address is required"
  if (!formData.city.trim()) newErrors.city = "City is required"
  if (!formData.zip.trim()) newErrors.zip = "ZIP/Postal code is required"
  if (!formData.country) newErrors.country = "Country is required"

  if (paymentMethod === "card") {
    if (!formData.cardNumber.trim()) {
      newErrors.cardNumber = "Card number is required"
    } else if (formData.cardNumber.replace(/\s/g, "").length < 16) {
      newErrors.cardNumber = "Please enter a valid card number"
    }
    if (!formData.expiry.trim()) {
      newErrors.expiry = "Expiry date is required"
    } else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) {
      newErrors.expiry = "Use MM/YY format"
    }
    if (!formData.cvv.trim()) {
      newErrors.cvv = "CVV is required"
    } else if (formData.cvv.length < 3) {
      newErrors.cvv = "CVV must be 3-4 digits"
    }
  } else {
    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = "Mobile number is required"
    } else if (!/^01[3-9]\d{8}$/.test(formData.mobileNumber.replace(/\s/g, ""))) {
      newErrors.mobileNumber = "Enter a valid Bangladeshi mobile number"
    }
    if (!formData.transactionId.trim()) {
      newErrors.transactionId = "Transaction ID is required"
    } else if (formData.transactionId.length < 8) {
      newErrors.transactionId = "Enter a valid transaction ID"
    }
  }

  return newErrors
}
