'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type { Product } from './api/types'
import { useAuth } from './auth-context'

export interface CartItem {
    product: Product
    quantity: number
}

interface CartContextType {
    items: CartItem[]
    addItem: (product: Product, quantity?: number) => boolean
    removeItem: (productId: number) => void
    updateQuantity: (productId: number, quantity: number) => void
    clearCart: () => void
    removeItems: (productIds: number[]) => void
    totalItems: number
    subtotal: number
    isLoading: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([])
    const [isLoaded, setIsLoaded] = useState(false)
    const { user } = useAuth()

    // Load cart from localStorage for logged-in user
    useEffect(() => {
        const loadCart = async () => {
            if (user) {
                try {
                    const stored = localStorage.getItem(`cart_${user.id}`)
                    if (stored) {
                        setItems(JSON.parse(stored))
                    } else {
                        setItems([])
                    }
                } catch (error) {
                    console.error('Failed to load cart:', error)
                    setItems([])
                }
            } else {
                // Clear cart for logged-out users
                setItems([])
            }
            setIsLoaded(true)
        }

        loadCart()
    }, [user])

    // Persist cart to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded && user) {
            try {
                localStorage.setItem(`cart_${user.id}`, JSON.stringify(items))
            } catch (error) {
                console.error('Failed to save cart:', error)
            }
        }
    }, [items, isLoaded, user])

    const addItem = useCallback(
        (product: Product, quantity: number = 1): boolean => {
            // Only allow adding to cart if user is logged in
            if (!user) {
                console.warn('User must be logged in to add items to cart')
                return false
            }

            setItems((prev) => {
                const existing = prev.find((item) => item.product.id === product.id)
                if (existing) {
                    return prev.map((item) =>
                        item.product.id === product.id
                            ? { ...item, quantity: item.quantity + quantity }
                            : item
                    )
                }
                return [...prev, { product, quantity }]
            })
            return true
        },
        [user]
    )

    const removeItem = useCallback((productId: number) => {
        setItems((prev) => prev.filter((item) => item.product.id !== productId))
    }, [])

    const updateQuantity = useCallback((productId: number, quantity: number) => {
        if (quantity <= 0) {
            setItems((prev) => prev.filter((item) => item.product.id !== productId))
            return
        }
        setItems((prev) =>
            prev.map((item) =>
                item.product.id === productId ? { ...item, quantity } : item
            )
        )
    }, [])

    const clearCart = useCallback(() => {
        setItems([])
    }, [])

    const removeItems = useCallback((productIds: number[]) => {
        setItems((prev) => prev.filter((item) => !productIds.includes(item.product.id)))
    }, [])

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
    const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)

    return (
        <CartContext.Provider
            value={{
                items,
                addItem,
                removeItem,
                updateQuantity,
                clearCart,
                removeItems,
                totalItems,
                subtotal,
                isLoading: !isLoaded,
            }}
        >
            {children}
        </CartContext.Provider>
    )
}

export function useCart() {
    const context = useContext(CartContext)
    if (!context) {
        throw new Error('useCart must be used within a CartProvider')
    }
    return context
}
