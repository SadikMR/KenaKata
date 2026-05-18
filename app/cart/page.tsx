'use client'

import { useState, useMemo } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Minus, Plus, Trash2, ShoppingBag, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { useCart } from '@/lib/cart-context'
import { useAuth } from '@/lib/auth-context'
import { useRouter } from 'next/navigation'

export default function CartPage() {
    const { items, updateQuantity, removeItem, isLoading } = useCart()
    const { user, isLoading: authLoading } = useAuth()
    const router = useRouter()
    const [selectedItems, setSelectedItems] = useState<Set<number>>(new Set(items.map((i) => i.product.id)))

    // Update selected items when cart items change
    const validSelectedItems = useMemo(() => {
        const itemIds = new Set(items.map((i) => i.product.id))
        return new Set([...selectedItems].filter((id) => itemIds.has(id)))
    }, [items, selectedItems])

    const toggleItem = (productId: number) => {
        const newSelected = new Set(validSelectedItems)
        if (newSelected.has(productId)) {
            newSelected.delete(productId)
        } else {
            newSelected.add(productId)
        }
        setSelectedItems(newSelected)
    }

    const toggleAll = () => {
        if (validSelectedItems.size === items.length) {
            setSelectedItems(new Set())
        } else {
            setSelectedItems(new Set(items.map((i) => i.product.id)))
        }
    }

    const selectedCartItems = items.filter((item) => validSelectedItems.has(item.product.id))
    const selectedSubtotal = selectedCartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    const shipping = 0 // Free shipping
    const total = selectedSubtotal + shipping

    // Show login prompt if not authenticated
    if (!authLoading && !user) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center px-4 py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
                            <Lock className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Login Required</h1>
                        <p className="text-muted-foreground mb-6">
                            You need to be logged in to access your cart and make purchases.
                        </p>
                        <div className="flex gap-4 justify-center">
                            <Link href="/login">
                                <Button size="lg">Login</Button>
                            </Link>
                            <Link href="/register">
                                <Button size="lg" variant="outline">
                                    Register
                                </Button>
                            </Link>
                        </div>
                    </div>
                </main>
            </div>
        )
    }

    // Show loading state
    if (isLoading || authLoading) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center px-4 py-16">
                        <div className="inline-flex items-center justify-center w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin mb-4" />
                        <p className="text-muted-foreground">Loading cart...</p>
                    </div>
                </main>
            </div>
        )
    }

    // Empty cart
    if (items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col">
                <main className="flex-1 flex items-center justify-center">
                    <div className="text-center px-4 py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-secondary mb-6">
                            <ShoppingBag className="h-10 w-10 text-muted-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
                        <p className="text-muted-foreground mb-6">
                            Looks like you haven&apos;t added anything to your cart yet.
                        </p>
                        <Link href="/products">
                            <Button size="lg">Start Shopping</Button>
                        </Link>
                    </div>
                </main>
            </div>
        )
    }

    return (
        <div className="min-h-screen flex flex-col">
            <main className="flex-1">
                <div className="container mx-auto px-4 py-8">
                    <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            {/* Select All */}
                            <Card>
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <Checkbox
                                            id="select-all"
                                            checked={validSelectedItems.size === items.length && items.length > 0}
                                            onCheckedChange={toggleAll}
                                        />
                                        <label htmlFor="select-all" className="text-sm font-medium cursor-pointer">
                                            Select all items ({items.length})
                                        </label>
                                        {validSelectedItems.size > 0 && validSelectedItems.size < items.length && (
                                            <span className="text-sm text-muted-foreground">
                                                ({validSelectedItems.size} selected)
                                            </span>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {items.map((item) => (
                                <Card key={item.product.id} className={!validSelectedItems.has(item.product.id) ? 'opacity-60' : ''}>
                                    <CardContent className="p-4">
                                        <div className="flex gap-4">
                                            <div className="flex items-start">
                                                <Checkbox
                                                    checked={validSelectedItems.has(item.product.id)}
                                                    onCheckedChange={() => toggleItem(item.product.id)}
                                                    className="mt-1"
                                                />
                                            </div>
                                            <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg bg-muted relative">
                                                <Image
                                                    src={item.product.images[0]}
                                                    alt={item.product.title}
                                                    width={96}
                                                    height={96}
                                                    className="h-full w-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between">
                                                    <div>
                                                        <Link
                                                            href={`/products/${item.product.id}`}
                                                            className="font-medium hover:text-accent transition-colors line-clamp-1"
                                                        >
                                                            {item.product.title}
                                                        </Link>
                                                        <p className="text-sm text-muted-foreground">
                                                            {item.product.category.name}
                                                        </p>
                                                    </div>
                                                    <Button
                                                        variant="ghost"
                                                        size="icon"
                                                        className="text-muted-foreground hover:text-destructive"
                                                        onClick={() => removeItem(item.product.id)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                                <div className="mt-3 flex items-center justify-between">
                                                    <div className="flex items-center border border-border rounded-md">
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-r-none"
                                                            onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                                        >
                                                            <Minus className="h-3 w-3" />
                                                        </Button>
                                                        <span className="w-10 text-center text-sm font-medium">{item.quantity}</span>
                                                        <Button
                                                            variant="ghost"
                                                            size="icon"
                                                            className="h-8 w-8 rounded-l-none"
                                                            onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                                        >
                                                            <Plus className="h-3 w-3" />
                                                        </Button>
                                                    </div>
                                                    <p className="font-semibold">${(item.product.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <Card className="sticky top-24">
                                <CardHeader>
                                    <CardTitle>Order Summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="text-sm text-muted-foreground">
                                        {validSelectedItems.size} of {items.length} item{items.length !== 1 ? 's' : ''} selected
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Subtotal</span>
                                        <span>${selectedSubtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Shipping</span>
                                        <span className="text-green-600 dark:text-green-400">Free</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-semibold">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>
                                    <Link
                                        href={validSelectedItems.size > 0 ? `/checkout?items=${[...validSelectedItems].join(',')}` : '#'}
                                        className="block"
                                    >
                                        <Button className="w-full" size="lg" disabled={validSelectedItems.size === 0}>
                                            Proceed to Checkout ({validSelectedItems.size})
                                        </Button>
                                    </Link>
                                    {validSelectedItems.size === 0 && (
                                        <p className="text-sm text-center text-muted-foreground">Select items to proceed</p>
                                    )}
                                    <Link href="/products" className="block text-center text-sm text-muted-foreground hover:text-foreground transition-colors">
                                        Continue Shopping
                                    </Link>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
