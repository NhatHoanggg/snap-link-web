"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, Camera, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Skeleton } from "@/components/ui/skeleton"
import { getMyBookingsByStatus } from "@/services/booking.service"
import { type BookingResponse } from "@/services/booking.service"

type Booking = BookingResponse

const fetchBookingsByStatus = async (status: string): Promise<Booking[]> => {
  try {
    const data = await getMyBookingsByStatus(status)
    return data
  } catch (error) {
    console.error(`Failed to fetch ${status} bookings:`, error)
    throw error
  }
}

const getStatusBadgeVariant = (status: string, paymentStatus?: string): "destructive" | "secondary" | "default" | "outline" => {
  switch (status) {
    case "completed":
      return "default"
    case "cancelled":
      return "destructive"
    case "pending":
      return "secondary"
    case "accepted":
      return "secondary"
    case "confirmed":
      if (paymentStatus === "fully_paid") {
        return "default"
      }
      return "secondary"
    default:
      return "secondary"
  }
}

const translateStatus = (status: string, paymentStatus?: string) => {
  switch (status) {
    case "completed":
      if (paymentStatus === "fully_paid") {
        return "Đã hoàn thành"
      }
      return "Đã hoàn thành"
    case "accepted":
      return "Đã xác nhận, chờ thanh toán"
    case "confirmed":
      if (paymentStatus === "deposit_paid") {
        return "Đã thanh toán 20%"
      }
      if (paymentStatus === "fully_paid") {
        return "Đã thanh toán"
      }
      return "Đã xác nhận"
    case "cancelled":
      return "Đã hủy"
    case "pending":
      return "Chờ xác nhận"
    default:
      return status
  }
}

const translateShootingType = (type: string) => {
  switch (type) {
    case "outdoor":
      return "Ngoài trời"
    case "studio":
      return "Trong studio"
    default:
      return type
  }
}

export default function MyBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<{ [key: string]: Booking[] }>({
    pending: [],
    accepted: [],
    confirmed: [],
    completed: [],
    cancelled: []
  })
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("pending")

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const statuses = ["pending", "accepted", "confirmed", "completed", "cancelled"]
        const bookingsData: { [key: string]: Booking[] } = {}
        
        for (const status of statuses) {
          const data = await fetchBookingsByStatus(status)
          bookingsData[status] = data
        }
        
        setBookings(bookingsData)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  // Handle booking click
  const handleBookingClick = (bookingCode: string | null) => {
    if (bookingCode) {
      router.push(`/my-booking/bookings/${bookingCode}`)
    }
  }

  const renderBookings = (status: string) => {
    const currentBookings = bookings[status] || []

    if (loading) {
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <div className="aspect-video w-full bg-muted">
                <Skeleton className="h-full w-full" />
              </div>
              <CardHeader>
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </CardContent>
              <CardFooter>
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          ))}
        </div>
      )
    }

    if (currentBookings.length === 0) {
      return (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Không có lịch hẹn nào</h3>
          <p className="text-muted-foreground mt-1">
            Bạn chưa có lịch hẹn nào trong trạng thái này
          </p>
        </div>
      )
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentBookings.map((booking) => (
          <Card
            key={booking.booking_id}
            className="overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => handleBookingClick(booking.booking_code)}
          >
            <div className="aspect-video w-full bg-muted relative overflow-hidden">
              <img
                src={booking.illustration_url || "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1748164460/23101740_6725295_ru1wsv.jpg"}
                alt={booking.concept}
                className="w-full h-full object-cover transition-transform hover:scale-105"
              />
              <div className="absolute top-2 right-2">
                <Badge variant={getStatusBadgeVariant(booking.status, booking.payment_status || undefined)} className="font-medium">
                  {translateStatus(booking.status, booking.payment_status || undefined)}
                </Badge>
              </div>
            </div>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg line-clamp-1">{booking.concept || "..."}</CardTitle>
                  <CardDescription>#️⃣{booking.booking_code || "Chưa có mã đặt lịch"}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-start gap-2">
                <Calendar className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Ngày chụp</p>
                  <p className="text-sm text-muted-foreground">
                    {format(parseISO(booking.booking_date), "EEEE, dd/MM/yyyy", { locale: vi })}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Địa điểm</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {booking.custom_location || "Chưa có thông tin địa điểm"}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Camera className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium">Loại chụp</p>
                  <p className="text-sm text-muted-foreground">{translateShootingType(booking.shooting_type)}</p>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div>
                  <span className="text-sm font-medium">💰 Giá tiền: </span>
                  <span className="text-sm text-muted-foreground">{booking?.total_price.toLocaleString()} VND</span>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button
                variant="outline"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  if (booking.booking_code) {
                    handleBookingClick(booking.booking_code)
                  }
                }}
                disabled={!booking.booking_code}
              >
                {booking.booking_code ? "Xem chi tiết" : "Chưa có mã đặt lịch"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lịch hẹn của tôi</h1>
          <p className="text-muted-foreground mt-1">Quản lý tất cả các buổi chụp ảnh đã đặt lịch</p>
        </div>
        <Button onClick={() => router.push("/search")} className="shrink-0">
          Đặt lịch mới
        </Button>
      </div>

      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pending">Chờ xác nhận</TabsTrigger>
          <TabsTrigger value="accepted">Đã xác nhận</TabsTrigger>
          <TabsTrigger value="confirmed">Đã thanh toán</TabsTrigger>
          <TabsTrigger value="completed">Hoàn thành</TabsTrigger>
          <TabsTrigger value="cancelled">Đã hủy</TabsTrigger>
        </TabsList>
        <TabsContent value="pending" className="mt-6">
          {renderBookings("pending")}
        </TabsContent>
        <TabsContent value="accepted" className="mt-6">
          {renderBookings("accepted")}
        </TabsContent>
        <TabsContent value="confirmed" className="mt-6">
          {renderBookings("confirmed")}
        </TabsContent>
        <TabsContent value="completed" className="mt-6">
          {renderBookings("completed")}
        </TabsContent>
        <TabsContent value="cancelled" className="mt-6">
          {renderBookings("cancelled")}
        </TabsContent>
      </Tabs>
    </div>
  )
}