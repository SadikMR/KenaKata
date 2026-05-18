"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { useAuth } from "@/lib/auth-context"
import { FormField } from "./form-field"

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get("redirect") || "/"
  const { login } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setIsLoading(true)

    const success = await login(email, password)

    if (success) {
      router.push(redirectTo)
    } else {
      setError("Invalid email or password. Please try again.")
    }

    setIsLoading(false)
  }

  const fillDemoCredentials = () => {
    setEmail("john@mail.com")
    setPassword("changeme")
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <FormField
          id="login-email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={setEmail}
        />

        <FormField
          id="login-password"
          label="Password"
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          isPassword
        />

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Signing in..." : "Sign In"}
        </Button>
      </form>

      <div className="relative my-6">
        <Separator />
        <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
          OR
        </span>
      </div>

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="font-medium text-foreground hover:text-accent transition-colors">
          Create account
        </Link>
      </p>

      {/* Demo Credentials */}
      <div className="mt-6 p-4 bg-secondary rounded-lg">
        <p className="text-sm font-medium mb-2">Demo Credentials</p>
        <p className="text-xs text-muted-foreground mb-1">
          Email: john@mail.com
        </p>
        <p className="text-xs text-muted-foreground mb-3">
          Password: changeme
        </p>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="w-full"
          onClick={fillDemoCredentials}
        >
          Use Demo Credentials
        </Button>
      </div>
    </>
  )
}
