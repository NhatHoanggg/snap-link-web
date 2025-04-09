"use client"

import { useAuth } from "@/lib/auth"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

export default function HomePage() {
  const { user, isAuthenticated, isLoading, logout } = useAuth()
  const router = useRouter()
  const [isChecking, setIsChecking] = useState(true)

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")
      return !!(token && userData)
    }

    // console.log("Home page - Auth state:", {
    //   isAuthenticated,
    //   isLoading,
    //   user,
    //   localStorageCheck: checkAuth()
    // })

    if (!isLoading) {
      if (!checkAuth()) {
        console.log("Redirecting to login - Not authenticated in localStorage")
        router.push("/")
      } else {
        setIsChecking(false)
      }
    }
  }, [isLoading, isAuthenticated, router])

  if (isLoading || isChecking) {
    console.log("Home page - Loading state")
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  console.log("Home page - Rendering content for authenticated user:", user)
  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-3xl font-bold">Welcome, {user?.full_name}!</h1>
          <Button 
            variant="outline" 
            onClick={() => logout()}
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>
        <p className="text-muted-foreground">You are logged in as {user?.role}</p>
      </main>
    </div>
  )
}

