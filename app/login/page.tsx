import { Suspense } from "react"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { LoginForm } from "@/components/auth"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <Link href="/" className="text-2xl font-bold tracking-tight mb-2 inline-block">
            KenaKata
          </Link>
          <CardTitle className="text-xl">Welcome back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="h-64 bg-muted rounded-lg animate-pulse" />}>
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  )
}
