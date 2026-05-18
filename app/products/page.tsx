"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { ProductCard } from "@/components/product-card"
import { getProducts, getCategories, type Product, type Category } from "@/lib/api"

const ITEMS_PER_PAGE = 12

function ProductListingContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  // Get initial values from URL
  const initialCategory = searchParams.get("category") || ""
  const initialSearch = searchParams.get("search") || ""
  const initialPage = parseInt(searchParams.get("page") || "1")
  
  const [searchQuery, setSearchQuery] = useState(initialSearch)
  const [selectedCategory, setSelectedCategory] = useState(initialCategory)
  const [sortBy, setSortBy] = useState("newest")
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [currentPage, setCurrentPage] = useState(initialPage)
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000])
  
  // Data states
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      }
    }
    fetchCategories()
  }, [])

  // Fetch products when filters change
  const fetchProducts = useCallback(async () => {
    setIsLoading(true)
    try {
      const offset = (currentPage - 1) * ITEMS_PER_PAGE
      
      const filters: Parameters<typeof getProducts>[0] = {
        offset,
        limit: ITEMS_PER_PAGE,
      }
      
      if (searchQuery) {
        filters.title = searchQuery
      }
      
      if (selectedCategory) {
        filters.categoryId = parseInt(selectedCategory)
      }
      
      if (priceRange[0] > 0 || priceRange[1] < 1000) {
        filters.price_min = priceRange[0]
        filters.price_max = priceRange[1]
      }
      
      const data = await getProducts(filters)
      
      // Client-side sorting since API doesn't support it
      let sortedData = [...data]
      switch (sortBy) {
        case "price-low":
          sortedData.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          sortedData.sort((a, b) => b.price - a.price)
          break
        case "newest":
        default:
          break
      }
      
      setProducts(sortedData)
      
      // Estimate total - if we got full page, there might be more
      if (data.length === ITEMS_PER_PAGE) {
        setTotalProducts((currentPage) * ITEMS_PER_PAGE + ITEMS_PER_PAGE)
      } else {
        setTotalProducts((currentPage - 1) * ITEMS_PER_PAGE + data.length)
      }
    } catch (error) {
      console.error("Failed to fetch products:", error)
      setProducts([])
    } finally {
      setIsLoading(false)
    }
  }, [currentPage, searchQuery, selectedCategory, priceRange, sortBy])

  useEffect(() => {
    fetchProducts()
  }, [fetchProducts])

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (selectedCategory) params.set("category", selectedCategory)
    if (searchQuery) params.set("search", searchQuery)
    if (currentPage > 1) params.set("page", currentPage.toString())
    
    const newUrl = params.toString() ? `?${params.toString()}` : "/products"
    router.replace(newUrl, { scroll: false })
  }, [selectedCategory, searchQuery, currentPage, router])

  const totalPages = Math.ceil(totalProducts / ITEMS_PER_PAGE)

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setCurrentPage(1)
  }

  const handlePriceChange = (value: number[]) => {
    setPriceRange([value[0], value[1]])
    setCurrentPage(1)
  }

  const handleSearchChange = (value: string) => {
    setSearchQuery(value)
    setCurrentPage(1)
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("")
    setSortBy("newest")
    setPriceRange([0, 1000])
    setCurrentPage(1)
  }

  const hasFilters = searchQuery || selectedCategory || priceRange[0] > 0 || priceRange[1] < 1000

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24 space-y-8">
                <div>
                  <h2 className="font-semibold mb-4">Categories</h2>
                  <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                    <button
                      onClick={() => handleCategoryChange("")}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        !selectedCategory
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      All Products
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id.toString())}
                        className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                          selectedCategory === category.id.toString()
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-secondary"
                        }`}
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price Range Filter */}
                <div>
                  <h2 className="font-semibold mb-4">Price Range</h2>
                  <div className="px-2">
                    <Slider
                      value={[priceRange[0], priceRange[1]]}
                      onValueChange={handlePriceChange}
                      max={1000}
                      min={0}
                      step={10}
                      className="mb-4"
                    />
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>${priceRange[0]}</span>
                      <span>${priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h2 className="font-semibold mb-4">Sort By</h2>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              {/* Search and Mobile Filter */}
              <div className="flex gap-4 mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search products..."
                    className="pl-10 pr-10"
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                  />
                </div>
                <Button
                  variant="outline"
                  className="lg:hidden"
                  onClick={() => setIsSidebarOpen(true)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              {/* Active Filters */}
              {hasFilters && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {selectedCategory && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                      {categories.find((c) => c.id.toString() === selectedCategory)?.name}
                      <button onClick={() => handleCategoryChange("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {searchQuery && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                      &quot;{searchQuery}&quot;
                      <button onClick={() => handleSearchChange("")}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  {(priceRange[0] > 0 || priceRange[1] < 1000) && (
                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary rounded-full text-sm">
                      ${priceRange[0]} - ${priceRange[1]}
                      <button onClick={() => handlePriceChange([0, 1000])}>
                        <X className="h-3 w-3" />
                      </button>
                    </span>
                  )}
                  <button
                    onClick={clearFilters}
                    className="text-sm text-muted-foreground hover:text-foreground"
                  >
                    Clear all
                  </button>
                </div>
              )}

              {/* Results Count */}
              <p className="text-sm text-muted-foreground mb-6">
                Showing {products.length} products {currentPage > 1 && `(Page ${currentPage})`}
              </p>

              {/* Product Grid or Empty State */}
              {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                  {[...Array(6)].map((_, i) => (
                    <div key={i} className="space-y-3">
                      <Skeleton className="aspect-square rounded-lg" />
                      <Skeleton className="h-3 w-16" />
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  ))}
                </div>
              ) : products.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {(totalPages > 1 || products.length === ITEMS_PER_PAGE) && (
                    <div className="flex items-center justify-center gap-2 mt-8">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                        disabled={currentPage === 1}
                      >
                        <ChevronLeft className="h-4 w-4" />
                      </Button>
                      
                      <div className="flex items-center gap-1">
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum = i + 1
                          if (totalPages > 5 && currentPage > 3) {
                            pageNum = currentPage - 2 + i
                            if (pageNum > totalPages) pageNum = totalPages - 4 + i
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              size="icon"
                              onClick={() => setCurrentPage(pageNum)}
                              className="w-10 h-10"
                            >
                              {pageNum}
                            </Button>
                          )
                        })}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={products.length < ITEMS_PER_PAGE}
                      >
                        <ChevronRight className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-secondary mb-4">
                    <Search className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">No products found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search or filter criteria.
                  </p>
                  <Button onClick={clearFilters} variant="outline">
                    Clear filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="absolute right-0 top-0 h-full w-80 max-w-full bg-card border-l border-border p-6 overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Filters</h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsSidebarOpen(false)}
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3">Categories</h3>
                <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                  <button
                    onClick={() => {
                      handleCategoryChange("")
                      setIsSidebarOpen(false)
                    }}
                    className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                      !selectedCategory
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-secondary"
                    }`}
                  >
                    All Products
                  </button>
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      onClick={() => {
                        handleCategoryChange(category.id.toString())
                        setIsSidebarOpen(false)
                      }}
                      className={`block w-full text-left px-3 py-2 text-sm rounded-md transition-colors ${
                        selectedCategory === category.id.toString()
                          ? "bg-primary text-primary-foreground"
                          : "hover:bg-secondary"
                      }`}
                    >
                      {category.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Price Range Filter */}
              <div>
                <h3 className="font-medium mb-3">Price Range</h3>
                <div className="px-2">
                  <Slider
                    value={[priceRange[0], priceRange[1]]}
                    onValueChange={handlePriceChange}
                    max={1000}
                    min={0}
                    step={10}
                    className="mb-4"
                  />
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-3">Sort By</h3>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function ProductListingLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="space-y-3">
                <Skeleton className="h-4 w-24" />
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            </aside>
            <div className="flex-1">
              <Skeleton className="h-10 mb-6" />
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="aspect-square rounded-lg" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductListingLoading />}>
      <ProductListingContent />
    </Suspense>
  )
}