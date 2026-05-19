"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { ShoppingCart, User, Menu, X, Moon, Sun } from "lucide-react"
import { useState } from "react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/lib/auth-context"
import { useCart } from "@/lib/cart-context"
import { NavbarSearch } from "@/components/products/navbar-search"
import Image from "next/image";

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const pathname = usePathname()
  const { theme, setTheme } = useTheme()
  const { user, logout } = useAuth()
  const { totalItems } = useCart()
  const router = useRouter()

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/Logo.png" 
              alt="KenaKata Logo Icon" 
              width={160} 
              height={40} 
              // Added "mix-blend-multiply" to hide a white background 
              // (Works best if the header background is light/white)
              className="h-8 w-auto md:h-10 mix-blend-multiply" 
              priority 
            />
            <span className="text-xl font-bold tracking-tight md:text-2xl">
              KenaKata
            </span>
          </Link>

          {/* Desktop Search */}
          <NavbarSearch />

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
            >
              <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
              <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
            </Button>

            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                    {totalItems}
                  </span>
                )}
              </Button>
            </Link>

            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user.avatar} alt={user.name} />
                      <AvatarFallback className="bg-primary text-primary-foreground text-sm">
                        {user.name.split(" ").map(n => n[0]).join("")}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/profile">Profile</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button variant="ghost" size="icon">
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="border-t border-border py-4 md:hidden">
            <nav className="flex flex-col gap-2">
              <Link
                href="/products"
                className={`px-3 py-2 text-sm font-medium rounded-md ${pathname === "/products" ? "bg-secondary" : "hover:bg-secondary"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </Link>
              <Link
                href="/cart"
                className={`flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md ${pathname === "/cart" ? "bg-secondary" : "hover:bg-secondary"
                  }`}
                onClick={() => setIsMenuOpen(false)}
              >
                <span>Cart</span>
                {totalItems > 0 && (
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                    {totalItems}
                  </span>
                )}
              </Link>
              {user ? (
                <>
                  <Link
                    href="/profile"
                    className={`px-3 py-2 text-sm font-medium rounded-md ${pathname === "/profile" ? "bg-secondary" : "hover:bg-secondary"
                      }`}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    className="px-3 py-2 text-sm font-medium text-left rounded-md hover:bg-secondary"
                    onClick={() => {
                      logout()
                      setIsMenuOpen(false)
                    }}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className={`px-3 py-2 text-sm font-medium rounded-md ${pathname === "/login" ? "bg-secondary" : "hover:bg-secondary"
                    }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
              )}
              <button
                className="flex items-center justify-between px-3 py-2 text-sm font-medium rounded-md hover:bg-secondary"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                <span>Theme</span>
                {theme === "dark" ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
              </button>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
