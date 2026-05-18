import Link from "next/link"
import { ShoppingBag } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <ShoppingBag className="h-4 w-4" />
              </div>
              <span className="text-lg font-bold tracking-tight">KenaKata</span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Your one-stop destination for quality products at the best prices.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/products" className="hover:text-foreground transition-colors">Products</Link></li>
              <li><Link href="/cart" className="hover:text-foreground transition-colors">Cart</Link></li>
              <li><Link href="/login" className="hover:text-foreground transition-colors">Login</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Shipping Info</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Returns</Link></li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="text-sm font-semibold mb-3">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="#" className="hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link href="#" className="hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-6 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} KenaKata. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
