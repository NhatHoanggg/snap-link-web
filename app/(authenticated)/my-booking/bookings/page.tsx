"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, Camera, MapPin, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import { Skeleton } from "@/components/ui/skeleton"
import { getMyBookings } from "@/services/booking.service"
import { type BookingResponse } from "@/services/booking.service"

type Booking = BookingResponse

const fetchBookings = async (): Promise<Booking[]> => {
  try {
    const data = await getMyBookings()
    console.log(data)
    return data
  } catch (error) {
    console.error("Failed to fetch bookings:", error)
    throw error
  }
}

const getStatusBadgeVariant = (status: string): "destructive" | "secondary" | "default" | "outline" => {
  switch (status) {
    case "completed":
      return "default"
    case "cancelled":
      return "destructive"
    case "pending":
      return "secondary"
    default:
      return "secondary"
  }
}

const translateStatus = (status: string) => {
  switch (status) {
    case "completed":
      return "Hoàn thành"
    case "accepted":
      return "Đã xác nhận"
    case "confirmed":
      return "Đã thanh toán"
    case "cancelled":
      return "Đã hủy"
    case "pending":
      return "Đang chờ"
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
  // const searchParams = useSearchParams()
  const [bookings, setBookings] = useState<Booking[]>([])
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const bookingsPerPage = 6

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await fetchBookings()
        setBookings(data)
        setFilteredBookings(data)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  useEffect(() => {
    // Apply filters
    let result = bookings

    if (searchTerm) {
      result = result.filter(
        (booking) =>
          booking.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (booking.booking_code && booking.booking_code.toLowerCase().includes(searchTerm.toLowerCase())) ||
          (booking.custom_location && booking.custom_location.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((booking) => booking.status === statusFilter)
    }

    if (typeFilter !== "all") {
      result = result.filter((booking) => booking.shooting_type === typeFilter)
    }

    setFilteredBookings(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [searchTerm, statusFilter, typeFilter, bookings])

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Handle booking click
  const handleBookingClick = (bookingCode: string | null) => {
    if (bookingCode) {
      router.push(`/my-booking/bookings/${bookingCode}`)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Lịch hẹn của tôi</h1>
          <p className="text-muted-foreground mt-1">Quản lý tất cả các buổi chụp ảnh đã đặt lịch</p>
        </div>
        <Button onClick={() => router.push("/book-now")} className="shrink-0">
          Đặt lịch mới
        </Button>
      </div>

      {/* Filters */}
      <div className="bg-card border rounded-lg p-4 mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Tìm kiếm theo mã đặt lịch, concept hoặc địa điểm..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="pending">Đang chờ</SelectItem>
                <SelectItem value="completed">Hoàn thành</SelectItem>
                <SelectItem value="cancelled">Đã hủy</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Loại chụp" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả loại chụp</SelectItem>
                <SelectItem value="outdoor">Ngoài trời</SelectItem>
                <SelectItem value="studio">Trong studio</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* Bookings List */}
      {loading ? (
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
      ) : filteredBookings.length === 0 ? (
        <div className="text-center py-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Calendar className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">Không tìm thấy lịch hẹn nào</h3>
          <p className="text-muted-foreground mt-1">
            {searchTerm || statusFilter !== "all" || typeFilter !== "all"
              ? "Thử thay đổi bộ lọc để xem kết quả khác"
              : "Bạn chưa có lịch hẹn nào. Hãy đặt lịch ngay!"}
          </p>
          {(searchTerm || statusFilter !== "all" || typeFilter !== "all") && (
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => {
                setSearchTerm("")
                setStatusFilter("all")
                setTypeFilter("all")
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      ) : (
        <>
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
                    <Badge variant={getStatusBadgeVariant(booking.status)} className="font-medium">
                      {translateStatus(booking.status)}
                    </Badge>
                  </div>
                </div>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg line-clamp-1">{booking.concept ||  "..."}</CardTitle>
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
                    {/* <Camera className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" /> */}
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

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage > 1) paginate(currentPage - 1)
                    }}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
                {[...Array(totalPages)].map((_, index) => {
                  const pageNumber = index + 1
                  // Show first page, last page, and pages around current page
                  if (
                    pageNumber === 1 ||
                    pageNumber === totalPages ||
                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationLink
                          href="#"
                          onClick={(e) => {
                            e.preventDefault()
                            paginate(pageNumber)
                          }}
                          isActive={pageNumber === currentPage}
                        >
                          {pageNumber}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  }
                  // Show ellipsis if there's a gap
                  if (
                    (pageNumber === 2 && currentPage > 3) ||
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)
                  ) {
                    return (
                      <PaginationItem key={pageNumber}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    )
                  }
                  return null
                })}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault()
                      if (currentPage < totalPages) paginate(currentPage + 1)
                    }}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  )
}