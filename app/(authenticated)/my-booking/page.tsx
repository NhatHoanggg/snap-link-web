"use client"

import { useEffect, useState } from "react"
import { getMyBookings } from "@/services/booking.service"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Clock, ImageIcon, MapPin, Search } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

type Booking = {
  booking_id: number
  booking_code: string
  booking_date: string
  concept: string
  illustration_url: string
  shooting_type: string
  custom_location: string | null
  status: string
  total_price: number
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    getMyBookings()
      .then((data) => {
        setBookings(data)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredBookings = bookings?.filter((booking) => {
    const bookingCode = booking.booking_code?.toLowerCase() || ""
    const concept = booking.concept?.toLowerCase() || ""
    const customLocation = booking.custom_location?.toLowerCase() || ""
    const search = searchTerm?.toLowerCase() || ""
  
    const matchesSearch =
      bookingCode.includes(search) ||
      concept.includes(search) ||
      customLocation.includes(search)
  
    const matchesStatus =
      statusFilter === "all" || booking.status === statusFilter
  
    return matchesSearch && matchesStatus
  })
  

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleViewDetails = (bookingCode: string) => {
    window.location.href = `/my-booking/${bookingCode}`
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="bg-muted/30 rounded-full p-6 mb-4">
        <ImageIcon className="w-12 h-12 text-muted-foreground/60" />
      </div>
      <h3 className="text-xl font-medium mb-2">Không có lịch hẹn nào</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Bạn chưa có lịch hẹn chụp ảnh nào. Hãy đặt lịch để bắt đầu trải nghiệm dịch vụ của chúng tôi.
      </p>
      <Button>Đặt lịch ngay</Button>
    </div>
  )

  return (
    <div className="container max-w-5xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Lịch hẹn của tôi</h1>
          <p className="text-muted-foreground">Quản lý tất cả các buổi chụp ảnh của bạn</p>
        </div>
        <Button>Đặt lịch mới</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo mã, concept hoặc địa điểm..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Đang chờ</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        <div className="grid gap-6">
          {[...Array(3)].map((_, i) => (
            <Card key={i} className="overflow-hidden border border-border/40">
              <div className="flex flex-col sm:flex-row">
                <Skeleton className="h-[220px] w-full sm:w-[280px] rounded-none" />
                <div className="p-6 flex-1">
                  <Skeleton className="h-6 w-32 mb-4" />
                  <div className="space-y-3">
                    <Skeleton className="h-4 w-full max-w-[300px]" />
                    <Skeleton className="h-4 w-full max-w-[250px]" />
                    <Skeleton className="h-4 w-full max-w-[200px]" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : filteredBookings?.length === 0 ? (
        renderEmptyState()
      ) : (
        <div className="grid gap-6">
          {filteredBookings?.map((booking) => (
            <Card
              key={booking.booking_id}
              className="overflow-hidden border border-border/40 transition-all hover:shadow-md"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-[280px] h-[220px] bg-muted/30">
                  {booking.illustration_url ? (
                    <Image
                      src={booking.illustration_url || "/placeholder.svg"}
                      alt={booking.concept}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="w-12 h-12 text-muted-foreground/30" />
                    </div>
                  )}
                </div>
                <CardContent className="p-6 flex-1">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-semibold">#{booking.booking_code}</h3>
                      <Badge variant="outline" className={`${getStatusColor(booking.status)} capitalize font-medium`}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="text-lg font-medium">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        booking.total_price,
                      )}
                    </div>
                  </div>

                  <div className="grid gap-3 mb-6">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(booking.booking_date), "EEEE, dd/MM/yyyy", { locale: vi })}</span>
                    </div>
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Clock className="h-4 w-4" />
                      <span>{format(new Date(booking.booking_date), "HH:mm", { locale: vi })}</span>
                    </div>
                    <div className="flex items-start gap-2 text-muted-foreground">
                      <MapPin className="h-4 w-4 mt-0.5" />
                      <span>{booking.custom_location || "Chưa xác định địa điểm"}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewDetails(booking.booking_code)}
                    >
                      Xem chi tiết
                    </Button>
                    {booking.status === "pending" && (
                      <Button variant="outline" size="sm" className="text-red-500 hover:text-red-600">
                        Hủy lịch
                      </Button>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
