"use client"

import { useState, useEffect } from "react"
import { formatDistanceToNow } from "date-fns"
import { vi } from "date-fns/locale"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Activity {
  id: number
  type: "user" | "booking" | "payment" | "system"
  title: string
  description: string
  timestamp: string
  user?: {
    name: string
    avatar?: string
  }
  status?: "success" | "pending" | "error"
}

export function RecentActivities() {
  const [activities, setActivities] = useState<Activity[]>([])
  const [activeTab, setActiveTab] = useState("all")

  useEffect(() => {
    // Simulate API call to fetch activities
    const fetchActivities = async () => {
      // In a real app, you would fetch this data from your API
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const sampleActivities: Activity[] = [
        {
          id: 1,
          type: "user",
          title: "Người dùng mới đăng ký",
          description: "Nguyễn Văn A đã đăng ký tài khoản mới",
          timestamp: new Date(Date.now() - 25 * 60000).toISOString(),
          user: {
            name: "Nguyễn Văn A",
            avatar: "/placeholder.svg",
          },
        },
        {
          id: 2,
          type: "booking",
          title: "Đặt lịch mới",
          description: "Trần Thị B đã đặt lịch với nhiếp ảnh gia Lê Văn C",
          timestamp: new Date(Date.now() - 2 * 3600000).toISOString(),
          user: {
            name: "Trần Thị B",
            avatar: "/placeholder.svg",
          },
          status: "success",
        },
        {
          id: 3,
          type: "payment",
          title: "Thanh toán thành công",
          description: "Phạm Văn D đã thanh toán 2.500.000đ cho buổi chụp ảnh",
          timestamp: new Date(Date.now() - 5 * 3600000).toISOString(),
          user: {
            name: "Phạm Văn D",
          },
          status: "success",
        },
        {
          id: 4,
          type: "booking",
          title: "Hủy đặt lịch",
          description: "Hoàng Thị E đã hủy lịch chụp ảnh với nhiếp ảnh gia Ngô Văn F",
          timestamp: new Date(Date.now() - 8 * 3600000).toISOString(),
          user: {
            name: "Hoàng Thị E",
            avatar: "/placeholder.svg",
          },
          status: "error",
        },
        {
          id: 5,
          type: "system",
          title: "Bảo trì hệ thống",
          description: "Hệ thống đã được cập nhật lên phiên bản mới",
          timestamp: new Date(Date.now() - 12 * 3600000).toISOString(),
        },
        {
          id: 6,
          type: "payment",
          title: "Thanh toán đang xử lý",
          description: "Vũ Thị G đang chờ xác nhận thanh toán 1.800.000đ",
          timestamp: new Date(Date.now() - 15 * 3600000).toISOString(),
          user: {
            name: "Vũ Thị G",
            avatar: "/placeholder.svg",
          },
          status: "pending",
        },
      ]

      setActivities(sampleActivities)
    }

    fetchActivities()
  }, [])

  const formatTime = (timestamp: string) => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true, locale: vi })
  }

  const getStatusBadge = (status?: string) => {
    if (!status) return null

    switch (status) {
      case "success":
        return (
          <Badge variant="outline" className="bg-green-100 text-green-800 hover:bg-green-100">
            Thành công
          </Badge>
        )
      case "pending":
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            Đang xử lý
          </Badge>
        )
      case "error":
        return (
          <Badge variant="outline" className="bg-red-100 text-red-800 hover:bg-red-100">
            Lỗi
          </Badge>
        )
      default:
        return null
    }
  }

  const filteredActivities =
    activeTab === "all" ? activities : activities.filter((activity) => activity.type === activeTab)

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Hoạt động gần đây</CardTitle>
            <CardDescription>Các hoạt động mới nhất trong hệ thống</CardDescription>
          </div>
          <Button variant="outline" size="sm">
            Xem tất cả
          </Button>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-2">
          <TabsList className="grid grid-cols-5 h-8">
            <TabsTrigger value="all" className="text-xs">
              Tất cả
            </TabsTrigger>
            <TabsTrigger value="user" className="text-xs">
              Người dùng
            </TabsTrigger>
            <TabsTrigger value="booking" className="text-xs">
              Đặt lịch
            </TabsTrigger>
            <TabsTrigger value="payment" className="text-xs">
              Thanh toán
            </TabsTrigger>
            <TabsTrigger value="system" className="text-xs">
              Hệ thống
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground">Không có hoạt động nào</div>
          ) : (
            filteredActivities.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4">
                {activity.user ? (
                  <Avatar>
                    <AvatarImage src={activity.user.avatar || "/placeholder.svg"} alt={activity.user.name} />
                    <AvatarFallback>{activity.user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                ) : (
                  <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-muted-foreground text-sm">SYS</span>
                  </div>
                )}
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{activity.title}</p>
                    {getStatusBadge(activity.status)}
                  </div>
                  <p className="text-sm text-muted-foreground">{activity.description}</p>
                  <p className="text-xs text-muted-foreground">{formatTime(activity.timestamp)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
