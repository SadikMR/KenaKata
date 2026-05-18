"use client"

import { useState, useEffect, useCallback, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import {
  FilterSidebar,
  FilterSidebarSkeleton,
  FilterMobile,
  ProductSearchBar,
  ProductSearchBarSkeleton,
  ActiveFilters,
  ProductList,
  ProductListSkeleton,
} from "@/components/products"
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
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true)
  const [totalProducts, setTotalProducts] = useState(0)

  // Fetch categories on mount
  useEffect(() => {
    async function fetchCategories() {
      setIsCategoriesLoading(true)
      try {
        const data = await getCategories()
        setCategories(data)
      } catch (error) {
        console.error("Failed to fetch categories:", error)
      } finally {
        setIsCategoriesLoading(false)
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

  const handlePriceChange = (value: [number, number]) => {
    setPriceRange(value)
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

  const filterProps = {
    categories,
    selectedCategory,
    onCategoryChange: handleCategoryChange,
    sortBy,
    onSortChange: setSortBy,
    priceRange,
    onPriceChange: handlePriceChange,
    isLoading: isCategoriesLoading,
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            {/* Desktop Sidebar */}
            <FilterSidebar {...filterProps} />

            {/* Main Content */}
            <div className="flex-1 min-w-0">
              <ProductSearchBar
                value={searchQuery}
                onChange={handleSearchChange}
                onMobileFilterOpen={() => setIsSidebarOpen(true)}
              />

              <ActiveFilters
                categories={categories}
                selectedCategory={selectedCategory}
                searchQuery={searchQuery}
                priceRange={priceRange}
                onCategoryChange={handleCategoryChange}
                onSearchChange={handleSearchChange}
                onPriceChange={handlePriceChange}
                onClearAll={clearFilters}
              />

              {/* Results Count */}
              <p className="text-sm text-muted-foreground mb-6">
                Showing {products.length} products {currentPage > 1 && `(Page ${currentPage})`}
              </p>

              <ProductList
                products={products}
                isLoading={isLoading}
                currentPage={currentPage}
                totalPages={totalPages}
                itemsPerPage={ITEMS_PER_PAGE}
                onPageChange={setCurrentPage}
                onClearFilters={clearFilters}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Sidebar Overlay */}
      <FilterMobile
        {...filterProps}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
    </div>
  )
}

function ProductListingLoading() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8">
          <div className="flex gap-8">
            <FilterSidebarSkeleton />
            <div className="flex-1 min-w-0">
              <ProductSearchBarSkeleton />
              <Skeleton className="h-4 w-40 mb-6" />
              <ProductListSkeleton count={6} />
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