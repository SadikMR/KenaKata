"use client"

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react"
import { login as apiLogin, getProfile, refreshToken, createUser, type User, type AuthTokens } from "./api"

interface AuthContextType {
  user: User | null
  tokens: AuthTokens | null
  login: (email: string, password: string) => Promise<boolean>
  register: (name: string, email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
  updateProfile: (data: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Helper to set cookie
function setCookie(name: string, value: string, days: number = 7) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString()
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/`
}

// Helper to delete cookie
function deleteCookie(name: string) {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/`
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [tokens, setTokens] = useState<AuthTokens | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = async () => {
      const storedTokens = localStorage.getItem("auth_tokens")
      const storedUser = localStorage.getItem("auth_user")

      if (storedTokens && storedUser) {
        try {
          const parsedTokens: AuthTokens = JSON.parse(storedTokens)

          // Validate token by fetching profile
          const profile = await getProfile(parsedTokens.access_token)

          if (profile) {
            setUser(profile)
            setTokens(parsedTokens)
            setCookie("user-session", profile.id.toString())
          } else {
            // Try to refresh token
            const newTokens = await refreshToken(parsedTokens.refresh_token)
            if (newTokens) {
              const newProfile = await getProfile(newTokens.access_token)
              if (newProfile) {
                setUser(newProfile)
                setTokens(newTokens)
                localStorage.setItem("auth_tokens", JSON.stringify(newTokens))
                localStorage.setItem("auth_user", JSON.stringify(newProfile))
                setCookie("user-session", newProfile.id.toString())
              }
            } else {
              // Clear invalid session
              localStorage.removeItem("auth_tokens")
              localStorage.removeItem("auth_user")
              deleteCookie("user-session")
            }
          }
        } catch {
          localStorage.removeItem("auth_tokens")
          localStorage.removeItem("auth_user")
          deleteCookie("user-session")
        }
      }
      setIsLoading(false)
    }

    initAuth()
  }, [])

  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const authTokens = await apiLogin(email, password)

      if (!authTokens) {
        return false
      }

      const profile = await getProfile(authTokens.access_token)

      if (!profile) {
        return false
      }

      setUser(profile)
      setTokens(authTokens)
      localStorage.setItem("auth_tokens", JSON.stringify(authTokens))
      localStorage.setItem("auth_user", JSON.stringify(profile))
      setCookie("user-session", profile.id.toString())

      return true
    } catch {
      return false
    }
  }, [])

  const register = useCallback(async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      // Create user via API
      const newUser = await createUser({ name, email, password })

      if (!newUser) {
        return false
      }

      // Login with the new credentials
      return await login(email, password)
    } catch {
      return false
    }
  }, [login])

  const logout = useCallback(() => {
    setUser(null)
    setTokens(null)
    localStorage.removeItem("auth_tokens")
    localStorage.removeItem("auth_user")
    deleteCookie("user-session")
  }, [])

  const updateProfile = useCallback((data: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...data }
      setUser(updatedUser)
      localStorage.setItem("auth_user", JSON.stringify(updatedUser))
    }
  }, [user])

  return (
    <AuthContext.Provider value={{ user, tokens, login, register, logout, isLoading, updateProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// Re-export User type for convenience
export type { User }
