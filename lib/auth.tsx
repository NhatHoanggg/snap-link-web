"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { login as apiLogin, logout as apiLogout } from "@/lib/api"

type User = {
  user_id: number
  email: string
  full_name: string
  role: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const updateAuthState = () => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
      }
    } else {
      setUser(null)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    // Check if user is logged in on mount
    updateAuthState()

    // Listen for storage events
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "token" || e.key === "user") {
        updateAuthState()
      }
    }

    window.addEventListener("storage", handleStorageChange)
    return () => window.removeEventListener("storage", handleStorageChange)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log("login", email, password);
      const response = await apiLogin({ email, password })
      const { access_token, user } = response
      
      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      router.push("/home")
    } catch (error) {
      throw error
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem("token")
      if (token) {
        await apiLogout(token)
      }
    } catch (error) {
      console.error("Error during logout:", error)
    } finally {
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      setUser(null)
      router.push("/login")
    }
  }

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
} 