"use client"

import { useEffect, useState, use } from "react"
import { getBookingByCode, BookingResponse, uploadPhotoStorageLink, updateBookingStatus } from "@/services/booking.service"
import { userService, UserProfileResponse } from "@/services/user.service"
import { getServiceByIdPublic, Service } from "@/services/services.service"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, ArrowLeft, CreditCard, User, MapPinned, Package, SquarePercent  } from "lucide-react"
import Image from "next/image"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useRouter } from "next/navigation"
import { Skeleton } from "@/components/ui/skeleton"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import toast, { Toaster } from "react-hot-toast"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export default function BookingDetailPage({ params }: { params: Promise<{ code: string }> }) {
  const { code } = use(params)
  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [customer, setCustomer] = useState<UserProfileResponse | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [photoStorageLink, setPhotoStorageLink] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [isCompleting, setIsCompleting] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [showServiceDialog, setShowServiceDialog] = useState(false)
  const [loading, setLoading] = useState(true)
  const [userLoading, setUserLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBookingAndUsers = async () => {
      try {
        const bookingData = await getBookingByCode(code)
        setBooking(bookingData)
        
        // Fetch user and service information
        const [customerData, serviceData] = await Promise.all([
          userService.getUserById(bookingData.customer_id),
          getServiceByIdPublic(bookingData.service_id)
        ])
        setCustomer(customerData)
        setService(serviceData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
        setUserLoading(false)
      }
    }

    fetchBookingAndUsers()
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

  const handleCompleteSession = async () => {
    if (!booking) return
    
    try {
      setIsCompleting(true)
      await updateBookingStatus(booking.booking_id, "completed")
      toast.success("Đã xác nhận hoàn thành buổi chụp")
      // Refresh booking data
      const updatedBooking = await getBookingByCode(code)
      setBooking(updatedBooking)
      setShowCompleteDialog(false)
    } catch (error) {
      console.error("Error completing session:", error)
      toast.error("Có lỗi xảy ra khi xác nhận hoàn thành")
    } finally {
      setIsCompleting(false)
    }
  }

  const handleUploadPhotoStorageLink = async () => {
    if (!booking || !photoStorageLink) return
    
    try {
      setIsUploading(true)
      await uploadPhotoStorageLink(booking.booking_id, photoStorageLink)
      toast.success("Đã lưu đường dẫn")
      // Refresh booking data
      const updatedBooking = await getBookingByCode(code)
      setBooking(updatedBooking)
      setPhotoStorageLink("")
    } catch (error) {
      console.error("Error uploading photo storage link:", error)
      toast.error("Có lỗi xảy ra khi lưu đường dẫn")
    } finally {
      setIsUploading(false)
    }
  }

  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Skeleton className="h-8 w-48 mb-8" />
        <div className="grid gap-6">
          <Skeleton className="h-[200px] w-full rounded-xl" />
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
          <Button onClick={() => router.push("/manage/bookings")}>
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
        onClick={() => router.push("/manage/bookings")}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Quay lại danh sách
      </Button>

      <div className="grid gap-6">
        <Card>
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

            {booking.illustration_url && (
              <div className="relative w-full h-[300px] bg-muted/30 rounded-lg overflow-hidden mb-6">
                <Image
                  src={booking.illustration_url}
                  alt={booking.concept}
                  fill
                  className="object-cover"
                />
              </div>
            )}

            <div className="grid gap-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Ngày chụp: {format(new Date(booking.booking_date), "EEEE, dd/MM/yyyy", { locale: vi })}</span>
                  </div>
                  {/* <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>{format(new Date(booking.booking_date), "HH:mm", { locale: vi })}</span>
                  </div> */}
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPinned className="h-4 w-4 mt-0.5" />
                    <span>Tỉnh/Thành phố: {booking.province}</span>
                  </div>
                  <div className="flex items-start gap-2 text-muted-foreground">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <span>Địa điểm: {booking.custom_location || "Chưa xác định địa điểm"}</span>
                  </div>

                  <div className="flex items-start gap-2 text-muted-foreground">
                    <Package className="h-4 w-4 mt-0.5" />
                    <div className="flex flex-col">
                      <span>Gói dịch vụ: {service?.title || "Đang tải..."}</span>
                      {service && (
                        <div className="mt-1">
                          <span className="text-sm">
                            Giá gốc: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)}
                          </span>
                          {/* {booking.total_price < service.price && (
                            <span className="text-sm text-green-600 ml-2">
                              (Giảm {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price - booking.total_price)})
                            </span>
                          )} */}
                        </div>
                      )}

                      {service && booking.total_price < service.price && (
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center text-sm text-green-600">
                            <SquarePercent className="h-4 w-4 mr-1" />
                            <span>Mã giảm giá: {booking.discount_code}</span>
                          </div>
                          <div className="text-sm text-green-600">
                            Giảm ({new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price - booking.total_price)} so với giá gốc)
                          </div>
                        </div>
                      )}

                      
                      <Button 
                        variant="link" 
                        className="p-0 h-auto text-sm"
                        onClick={() => setShowServiceDialog(true)}
                      >
                        Xem chi tiết
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
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
                    <p className="font-medium">{booking.quantity}</p>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin người dùng</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">Khách hàng:</span>
                    </div>
                    {userLoading ? (
                      <Skeleton className="h-6 w-48" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <Avatar>
                          <AvatarImage src={customer?.avatar} />
                          <AvatarFallback>{customer?.full_name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <p className="font-medium">{customer?.full_name}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold mb-4">Thông tin thanh toán</h3>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="flex items-center gap-2">
                    <CreditCard className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Tổng tiền:</span>
                    <span className="font-medium">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                        booking.total_price
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">Ngày đặt:</span>
                    <span className="font-medium">
                      {format(new Date(booking.created_at), "dd/MM/yyyy", { locale: vi })}
                    </span>
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

              {booking.status === "confirmed" && 
               (booking.payment_status === "fully_paid" || booking.payment_status === "deposit_paid") && (
                <div className="flex gap-3 mt-4">
                  <Button 
                    onClick={() => setShowCompleteDialog(true)}
                    variant="default"
                  >
                    Xác nhận đã hoàn thành buổi chụp hình
                  </Button>
                </div>
              )}

              {booking.status === "completed" && 
               (booking.payment_status === "fully_paid" || booking.payment_status === "deposit_paid") && (
                <div className="border-t pt-6">
                  <h3 className="text-lg font-semibold mb-4">Nhập đường dẫn upload ảnh</h3>
                  <div className="flex gap-3">
                    <input
                      type="text"
                      value={photoStorageLink}
                      onChange={(e) => setPhotoStorageLink(e.target.value)}
                      placeholder="Nhập đường dẫn lưu trữ ảnh"
                      className="flex-1 px-3 py-2 border rounded-md"
                    />
                    <Button 
                      onClick={handleUploadPhotoStorageLink}
                      disabled={isUploading || !photoStorageLink}
                    >
                      {isUploading ? "Đang lưu..." : "Lưu đường dẫn"}
                    </Button>
                  </div>
                  {booking.photo_storage_link && (
                    <p className="mt-2 text-sm text-muted-foreground">
                      Đường dẫn hiện tại: {booking.photo_storage_link}
                    </p>
                  )}
                </div>
              )}

              {booking.status === "accepted" && (
                <div className="flex gap-3 mt-4">
                  <Button variant="default">
                    Nhắc nhở thanh toán
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={showCompleteDialog} onOpenChange={setShowCompleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận hoàn thành buổi chụp</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xác nhận đã hoàn thành buổi chụp hình này không?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowCompleteDialog(false)}
              disabled={isCompleting}
            >
              Hủy
            </Button>
            <Button
              onClick={handleCompleteSession}
              disabled={isCompleting}
            >
              {isCompleting ? "Đang xác nhận..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showServiceDialog} onOpenChange={setShowServiceDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Chi tiết gói dịch vụ</DialogTitle>
          </DialogHeader>
          {service && (
            <div className="space-y-4">
              {service.thumbnail_url && (
                <div className="relative w-full h-[300px] bg-muted/30 rounded-lg overflow-hidden">
                  <Image
                    src={service.thumbnail_url}
                    alt={service.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div>
                <h3 className="text-lg font-semibold">{service.title}</h3>
                <p className="text-muted-foreground mt-2">{service.description}</p>
                <div className="mt-4">
                  <p className="font-medium">
                    Giá: {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)}
                  </p>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button onClick={() => setShowServiceDialog(false)}>Đóng</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Toaster position="bottom-right"/>
    </div>
  )
} 