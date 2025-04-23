"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { useRouter } from "next/navigation"
import { login as apiLogin, logout as apiLogout, loginWithGoogle as apiLoginWithGoogle } from "@/lib/api"

type User = {
  user_id: number
  email: string
  full_name: string
  role: string
  avatar?: string
  phone_number?: string
}

type AuthContextType = {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (email: string, password: string) => Promise<void>
  loginWithGoogle: (idToken: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    const userData = localStorage.getItem("user")
    
    if (token && userData) {
      try {
        setUser(JSON.parse(userData))
        setToken(token)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        setUser(null)
        setToken(null)
      }
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    try {
      const response = await apiLogin({ email, password })
      const { access_token, user } = response
      
      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      setToken(access_token)
      router.push("/home")
    } catch (error) {
      throw error
    }
  }

  const loginWithGoogle = async (idToken: string) => {
    try {
      const response = await apiLoginWithGoogle(idToken)
      const { access_token, user } = response
      localStorage.setItem("token", access_token)
      localStorage.setItem("user", JSON.stringify(user))
      setUser(user)
      setToken(access_token)
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
      setToken(null)
      router.push("/login")
    }
  }

  const value = {
    user,
    token,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
    loginWithGoogle,
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