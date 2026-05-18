"use client"

import { useState, useRef, useEffect } from "react"
import { Search, Loader2 } from "lucide-react"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { useSearchProducts } from "@/lib/hooks"
import { useRouter } from "next/navigation"

interface NavbarSearchProps {
  onSearchSubmit?: (query: string) => void
}

export function NavbarSearch({ onSearchSubmit }: NavbarSearchProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { results, isLoading } = useSearchProducts(searchQuery, {
    limit: 5,
    debounceDelay: 300,
  })

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setIsDropdownOpen(false)
      onSearchSubmit?.(searchQuery)
    }
  }

  const handleProductClick = (productId: number) => {
    router.push(`/products/${productId}`)
    setSearchQuery("")
    setIsDropdownOpen(false)
  }

  const handleViewAllResults = () => {
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery("")
      setIsDropdownOpen(false)
    }
  }

  return (
    <div className="hidden flex-1 max-w-md md:block relative" ref={dropdownRef}>
      <form onSubmit={handleSearchSubmit}>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search products..."
            className="w-full pl-10 pr-10"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value)
              setIsDropdownOpen(true)
            }}
            onFocus={() => searchQuery && setIsDropdownOpen(true)}
          />
        </div>
      </form>

      {/* Search Results Dropdown */}
      {isDropdownOpen && searchQuery.trim() && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border rounded-lg shadow-lg z-50">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          ) : results.length > 0 ? (
            <div className="max-h-96 overflow-y-auto">
              {/* Results List */}
              <div className="divide-y divide-border">
                {results.map((product) => (
                  <button
                    key={product.id}
                    onClick={() => handleProductClick(product.id)}
                    className="w-full px-4 py-3 hover:bg-muted flex items-center gap-3 transition-colors text-left"
                  >
                    {product.images && product.images[0] && (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-12 h-12 object-cover rounded"
                      />
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm line-clamp-1">
                        {product.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              {/* View All Results Button */}
              {results.length >= 5 && (
                <div className="border-t border-border p-3 bg-muted/50">
                  <button
                    onClick={handleViewAllResults}
                    className="w-full text-sm font-medium text-primary hover:text-primary/80 transition-colors"
                  >
                    View all results
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="px-4 py-6 text-center">
              <p className="text-sm text-muted-foreground">No products found</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
