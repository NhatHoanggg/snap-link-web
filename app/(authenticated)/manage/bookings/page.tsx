"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { format, parseISO, addDays, subDays, isSameDay } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar, CalendarCheck, CheckCircle, Clock, MapPin, User, XCircle, CalendarRange, ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { badgeVariants } from "@/components/ui/badge"
import { type VariantProps } from "class-variance-authority"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { getMyBookings, type BookingResponse, updateBookingStatus } from "@/services/booking.service"
import toast, { Toaster, ToastBar } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"

const translateStatus = (status: string) => {
  switch (status) {
    case "completed":
      return "Hoàn thành"
    case "cancelled":
      return "Đã hủy"
    case "pending":
      return "Chờ xác nhận"
    case "accepted":
      return "Đã xác nhận"
    case "confirmed":
      return "Đã thanh toán"
    default:
      return status
  }
}

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string): VariantProps<typeof badgeVariants>["variant"] => {
  switch (status) {
    case "completed":
      return "default"
    case "cancelled":
      return "destructive"
    case "pending":
      return "secondary"
    case "accepted":
      return "outline"
    case "confirmed":
      return "default"
    default:
      return "secondary"
  }
}

export default function PhotographerBookingsPage() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [filteredBookings, setFilteredBookings] = useState<BookingResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [activeTab, setActiveTab] = useState("all")
  const [selectedBooking, setSelectedBooking] = useState<BookingResponse | null>(null)
  const bookingsPerPage = 6
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)

  // Stats
  const pendingCount = bookings.filter((b) => b.status === "pending").length
  const acceptedCount = bookings.filter((b) => b.status === "accepted").length
  const confirmedCount = bookings.filter((b) => b.status === "confirmed").length
  const completedCount = bookings.filter((b) => b.status === "completed").length
  const totalBookings = bookings.length
  const totalRevenue = bookings
    .filter((b) => b.status === "completed")
    .reduce((sum, booking) => sum + booking.total_price, 0)

  useEffect(() => {
    const loadBookings = async () => {
      try {
        const data = await getMyBookings()
        setBookings(data)
        setFilteredBookings(data)
        console.log(data)
      } catch (error) {
        console.error("Failed to fetch bookings:", error)
        toast.error("Không thể tải danh sách đặt lịch. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  useEffect(() => {
    // Apply filters
    let result = bookings

    // Apply tab filter first
    if (activeTab !== "all") {
      result = result.filter((booking) => booking.status === activeTab)
    }

    setFilteredBookings(result)
    setCurrentPage(1) // Reset to first page when filters change
  }, [bookings, activeTab])

  // Get current bookings for pagination
  const indexOfLastBooking = currentPage * bookingsPerPage
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage
  const currentBookings = filteredBookings.slice(indexOfFirstBooking, indexOfLastBooking)
  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage)

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber)

  // Handle booking click
  const handleBookingClick = (booking: BookingResponse) => {
    setSelectedBooking(booking)
    router.push(`/manage/bookings/${booking.booking_code}`)
  }

  // Handle status update
  const handleStatusUpdate = async (bookingId: number, newStatus: string) => {
    try {
      await updateBookingStatus(bookingId, newStatus)
      const updatedBookings = bookings.map((booking) =>
        booking.booking_id === bookingId ? { ...booking, status: newStatus } : booking,
      )
      setBookings(updatedBookings)

      if (selectedBooking && selectedBooking.booking_id === bookingId) {
        setSelectedBooking({ ...selectedBooking, status: newStatus })
      }

      const updatedBooking = updatedBookings.find(booking => booking.booking_id === bookingId)
      const bookingCode = updatedBooking?.booking_code || 'Chưa có mã'
      
      toast.success(`Đặt lịch #${bookingCode} đã được cập nhật thành ${translateStatus(newStatus).toLowerCase()}`)
    } catch (error) {
      console.error("Failed to update booking status:", error)
      toast.error("Không thể cập nhật trạng thái đặt lịch. Vui lòng thử lại sau.")
    }
  }

  // Get bookings for the selected date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(parseISO(booking.booking_date), date)
    )
  }

  const currentDateBookings = getBookingsForDate(selectedDate)

  return (
    <div className="h-full flex-1 space-y-8 p-8 pt-6">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quản lý đặt lịch</h1>
            <p className="text-muted-foreground mt-1">Quản lý tất cả các buổi chụp ảnh được đặt lịch</p>
          </div>
          <div className="flex gap-2">
            <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <CalendarRange className="h-4 w-4 mr-2" />
                  Lịch làm việc
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <DialogHeader>
                  <DialogTitle>Lịch làm việc</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Date Navigation */}
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedDate(prev => subDays(prev, 1))}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-center">
                      <h3 className="text-lg font-semibold">
                        {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {currentDateBookings.length} buổi chụp
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setSelectedDate(prev => addDays(prev, 1))}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Bookings List */}
                  <ScrollArea className="h-[400px] pr-4">
                    {currentDateBookings.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <h3 className="text-lg font-medium">Không có buổi chụp nào</h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Không có buổi chụp nào được lên lịch cho ngày này
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {currentDateBookings.map((booking) => (
                          <Card key={booking.booking_id} className="overflow-hidden">
                            <CardContent className="p-4">
                              <div className="flex items-start justify-between gap-4">
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <h4 className="font-semibold">{booking.concept}</h4>
                                    <Badge variant={getStatusBadgeVariant(booking.status)}>
                                      {translateStatus(booking.status)}
                                    </Badge>
                                  </div>
                                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-sm">
                                    <div className="flex items-center gap-2">
                                      <Clock className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">
                                        {format(parseISO(booking.booking_date), "HH:mm", { locale: vi })}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <MapPin className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">
                                        {booking.custom_location || "Chưa có địa điểm"}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <User className="h-4 w-4 text-muted-foreground" />
                                      <span className="text-muted-foreground">
                                        ID: {booking.customer_id}
                                      </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                      <div className="h-4 w-4 text-muted-foreground flex items-center justify-center">
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          viewBox="0 0 24 24"
                                          fill="none"
                                          stroke="currentColor"
                                          strokeWidth="2"
                                          strokeLinecap="round"
                                          strokeLinejoin="round"
                                          className="h-4 w-4"
                                        >
                                          <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                                        </svg>
                                      </div>
                                      <span className="text-muted-foreground">
                                        {booking.total_price > 0 ? `${booking.total_price.toLocaleString()} VND` : "Chưa cập nhật"}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => {
                                    setIsScheduleOpen(false)
                                    handleBookingClick(booking)
                                  }}
                                >
                                  Chi tiết
                                </Button>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </div>
              </DialogContent>
            </Dialog>
            <Button onClick={() => router.push("/photographer/services")}>Quản lý dịch vụ</Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Tổng đặt lịch</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalBookings}</div>
              <p className="text-xs text-muted-foreground mt-1">Tất cả các đặt lịch</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Chờ xác nhận</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{pendingCount}</div>
              <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">Cần xác nhận</p>
            </CardContent>
          </Card>
          <Card className="bg-purple-50 dark:bg-purple-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-purple-600 dark:text-purple-400">Đã xác nhận</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">{acceptedCount}</div>
              <p className="text-xs text-purple-600/70 dark:text-purple-400/70 mt-1">Đã xác nhận</p>
            </CardContent>
          </Card>
          <Card className="bg-blue-50 dark:bg-blue-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-blue-600 dark:text-blue-400">Đã xác nhận</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{confirmedCount}</div>
              <p className="text-xs text-blue-600/70 dark:text-blue-400/70 mt-1">Đã xác nhận</p>
            </CardContent>
          </Card>
          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Hoàn thành</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{completedCount}</div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">Đã hoàn thành</p>
            </CardContent>
          </Card>
          <Card className="bg-primary-50 dark:bg-primary-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-primary dark:text-primary/90">Doanh thu</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary dark:text-primary/90">
                {totalRevenue.toLocaleString()} <span className="text-sm font-normal">VND</span>
              </div>
              <p className="text-xs text-primary/70 dark:text-primary/70 mt-1">Từ các đặt lịch hoàn thành</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-6 w-full sm:w-auto">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="pending" className="text-yellow-600">
                Chờ xác nhận
              </TabsTrigger>
              <TabsTrigger value="accepted" className="text-blue-600">
                Đã xác nhận
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="text-purple-600">
                Đã thanh toán
              </TabsTrigger>
              <TabsTrigger value="completed" className="text-green-600">
                Hoàn thành
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="text-red-600">
                Đã hủy
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between gap-4">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-3/4" />
                      <Skeleton className="h-4 w-1/2" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                    <Skeleton className="h-16 w-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Calendar className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Không tìm thấy đặt lịch nào</h3>
            <p className="text-muted-foreground mt-1">
              {activeTab !== "all"
                ? "Thử thay đổi bộ lọc để xem kết quả khác"
                : "Bạn chưa có đặt lịch nào."}
            </p>
            {activeTab !== "all" && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setActiveTab("all")
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="space-y-4">
              {currentBookings.map((booking) => (
                <Card key={booking.booking_id} className="overflow-hidden hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3
                            className="text-lg font-semibold hover:text-primary cursor-pointer"
                            onClick={() => handleBookingClick(booking)}
                          >
                            {booking.concept}
                          </h3>
                          <Badge variant={getStatusBadgeVariant(booking.status)} className="font-medium">
                            {translateStatus(booking.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Mã đặt lịch: {booking.booking_code || "Chưa có mã"}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                              Cập nhật trạng thái
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            {/* {booking.status !== "pending" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.booking_id, "pending")}>
                                <Clock className="mr-2 h-4 w-4 text-yellow-500" />
                                <span>Chờ xác nhận</span>
                              </DropdownMenuItem>
                            )} */}
                            {booking.status !== "accepted" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.booking_id, "accepted")}>
                                <CalendarCheck className="mr-2 h-4 w-4 text-blue-500" />
                                <span>Xác nhận</span>
                              </DropdownMenuItem>
                            )}
                            {/* {booking.status !== "confirmed" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.booking_id, "confirmed")}>
                                <CheckCircle className="mr-2 h-4 w-4 text-purple-500" />
                                <span>Thanh toán</span>
                              </DropdownMenuItem>
                            )} */}
                            {booking.status !== "completed" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.booking_id, "completed")}>
                                <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                                <span>Hoàn thành</span>
                              </DropdownMenuItem>
                            )}
                            {booking.status !== "cancelled" && (
                              <DropdownMenuItem onClick={() => handleStatusUpdate(booking.booking_id, "cancelled")}>
                                <XCircle className="mr-2 h-4 w-4 text-red-500" />
                                <span>Hủy</span>
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleBookingClick(booking)}
                        >
                          <span className="sr-only">Xem chi tiết</span>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="m9 18 6-6-6-6" />
                          </svg>
                        </Button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                      <div className="flex items-start gap-2">
                        <Calendar className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Ngày chụp</p>
                          <p className="text-sm text-muted-foreground">
                            {format(parseISO(booking.booking_date), "EEEE, dd/MM/yyyy", { locale: vi })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Địa điểm</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.custom_location || "Chưa có thông tin địa điểm"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <User className="h-4 w-4 text-primary mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Khách hàng</p>
                          <p className="text-sm text-muted-foreground">ID: {booking.customer_id}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="h-4 w-4 text-primary mt-0.5 flex items-center justify-center">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="h-4 w-4"
                          >
                            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Tổng tiền</p>
                          <p className="text-sm text-muted-foreground">
                            {booking.total_price > 0 ? `${booking.total_price.toLocaleString()} VND` : "Chưa cập nhật"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
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
      <Toaster position="bottom-right">
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button onClick={() => toast.dismiss(t.id)}>X</button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  )
}
