"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { format, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import {
  ArrowLeft,
  Calendar,
  Camera,
  Clock,
  Copy,
  ExternalLink,
  Info,
  MapPin,
  MessageSquare,
  Package,
  Tag,
  MapPinned,
  // User,
} from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { getBookingByCode, updateBookingStatus, type BookingResponse } from "@/services/booking.service"
import { photographerService, type Photographer } from "@/services/photographer.service"
import { getServiceByIdPublic, type Service } from "@/services/services.service"
import toast, { Toaster, ToastBar } from "react-hot-toast"

type Booking = BookingResponse

const fetchBookingByCode = async (code: string): Promise<Booking | null> => {
  try {
    const data = await getBookingByCode(code)
    return data
  } catch (error) {
    console.error("Failed to fetch booking:", error)
    return null
  }
}

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: string): "destructive" | "secondary" | "default" | "outline" => {
  switch (status) {
    case "completed":
      return "default"
    case "cancelled":
      return "destructive"
    case "pending":
      return "outline"
    default:
      return "secondary"
  }
}

// Helper function to translate status
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

// Helper function to translate shooting type
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

export default function BookingDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [booking, setBooking] = useState<Booking | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [cancelReason, setCancelReason] = useState("")
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)
  const [photographer, setPhotographer] = useState<Photographer | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  // Extract booking code from params and ensure it's a string
  const bookingCode = typeof params.code === 'string' ? params.code : Array.isArray(params.code) ? params.code[0] : null

  // Fetch photographer data when booking data is loaded
  useEffect(() => {
    const fetchPhotographer = async () => {
      if (booking?.photographer_id) {
        try {
          const data = await photographerService.getPhotographerById(booking.photographer_id)
          setPhotographer(data)
        } catch (error) {
          console.error("Failed to fetch photographer:", error)
        }
      }
    }

    fetchPhotographer()
  }, [booking?.photographer_id])

  useEffect(() => {
    const loadBooking = async () => {
      if (!bookingCode) {
        setError("Mã đặt lịch không hợp lệ")
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        const data = await fetchBookingByCode(bookingCode)
        if (data) {
          setBooking(data)
        } else {
          setError("Không tìm thấy thông tin đặt lịch")
        }
      } catch (error) {
        console.error("Failed to fetch booking:", error)
        setError("Đã xảy ra lỗi khi tải thông tin đặt lịch")
      } finally {
        setLoading(false)
      }
    }

    loadBooking()
  }, [bookingCode]) // Only depend on bookingCode

  const handleCopyBookingCode = () => {
    if (booking?.booking_code) {
      navigator.clipboard.writeText(booking.booking_code)
      toast("Mã đặt lịch đã được sao chép vào clipboard", {
        icon: "🔗"
      })
    }
  }

  const handleCancelBooking = async () => {
    if (!booking) return

    try {
      await updateBookingStatus(booking.booking_id, "cancelled")
      toast("Đã hủy đặt lịch", {
        icon: "❌",
      })
      setIsCancelDialogOpen(false)
      // Update the booking status locally
      setBooking({ ...booking, status: "cancelled" })
    } catch (error) {
      console.error("Failed to cancel booking:", error)
      toast.error("Không thể hủy đặt lịch. Vui lòng thử lại sau.")
    }
  }

  const handlePayment = (bookingCode: string) => {
    console.log("Thanh toán")
    router.push(`/payment/${bookingCode}`)
  }

  useEffect(() => {
    const fetchService = async () => {
      if (booking?.service_id) {
        try {
          const data = await getServiceByIdPublic(booking.service_id)
          setService(data)
        } catch (error) {
          console.error("Failed to fetch service:", error)
        }
      }
    }
    fetchService()
  }, [booking?.service_id])

  
  // Update the image fallback
  const getImageUrl = (url: string | null) => {
    if (!url) return "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1748164460/23101740_6725295_ru1wsv.jpg"
    return url
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
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
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <Skeleton className="h-8 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="space-y-4">
                  {[...Array(4)].map((_, index) => (
                    <div key={index} className="flex gap-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2 flex-1">
                        <Skeleton className="h-4 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
          <div>
            <Card>
              <CardHeader>
                <Skeleton className="h-6 w-full" />
              </CardHeader>
              <CardContent className="space-y-4">
                {[...Array(5)].map((_, index) => (
                  <Skeleton key={index} className="h-4 w-full" />
                ))}
              </CardContent>
              <CardFooter className="flex-col space-y-2">
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-full" />
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  if (error || !booking) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="sm" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
        </div>
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
            <Info className="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">{error || "Không tìm thấy thông tin đặt lịch"}</h3>
          <p className="text-muted-foreground mt-1 max-w-md">
            Mã đặt lịch không tồn tại hoặc đã bị xóa. Vui lòng kiểm tra lại mã đặt lịch của bạn.
          </p>
          <Button className="mt-6" onClick={() => router.push("/my-bookings")}>
            Xem tất cả đặt lịch
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <Button variant="ghost" size="sm" onClick={() => router.back()} className="mr-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <h1 className="text-2xl font-bold">Chi tiết đặt lịch</h1>
        </div>
        <Badge variant={getStatusBadgeVariant(booking.status)} className="text-sm px-3 py-1">
          {translateStatus(booking.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{booking.concept}</CardTitle>
              <CardDescription className="flex items-center">
                <span className="font-medium mr-2">Mã đặt lịch:</span>
                <span>{booking.booking_code}</span>
                <Button variant="ghost" size="icon" className="h-6 w-6 ml-1" onClick={handleCopyBookingCode}>
                  <Copy className="h-3.5 w-3.5" />
                </Button>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Concept Image */}
              <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                <img
                  src={getImageUrl(booking.illustration_url)}
                  alt={booking.concept || "Ảnh minh họa"}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Booking Details */}
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Ngày chụp</h3>
                    <p className="text-muted-foreground">
                      {format(parseISO(booking.booking_date), "EEEE, dd/MM/yyyy", { locale: vi })}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Nhiếp ảnh gia</h3>
                    {loading ? (
                      <p className="text-muted-foreground">
                        <span className="inline-block h-4 w-32 bg-muted animate-pulse rounded" />
                      </p>
                    ) : photographer ? (
                      <Link 
                        href={`/photographers/${photographer.slug}`}
                        className="text-muted-foreground hover:text-primary transition-colors"
                      >
                        {photographer.full_name}
                      </Link>
                    ) : (
                      <p className="text-muted-foreground">Không thể tải thông tin nhiếp ảnh gia</p>
                    )}
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Tỉnh/Thành phố</h3>
                    <p className="text-muted-foreground">{booking.province || "Chưa có thông tin tỉnh/thành phố"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPinned className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Địa điểm</h3>
                    <p className="text-muted-foreground">{booking.custom_location || "Chưa có thông tin địa điểm"}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <Camera className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Loại chụp</h3>
                    <p className="text-muted-foreground">{translateShootingType(booking.shooting_type)}</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Concept</h3>
                    <p className="text-muted-foreground">{booking.concept}</p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Service Information */}
              <div>
                <h3 className="font-medium text-lg mb-4">Thông tin dịch vụ</h3>
                <div className="flex items-center justify-between bg-muted/50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 p-2 rounded-full">
                      <Package className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">{service?.title || "Đang tải thông tin dịch vụ..."}</p>
                      <p className="text-sm text-muted-foreground">Số lượng: {booking.quantity || 1}</p>
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setIsServiceDialogOpen(true)}
                    disabled={!service}
                  >
                    <span className="flex items-center gap-1">
                      Xem dịch vụ
                      <ExternalLink className="h-3.5 w-3.5 ml-1" />
                    </span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Thông tin thanh toán</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Giá dịch vụ</span>
                {/* <span>{booking.total_price > 0 ? `${booking.total_price.toLocaleString()} VND` : "Liên hệ"}</span> */}
                <span>{service?.price.toLocaleString()} VND</span>
              </div>
              {booking.discount_code && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Mã giảm giá</span>
                  <span className="font-medium text-green-600">{booking.discount_code}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Tổng cộng</span>
                <span>{booking.total_price > 0 ? `${booking.total_price.toLocaleString()} VND` : "Liên hệ"}</span>
              </div>
              <div className="text-xs text-muted-foreground">* Giá cuối cùng sẽ được xác nhận bởi nhiếp ảnh gia</div>
            </CardContent>
            <CardFooter className="flex-col space-y-2">
              {/* <Button className="w-full" asChild>
                <Link href={`/chat/${booking.photographer_id}`}>
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Nhắn tin với nhiếp ảnh gia
                </Link>
              </Button> */}

                <Button
                  variant="outline"
                  className="w-full hover:text-accent-foreground"
                  onClick={() => handlePayment(booking.booking_code)}
                >
                  💸Thanh toán
                </Button>
                
              {/* {booking.status === "accepted" && (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => setIsCancelDialogOpen(true)}
                >
                  Thanh toán
                </Button>
              )} */}
              {booking.status === "pending" && (
                <Button
                  variant="outline"
                  className="w-full text-destructive hover:text-destructive"
                  onClick={() => setIsCancelDialogOpen(true)}
                >
                  Hủy đặt lịch
                </Button>
              )}
            </CardFooter>
          </Card>

          {/* Booking Information */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Thông tin đặt lịch</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-2">
                <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Ngày tạo:</span>{" "}
                    {format(parseISO(booking.created_at), "dd/MM/yyyy HH:mm")}
                  </p>
                </div>
              </div>
              {/* <div className="flex items-start gap-2">
                <User className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Mã khách hàng:</span> #{booking.customer_id}
                  </p>
                </div>
              </div> */}
              <div className="flex items-start gap-2">
                <Camera className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Nhiếp ảnh gia:</span>{" "}
                    {loading ? (
                      <span className="inline-block h-4 w-24 bg-muted animate-pulse rounded" />
                    ) : photographer ? (
                      <Link 
                        href={`/photographers/${photographer.slug}`}
                        className="hover:text-primary transition-colors"
                      >
                        {photographer.full_name}
                      </Link>
                    ) : (
                      "Không thể tải thông tin"
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Tag className="h-4 w-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-sm">
                    <span className="text-muted-foreground">Mã đặt lịch:</span> {booking.booking_code || "Chưa có"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Service Details Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle>Chi tiết dịch vụ</DialogTitle>
            <DialogDescription>
              Thông tin chi tiết về dịch vụ bạn đã đặt
            </DialogDescription>
          </DialogHeader>
          {service && (
            <div className="space-y-6 overflow-y-auto pr-2 -mr-2">
              {/* Service Image */}
              <div className="aspect-video w-full bg-muted rounded-md overflow-hidden">
                <img
                  src={service.thumbnail_url || "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1748164460/23101740_6725295_ru1wsv.jpg"}
                  alt={service.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Service Details */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-1">Tên dịch vụ</h3>
                  <p className="text-muted-foreground">{service.title}</p>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Mô tả</h3>
                  <p className="text-muted-foreground whitespace-pre-wrap">{service.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium mb-1">Giá dịch vụ</h3>
                    <p className="text-muted-foreground">
                      {service.price.toLocaleString()} VND
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Loại đơn vị</h3>
                    <p className="text-muted-foreground capitalize">
                      {service.unit_type === "package" ? "Gói" : service.unit_type}
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="font-medium mb-1">Thông tin khác</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
                    <div>
                      <p>Ngày tạo: {format(parseISO(service.created_at), "dd/MM/yyyy")}</p>
                      {service.updated_at && (
                        <p>Cập nhật: {format(parseISO(service.updated_at), "dd/MM/yyyy")}</p>
                      )}
                    </div>
                    <div>
                      <p>Trạng thái: {service.is_active ? "Đang hoạt động" : "Không hoạt động"}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="mt-4 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
              Đóng
            </Button>
            {/* {service && (
              <Button asChild>
                <Link href={`/photographers/${photographer?.slug}/services/${service.service_id}`}>
                  Xem chi tiết trên trang nhiếp ảnh gia
                </Link>
              </Button>
            )} */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Cancel Dialog */}
      <Dialog open={isCancelDialogOpen} onOpenChange={setIsCancelDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hủy đặt lịch</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn hủy đặt lịch này? Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <label htmlFor="reason" className="text-sm font-medium">
                Lý do hủy (không bắt buộc)
              </label>
              <Textarea
                id="reason"
                placeholder="Nhập lý do hủy đặt lịch..."
                value={cancelReason}
                onChange={(e) => setCancelReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCancelDialogOpen(false)}>
              Hủy bỏ
            </Button>
            <Button variant="destructive" onClick={handleCancelBooking}>
              Xác nhận hủy
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}