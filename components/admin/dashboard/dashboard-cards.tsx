"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Camera, Calendar, DollarSign, TrendingUp, TrendingDown } from "lucide-react"

export function DashboardCards() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalPhotographers: 0,
    totalBookings: 0,
    totalRevenue: 0,
    userGrowth: 0,
    bookingGrowth: 0,
    revenueGrowth: 0,
    photographerGrowth: 0,
  })

  useEffect(() => {
    // Simulate API call to fetch dashboard stats
    const fetchStats = async () => {
      // In a real app, you would fetch this data from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setStats({
        totalUsers: 1284,
        totalPhotographers: 47,
        totalBookings: 328,
        totalRevenue: 48500000,
        userGrowth: 12.5,
        bookingGrowth: 8.2,
        revenueGrowth: 15.3,
        photographerGrowth: 5.7,
      })
    }

    fetchStats()
  }, [])

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tổng người dùng</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.userGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{stats.userGrowth}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{stats.userGrowth}%</span>
              </>
            )}
            <span className="ml-1">so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Nhiếp ảnh gia</CardTitle>
          <Camera className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalPhotographers}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.photographerGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{stats.photographerGrowth}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{stats.photographerGrowth}%</span>
              </>
            )}
            <span className="ml-1">so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Lịch đặt</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{stats.totalBookings}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.bookingGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{stats.bookingGrowth}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{stats.bookingGrowth}%</span>
              </>
            )}
            <span className="ml-1">so với tháng trước</span>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Doanh thu</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{formatCurrency(stats.totalRevenue)}</div>
          <div className="flex items-center text-xs text-muted-foreground mt-1">
            {stats.revenueGrowth > 0 ? (
              <>
                <TrendingUp className="mr-1 h-3 w-3 text-green-500" />
                <span className="text-green-500">+{stats.revenueGrowth}%</span>
              </>
            ) : (
              <>
                <TrendingDown className="mr-1 h-3 w-3 text-red-500" />
                <span className="text-red-500">{stats.revenueGrowth}%</span>
              </>
            )}
            <span className="ml-1">so với tháng trước</span>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
