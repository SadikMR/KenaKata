"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) {
      setIsSubmitted(true)
      setEmail("")
    }
  }

  return (
    <section className="bg-[#85644f] text-primary-foreground py-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col items-center text-center gap-4 max-w-xl mx-auto">
          <h2 className="text-2xl font-bold">Stay in the loop</h2>
          <p className="text-primary-foreground/80">
            Subscribe to our newsletter for exclusive offers and updates.
          </p>
          {isSubmitted ? (
            <p className="text-sm font-medium">Thanks for subscribing!</p>
          ) : (
            <form onSubmit={handleSubmit} className="flex w-full max-w-md gap-2">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 bg-primary-foreground text-primary placeholder:text-primary/60"
                required
              />
              <Button type="submit" variant="secondary">
                Subscribe
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  )
}