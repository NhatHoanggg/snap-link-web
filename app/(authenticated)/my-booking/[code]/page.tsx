"use client"

import { useEffect, useState, use } from "react"
import { getBookingByCode } from "@/services/booking.service"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, ImageIcon, MapPin, ArrowLeft } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"

type BookingDetail = {
  booking_id: number
  booking_code: string
  booking_date: string
  concept: string
  illustration_url: string
  shooting_type: string
  custom_location: string | null
  status: string
  total_price: number
  photographer_id: number
  service_id: number
  quantity: number
  created_at: string
}

export default function BookingDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [booking, setBooking] = useState<BookingDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    getBookingByCode(code)
      .then((data) => {
        setBooking(data)
      })
      .catch((error) => {
        console.error("Error fetching booking:", error)
      })
      .finally(() => setLoading(false))
  }, [code])

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

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid gap-6">
          <Skeleton className="h-[300px] w-full rounded-xl" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full max-w-[300px]" />
            <Skeleton className="h-6 w-full max-w-[250px]" />
            <Skeleton className="h-6 w-full max-w-[200px]" />
          </div>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <h2 className="text-2xl font-semibold mb-4">Không tìm thấy lịch hẹn</h2>
          <p className="text-muted-foreground mb-6">
            Lịch hẹn bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
          </p>
          <Button onClick={() => router.push("/my-booking")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại danh sách
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container max-w-4xl mx-auto py-8 px-4">
      <Button
        variant="ghost"
        className="mb-8"
        onClick={() => router.push("/my-booking")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại danh sách
      </Button>

      <div className="grid gap-6">
        <Card className="overflow-hidden">
          <div className="relative w-full h-[300px] bg-muted/30">
            {booking.illustration_url ? (
              <Image
                src={booking.illustration_url}
                alt={booking.concept}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <ImageIcon className="w-16 h-16 text-muted-foreground/30" />
              </div>
            )}
          </div>
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold">#{booking.booking_code}</h1>
                <Badge variant="outline" className={`${getStatusColor(booking.status)} capitalize font-medium`}>
                  {booking.status}
                </Badge>
              </div>
              <div className="text-xl font-semibold">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                  booking.total_price
                )}
              </div>
            </div>

            <div className="grid gap-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-3">
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
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-muted-foreground">Concept</span>
                    <p className="font-medium">{booking.concept}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Kiểu chụp</span>
                    <p className="font-medium">{booking.shooting_type}</p>
                  </div>
                  <div>
                    <span className="text-sm text-muted-foreground">Số lượng</span>
                    <p className="font-medium">{booking.quantity} người</p>
                  </div>
                </div>
              </div>

              {booking.status === "pending" && (
                <div className="flex gap-3 mt-4">
                  <Button variant="outline" className="text-red-500 hover:text-red-600">
                    Hủy lịch
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 