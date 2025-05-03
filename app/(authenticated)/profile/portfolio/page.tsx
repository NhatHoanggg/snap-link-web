"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { userService, UserProfile } from "@/services/user.service"
import { useAuth } from "@/services/auth"
import toast from "react-hot-toast"

export default function PortfolioPage() {
  const router = useRouter()
  const { token, isLoading: isAuthLoading } = useAuth()
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        router.push("/login")
        return
      }

      try {
        const data = await userService.getProfile()
        console.log("Profile data:", data)
        setProfile(data)
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast.error("Không thể tải thông tin hồ sơ")
        router.push("/profile")
      } finally {
        setLoading(false)
      }
    }

    if (!isAuthLoading) {
      fetchProfile()
    }
  }, [token, isAuthLoading, router])

  if (isAuthLoading || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!token || !profile) {
    return <div>Error loading profile</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Portfolio</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(profile, null, 2)}
      </pre>
    </div>
  )
}
