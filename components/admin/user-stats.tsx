"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Users, UserCheck, UserX, Camera } from "lucide-react"

interface UserStatsProps {
  isLoading?: boolean
}

export function UserStats({ isLoading = false }: UserStatsProps) {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    inactiveUsers: 0,
    photographers: 0,
  })

  useEffect(() => {
    if (isLoading) return

    // In a real application, you would fetch these stats from your API
    // For this example, we'll use sample data
    const fetchStats = async () => {
      try {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 1000))

        setStats({
          totalUsers: 28,
          activeUsers: 24,
          inactiveUsers: 4,
          photographers: 10,
        })
      } catch (error) {
        console.error("Error fetching user stats:", error)
      }
    }

    fetchStats()
  }, [isLoading])

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array(4)
          .fill(0)
          .map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  <Skeleton className="h-4 w-24" />
                </CardTitle>
                <Skeleton className="h-8 w-8 rounded-full" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-1" />
                <Skeleton className="h-4 w-32" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers}</div>
          <p className="text-xs text-muted-foreground">Tất cả người dùng trong hệ thống</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Người dùng hoạt động</CardTitle>
          <UserCheck className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.activeUsers}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((stats.activeUsers / stats.totalUsers) * 100)}% tổng số người dùng
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Người dùng vô hiệu</CardTitle>
          <UserX className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.inactiveUsers}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((stats.inactiveUsers / stats.totalUsers) * 100)}% tổng số người dùng
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nhiếp ảnh gia</CardTitle>
          <Camera className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.photographers}</div>
          <p className="text-xs text-muted-foreground">
            {Math.round((stats.photographers / stats.totalUsers) * 100)}% tổng số người dùng
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
