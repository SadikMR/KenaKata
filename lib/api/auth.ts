import { API_BASE_URL } from "./client"
import { AuthTokens, User } from "./types"

export async function login(email: string, password: string): Promise<AuthTokens | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    })
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

export async function getProfile(accessToken: string): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store"
    })
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

export async function refreshToken(refreshTokenValue: string): Promise<AuthTokens | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/auth/refresh-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken: refreshTokenValue }),
    })
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}