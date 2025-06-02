"use client"

import { useState, useEffect } from "react"
import { format, parseISO, addDays, subDays, isSameDay } from "date-fns"
import { vi } from "date-fns/locale"
import { 
  Calendar, 
  CalendarCheck, 
  CheckCircle, 
  Clock, 
  MapPin, 
  User, 
  XCircle, 
  CalendarRange, 
  ChevronLeft, 
  ChevronRight,
  TrendingUp,
  Eye,
  Settings2,  
  Search,
  Camera,
  DollarSign,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  getMyBookings, 
  updateBookingStatus,
  BookingResponse 
} from "@/services/booking.service"
import { useRouter } from "next/navigation"

type BookingStatus = 'pending' | 'accepted' | 'confirmed' | 'completed' | 'cancelled'

const translateStatus = (status: BookingStatus): string => {
  switch (status) {
    case "completed": return "Hoàn thành"
    case "cancelled": return "Đã hủy"
    case "pending": return "Chờ xác nhận"
    case "accepted": return "Đã xác nhận"
    case "confirmed": return "Đã thanh toán"
    default: return status
  }
}

const translatePaymentStatus = (status: string): string => {
  switch (status) {
    case "unpaid": return "Chưa thanh toán"
    case "deposit-paid": return "Đã thanh toán 20%"
    case "fully-paid": return "Đã thanh toán toàn bộ"
    case "refunded": return "Đã hoàn tiền"
    default: return status
  }
}

const getStatusColor = (status: BookingStatus): string => {
  switch (status) {
    case "completed": return "bg-primary/10 text-primary border-primary/20"
    case "cancelled": return "bg-destructive/10 text-destructive border-destructive/20"
    case "pending": return "bg-secondary/10 text-secondary border-secondary/20"
    case "accepted": return "bg-accent/10 text-accent border-accent/20"
    case "confirmed": return "bg-primary/10 text-primary border-primary/20"
    default: return "bg-muted text-muted-foreground border-border"
  }
}

const getStatusIcon = (status: BookingStatus) => {
  switch (status) {
    case "completed": return <CheckCircle className="w-4 h-4" />
    case "cancelled": return <XCircle className="w-4 h-4" />
    case "pending": return <Clock className="w-4 h-4" />
    case "accepted": return <CalendarCheck className="w-4 h-4" />
    case "confirmed": return <DollarSign className="w-4 h-4" />
    default: return <AlertCircle className="w-4 h-4" />
  }
}

export default function ModernBookingManagement() {
  const [bookings, setBookings] = useState<BookingResponse[]>([])
  const [filteredBookings, setFilteredBookings] = useState<BookingResponse[]>([])
  const [activeTab, setActiveTab] = useState<BookingStatus | "all">("all")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [isScheduleOpen, setIsScheduleOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true)
        const data = await getMyBookings()
        setBookings(data)
        setFilteredBookings(data)
      } catch (error) {
        console.error("Error fetching bookings:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Stats calculation
  const stats = {
    total: bookings.length,
    pending: bookings.filter(b => b.status === "pending").length,
    accepted: bookings.filter(b => b.status === "accepted").length,
    confirmed: bookings.filter(b => b.status === "confirmed").length,
    completed: bookings.filter(b => b.status === "completed").length,
    revenue: bookings.filter(b => b.status === "completed").reduce((sum, b) => sum + b.total_price, 0)
  }

  // Filter bookings
  useEffect(() => {
    let result = bookings

    // Filter by tab
    if (activeTab !== "all") {
      result = result.filter(booking => booking.status === activeTab)
    }

    // Filter by search term
    if (searchTerm) {
      result = result.filter(booking => 
        booking.concept.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.booking_code.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredBookings(result)
  }, [bookings, activeTab, searchTerm])

  // Get bookings for selected date
  const getBookingsForDate = (date: Date) => {
    return bookings.filter(booking => 
      isSameDay(parseISO(booking.booking_date), date)
    )
  }

  const currentDateBookings = getBookingsForDate(selectedDate)

  // Handle status update
  const handleStatusUpdate = async (bookingId: number, newStatus: BookingStatus) => {
    try {
      await updateBookingStatus(bookingId, newStatus)
      const updatedBookings = bookings.map(booking =>
        booking.booking_id === bookingId ? { ...booking, status: newStatus } : booking
      )
      setBookings(updatedBookings)
    } catch (error) {
      console.error("Error updating booking status:", error)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-card border-b border-border shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-8">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Camera className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-foreground">Quản lý đặt lịch</h1>
                  <p className="text-muted-foreground">Quản lý tất cả các buổi chụp ảnh được đặt lịch</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input
                  placeholder="Tìm kiếm theo tên, mã booking..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              {/* Schedule Dialog */}
              <Dialog open={isScheduleOpen} onOpenChange={setIsScheduleOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <CalendarRange className="w-4 h-4" />
                    Lịch làm việc
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-4xl">
                  <DialogHeader>
                    <DialogTitle className="text-xl text-foreground">Lịch làm việc hằng ngày</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6">
                    {/* Date Navigation */}
                    <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(prev => subDays(prev, 1))}
                        className="gap-2"
                      >
                        <ChevronLeft className="w-4 h-4" />
                        Hôm qua
                      </Button>
                      <div className="text-center">
                        <h3 className="text-lg font-semibold text-foreground">
                          {format(selectedDate, "EEEE, dd/MM/yyyy", { locale: vi })}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {currentDateBookings.length} buổi chụp được lên lịch
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(prev => addDays(prev, 1))}
                        className="gap-2"
                      >
                        Ngày mai
                        <ChevronRight className="w-4 h-4" />
                      </Button>
                    </div>

                    {/* Bookings Timeline */}
                    <ScrollArea className="h-[400px] pr-4">
                      {currentDateBookings.length === 0 ? (
                        <div className="text-center py-12">
                          <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                            <Calendar className="w-8 h-8 text-muted-foreground" />
                          </div>
                          <h3 className="text-lg font-medium text-foreground">Không có buổi chụp nào</h3>
                          <p className="text-muted-foreground mt-1">Bạn có một ngày nghỉ ngơi!</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentDateBookings
                            .sort((a, b) => parseISO(a.booking_date).getTime() - parseISO(b.booking_date).getTime())
                            .map((booking, index) => (
                            <div key={booking.booking_id} className="relative">
                              {/* Timeline line */}
                              {index < currentDateBookings.length - 1 && (
                                <div className="absolute left-2 top-16 w-1 h-8 bg-border"></div>
                              )}
                              
                              <Card className="hover:shadow-md transition-shadow">
                                <CardContent className="p-4">
                                  <div className="flex items-start gap-4">
                                    {/* Time indicator */}
                                    {/* <div className="flex flex-col items-center">
                                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-primary-foreground text-sm font-medium ${
                                        booking.status === 'completed' ? 'bg-primary' :
                                        booking.status === 'confirmed' ? 'bg-primary' :
                                        booking.status === 'accepted' ? 'bg-accent' :
                                        booking.status === 'pending' ? 'bg-secondary' : 'bg-muted'
                                      }`}>
                                        {format(parseISO(booking.booking_date), "HH:mm")}
                                      </div>
                                    </div> */}
                                    
                                    {/* Booking details */}
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-start justify-between gap-4">
                                        <div className="flex-1">
                                          <h4 className="font-semibold text-foreground truncate">{booking.concept}</h4>
                                          <p className="text-sm text-muted-foreground mt-1">{booking.booking_code}</p>
                                          <div className="flex items-center gap-2 mt-2">
                                            <Badge className={`${getStatusColor(booking.status as BookingStatus)} gap-1`}>
                                              {getStatusIcon(booking.status as BookingStatus)}
                                              {translateStatus(booking.status as BookingStatus)}
                                            </Badge>

                                            <Badge className={`${getStatusColor(booking.status as BookingStatus)} gap-1 font-medium`}>
                                              {translatePaymentStatus(booking.payment_status as string)}
                                            </Badge>
                                            </div>
                                          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                              <MapPin className="w-3 h-3" />
                                              {booking.custom_location}
                                            </span>
                                            <span className="flex items-center gap-1">
                                              <DollarSign className="w-3 h-3" />
                                              {booking.total_price.toLocaleString()} VND
                                            </span>
                                          </div>
                                        </div>
                                        
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                        </div>
                      )}
                    </ScrollArea>
                  </div>
                </DialogContent>
              </Dialog>

              <Button className="gap-2" onClick={() => router.push("/services")}>
                <Settings2 className="w-4 h-4" />
                Quản lý dịch vụ
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-6 mb-8">
          <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-primary-foreground/80 text-sm font-medium">Tổng đặt lịch</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <Calendar className="w-8 h-8 text-secondary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Chờ xác nhận</p>
                  <p className="text-3xl font-bold">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-secondary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-blue-400 to-blue-500 text-accent-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-accent-foreground/80 text-sm font-medium">Đã xác nhận</p>
                  <p className="text-3xl font-bold">{stats.accepted}</p>
                </div>
                <CalendarCheck className="w-8 h-8 text-accent-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Đã thanh toán</p>
                  <p className="text-3xl font-bold">{stats.confirmed}</p>
                </div>
                <DollarSign className="w-8 h-8 text-secondary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-green-600 text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Hoàn thành</p>
                  <p className="text-3xl font-bold">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-secondary-foreground/80" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-secondary text-secondary-foreground">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-secondary-foreground/80 text-sm font-medium">Doanh thu</p>
                  <p className="text-2xl font-bold">{(stats.revenue / 1000000).toFixed(1)}M</p>
                  <p className="text-secondary-foreground/80 text-xs">VND</p>
                </div>
                <TrendingUp className="w-8 h-8 text-secondary-foreground/80" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="bg-card rounded-lg border border-border shadow-sm p-6 mb-6">
          <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as BookingStatus | "all")}>
            <TabsList className="grid grid-cols-6 w-full">
              <TabsTrigger value="all" className="gap-2">
                <Calendar className="w-4 h-4" />
                Tất cả
              </TabsTrigger>
              <TabsTrigger value="pending" className="gap-2 data-[state=active]:bg-secondary/10 data-[state=active]:text-secondary">
                <Clock className="w-4 h-4" />
                Chờ xác nhận
              </TabsTrigger>
              <TabsTrigger value="accepted" className="gap-2 data-[state=active]:bg-accent/10 data-[state=active]:text-accent">
                <CalendarCheck className="w-4 h-4" />
                Đã xác nhận
              </TabsTrigger>
              <TabsTrigger value="confirmed" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <DollarSign className="w-4 h-4" />
                Đã thanh toán
              </TabsTrigger>
              <TabsTrigger value="completed" className="gap-2 data-[state=active]:bg-primary/10 data-[state=active]:text-primary">
                <CheckCircle className="w-4 h-4" />
                Hoàn thành
              </TabsTrigger>
              <TabsTrigger value="cancelled" className="gap-2 data-[state=active]:bg-destructive/10 data-[state=active]:text-destructive">
                <XCircle className="w-4 h-4" />
                Đã hủy
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Bookings Grid */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        ) : filteredBookings.length === 0 ? (
          <Card className="p-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-medium text-foreground mb-2">Không tìm thấy kết quả</h3>
              <p className="text-muted-foreground">Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
            </div>
          </Card>
        ) : (
          <div className="grid gap-6">
            {filteredBookings.map((booking) => (
              <Card key={booking.booking_id} className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row justify-between gap-6">
                    {/* Left Section */}
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-foreground">{booking.concept}</h3>
                            <Badge className={`${getStatusColor(booking.status as BookingStatus)} gap-1 font-medium`}>
                              {getStatusIcon(booking.status as BookingStatus)}
                              {translateStatus(booking.status as BookingStatus)}
                            </Badge>

                            <Badge className={`${getStatusColor(booking.status as BookingStatus)} gap-1 font-medium`}>
                              {translatePaymentStatus(booking.payment_status as string)}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-1">
                            Mã đặt lịch: <span className="font-mono font-medium">{booking.booking_code}</span>
                          </p>
                        </div>
                      </div>

                      {/* Details Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <Calendar className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Ngày chụp</p>
                            <p className="text-sm font-medium text-foreground">
                              {format(parseISO(booking.booking_date), "dd/MM/yyyy")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(parseISO(booking.booking_date), "HH:mm")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <MapPin className="w-5 h-5 text-secondary" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Địa điểm</p>
                            <p className="text-sm font-medium text-foreground truncate">
                              {booking.custom_location}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <User className="w-5 h-5 text-accent" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Khách hàng</p>
                            <p className="text-sm font-medium text-foreground">ID: {booking.customer_id}</p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                          <DollarSign className="w-5 h-5 text-primary" />
                          <div>
                            <p className="text-xs text-muted-foreground font-medium">Tổng tiền</p>
                            <p className="text-sm font-bold text-foreground">
                              {booking.total_price.toLocaleString()} VND
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Section - Actions */}
                    <div className="flex flex-col gap-3 lg:w-48">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" className="w-full gap-2">
                            <Settings2 className="w-4 h-4" />
                            Cập nhật trạng thái
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56">
                          {booking.status !== "accepted" && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(booking.booking_id, "accepted")}>
                              <CalendarCheck className="mr-2 h-4 w-4 text-accent" />
                              <span>Xác nhận</span>
                            </DropdownMenuItem>
                          )}
                          {booking.status !== "completed" && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(booking.booking_id, "completed")}>
                              <CheckCircle className="mr-2 h-4 w-4 text-primary" />
                              <span>Hoàn thành</span>
                            </DropdownMenuItem>
                          )}
                          {booking.status !== "cancelled" && (
                            <DropdownMenuItem onClick={() => handleStatusUpdate(booking.booking_id, "cancelled")}>
                              <XCircle className="mr-2 h-4 w-4 text-destructive" />
                              <span>Hủy bỏ</span>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                      
                      <Button variant="ghost" className="w-full gap-2">
                        <Eye className="w-4 h-4" />
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}