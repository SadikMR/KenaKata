'use client'

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import { useAuth } from './auth-context'

interface WishlistContextType {
    wishlistItems: Set<number>
    addToWishlist: (productId: number) => void
    removeFromWishlist: (productId: number) => void
    toggleWishlist: (productId: number) => void
    isWishlisted: (productId: number) => boolean
    isLoading: boolean
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined)

export function WishlistProvider({ children }: { children: ReactNode }) {
    const [wishlistItems, setWishlistItems] = useState<Set<number>>(new Set())
    const [isLoaded, setIsLoaded] = useState(false)
    const { user } = useAuth()

    // Load wishlist from localStorage for logged-in user
    useEffect(() => {
        const loadWishlist = async () => {
            if (user) {
                try {
                    const stored = localStorage.getItem(`wishlist_${user.id}`)
                    if (stored) {
                        setWishlistItems(new Set(JSON.parse(stored)))
                    } else {
                        setWishlistItems(new Set())
                    }
                } catch (error) {
                    console.error('Failed to load wishlist:', error)
                    setWishlistItems(new Set())
                }
            } else {
                // Clear wishlist for logged-out users
                setWishlistItems(new Set())
            }
            setIsLoaded(true)
        }

        loadWishlist()
    }, [user])

    // Persist wishlist to localStorage whenever it changes
    useEffect(() => {
        if (isLoaded && user) {
            try {
                localStorage.setItem(`wishlist_${user.id}`, JSON.stringify([...wishlistItems]))
            } catch (error) {
                console.error('Failed to save wishlist:', error)
            }
        }
    }, [wishlistItems, isLoaded, user])

    const addToWishlist = useCallback((productId: number) => {
        setWishlistItems((prev) => new Set([...prev, productId]))
    }, [])

    const removeFromWishlist = useCallback((productId: number) => {
        setWishlistItems((prev) => {
            const newSet = new Set(prev)
            newSet.delete(productId)
            return newSet
        })
    }, [])

    const toggleWishlist = useCallback((productId: number) => {
        setWishlistItems((prev) => {
            const newSet = new Set(prev)
            if (newSet.has(productId)) {
                newSet.delete(productId)
            } else {
                newSet.add(productId)
            }
            return newSet
        })
    }, [])

    const isWishlisted = useCallback(
        (productId: number) => wishlistItems.has(productId),
        [wishlistItems]
    )

    return (
        <WishlistContext.Provider
            value={{
                wishlistItems,
                addToWishlist,
                removeFromWishlist,
                toggleWishlist,
                isWishlisted,
                isLoading: !isLoaded,
            }}
        >
            {children}
        </WishlistContext.Provider>
    )
}

export function useWishlist() {
    const context = useContext(WishlistContext)
    if (!context) {
        throw new Error('useWishlist must be used within a WishlistProvider')
    }
    return context
}
