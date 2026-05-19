import Link from "next/link"
import Image from "next/image"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
// Navbar and Footer removed from homepage per user preference
import { Newsletter } from "@/components/newsletter"
import { ProductCard } from "@/components/products/product-card"

// Decoupled architecture import entrypoint
import { getProducts, getCategories } from "@/lib/api"

export const revalidate = 60 

export default async function HomePage() {
  // Concurrent fetching across isolated files
  const [allProducts, categories] = await Promise.all([
    getProducts({ limit: 10 }),
    getCategories()
  ])
  
  const products = allProducts.slice(0, 8)

  return (
  <div className="min-h-screen flex flex-col bg-background]">
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden min-h-[450px] md:min-h-[500px] lg:h-[66vh] bg-secondary py-12 lg:py-0">

          <div className="container mx-auto px-4 h-full">
            <div className="h-full flex flex-col lg:flex-row items-center lg:items-stretch">
              {/* Left: Text overlay (on top of image) */}
              {/* Left Column: Text & Actions */}
              <div className="lg:w-1/2 w-full flex items-center justify-center lg:justify-start">
                <div className="text-center lg:text-left max-w-2xl mx-auto lg:mx-0">
                <span className="text-xs font-semibold tracking-widest text-accent uppercase bg-muted px-3 py-1 rounded-full">
                  Welcome to KenaKata
                </span>
                <h1 className="mt-4 text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground text-balance leading-[1.1]">
                  Curated essentials for modern living
                </h1>
                <p className="mt-6 text-base md:text-lg text-muted-foreground max-w-xl mx-auto lg:mx-0 text-pretty">
                  Discover our premium collection of contemporary lifestyle products and timeless essentials, thoughtfully sourced for quality and design.
                </p>
                <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                  <Link href="/products" className="w-full sm:w-auto">
                    <Button size="lg" className="w-full bg-primary text-primary-foreground hover:bg-primary/90">
                      Shop Now
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href="/products?category=clothes" className="w-full sm:w-auto">
                    <Button size="lg" variant="outline" className="w-full">
                      New Collection
                    </Button>
                  </Link>
                </div>
                </div>
              </div>

              {/* Right: small visual grid for larger screens */}
              <div className="hidden lg:flex lg:w-1/2 items-center justify-center">
                <div className="grid grid-cols-2 gap-4 w-full max-w-lg">
                  {categories.slice(0, 4).map((category, index) => (
                    <Link
                      key={category.id}
                      href={`/products?category=${category.id}`}
                      className="group relative overflow-hidden rounded-2xl aspect-[4/3]"
                    >
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        loading="eager"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        sizes="(max-width: 1024px) 40vw, 20vw"
                        quality={70}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3">
                        <h3 className="text-white font-semibold text-sm">{category.name}</h3>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="flex items-end justify-between mb-10">
              <div>
                <span className="text-sm font-medium text-accent uppercase tracking-wider">Just In</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">New Arrivals</h2>
              </div>
              <Link 
                href="/products" 
                className="hidden sm:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-accent transition-colors"
              >
                View all products
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link href="/products">
                <Button variant="outline">
                  View all products
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Shop By Category Slider Grid */}
        <section className="py-20 md:py-28">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-medium uppercase tracking-wider">Browse</span>
              <h2 className="text-3xl md:text-4xl font-bold mt-2">Shop by Category</h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
              {categories.slice(0, 5).map((category) => (
                <Link key={category.id} href={`/products?category=${category.id}`}>
                  <Card className="group overflow-hidden border-border hover:border-accent/50 transition-all duration-300 hover:shadow-lg">
                    <div className="aspect-square overflow-hidden bg-muted">
                      <Image
                        src={category.image}
                        alt={category.name}
                        width={200}
                        height={200}
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    <CardContent className="p-4 text-center">
                      <h3 className="font-semibold text-sm group-hover:text-foreground transition-colors">
                        {category.name}
                      </h3>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <Newsletter />
      </main>
    </div>
  )
}