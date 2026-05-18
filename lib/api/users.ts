import { API_BASE_URL } from "./client"
import { User } from "./types"

export async function createUser(data: {
  name: string
  email: string
  password: string
  avatar?: string
}): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: data.name,
        email: data.email,
        password: data.password,
        avatar: data.avatar || "https://picsum.photos/800",
      }),
    })
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}

export async function checkEmailAvailability(email: string): Promise<boolean> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/is-available`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    })
    if (!response.ok) return false
    const data = await response.json()
    return data.isAvailable
  } catch {
    return false
  }
}

export async function updateUser(id: number, data: Partial<{ name: string; email: string }>): Promise<User | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    })
    return response.ok ? await response.json() : null
  } catch {
    return null
  }
}