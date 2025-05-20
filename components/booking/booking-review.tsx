"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Camera, Home, MapPin, Loader2, Tag, Percent } from "lucide-react"
import { Input } from "@/components/ui/input"
import type { BookingFormData } from "@/services/booking.service"
import type { Service } from "@/services/services.service"
import { getServiceByIdPublic } from "@/services/services.service"
import { DiscountCarousel } from "./discount-carousel"
import { getSavedDiscounts, type SavedDiscount } from "@/services/discount.service"
import toast, {ToastBar,Toaster } from "react-hot-toast"

interface BookingReviewProps {
  formData: BookingFormData
  prevStep: () => void
  handleSubmit: () => void
  isSubmitting: boolean
  updateFormData: (data: Partial<BookingFormData>) => void
}

export function BookingReview({ formData, prevStep, handleSubmit, isSubmitting, updateFormData }: BookingReviewProps) {
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [discountCode, setDiscountCode] = useState(formData.discount_code || "")
  const [selectedDiscount, setSelectedDiscount] = useState<SavedDiscount | null>(null)
  const [isLoadingDiscount, setIsLoadingDiscount] = useState(false)

  useEffect(() => {
    const fetchService = async () => {
      if (formData.service_id) {
        try {
          setIsLoading(true)
          const data = await getServiceByIdPublic(formData.service_id)
          setService(data)
        } catch (error) {
          console.error("Error fetching service:", error)
        } finally {
          setIsLoading(false)
        }
      }
    }

    fetchService()
  }, [formData.service_id])

  const basePrice = service ? service.price * (formData.quantity || 1) : 0
  const discountAmount = selectedDiscount ? calculateDiscountAmount(basePrice, selectedDiscount.discount) : 0
  const totalPrice = basePrice - discountAmount

  function calculateDiscountAmount(price: number, discount: SavedDiscount["discount"]) {
    if (discount.discount_type === "percent") {
      return (price * discount.value) / 100
    } else {
      return discount.value
    }
  }

  const handleDiscountCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value
    setDiscountCode(code)
    setSelectedDiscount(null)
    updateFormData({
      discount_code: code,
      total_price: basePrice
    })
  }

  const handleSelectDiscount = async (code: string) => {
    try {
      setIsLoadingDiscount(true)
      const response = await getSavedDiscounts()
      const discount = response.user_discounts.find(d => d.discount.code === code)
      
      if (discount) {
        if (service && discount.photographer_id !== service.photographer_id) {
          toast.error("Mã giảm giá này không áp dụng cho dịch vụ của nhiếp ảnh gia này")
          return
        }

        setSelectedDiscount(discount)
        setDiscountCode(code)
        const newTotalPrice = basePrice - calculateDiscountAmount(basePrice, discount.discount)
        updateFormData({
          discount_code: code,
          total_price: newTotalPrice
        })
      } else {
        toast.error("Không tìm thấy mã giảm giá")
      }
    } catch (error) {
      console.error("Error applying discount:", error)
      toast.error("Không thể áp dụng mã giảm giá")
    } finally {
      setIsLoadingDiscount(false)
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Xác nhận thông tin đặt lịch</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-start">
            <CalendarIcon className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium">Ngày chụp</h3>
              <p>{format(new Date(formData.booking_date), "EEEE, dd MMMM yyyy", { locale: vi })}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start">
            <Camera className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium">Dịch vụ</h3>
              {isLoading ? (
                <p>Đang tải...</p>
              ) : (
                <>
                  <p>{service?.title}</p>
                  {formData.quantity > 1 && (
                    <p className="text-sm text-muted-foreground">Số lượng: {formData.quantity} người</p>
                  )}
                </>
              )}
            </div>
          </div>

          <Separator />

          <div className="flex items-start">
            {formData.shooting_type === "studio" ? (
              <Home className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            ) : (
              <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            )}
            <div>
              <h3 className="font-medium">Loại chụp & Địa điểm</h3>
              <p>
                {formData.shooting_type === "studio" ? "Studio" : "Outdoor"} - {formData.custom_location}
              </p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start">
            <Tag className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            <div className="w-full space-y-4">
              <h3 className="font-medium">Mã giảm giá</h3>
              <DiscountCarousel 
                onSelectDiscount={handleSelectDiscount} 
                selectedCode={discountCode}
                photographerId={service?.photographer_id}
              />
              <div className="flex gap-2">
                <Input
                  placeholder="Nhập mã giảm giá khác"
                  value={discountCode}
                  onChange={handleDiscountCodeChange}
                  className="max-w-[200px]"
                />
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => handleSelectDiscount(discountCode)}
                  disabled={isLoadingDiscount}
                >
                  {isLoadingDiscount ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang áp dụng...
                    </>
                  ) : (
                    "Áp dụng"
                  )}
                </Button>
              </div>
            </div>
          </div>

          <Separator />

          {service && (
            <div className="flex items-start">
              <div className="w-full space-y-2">
                <h3 className="font-medium">Tổng tiền</h3>
                <div className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Giá gốc:</span>
                    <span>{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(basePrice)}</span>
                  </div>
                  {selectedDiscount && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span className="flex items-center gap-1">
                        <Percent className="h-3 w-3" />
                        Giảm giá:
                      </span>
                      <span>-{new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(discountAmount)}</span>
                    </div>
                  )}
                  <Separator className="my-2" />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Thành tiền:</span>
                    <span className="text-primary">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  ({new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)} x {formData.quantity} người)
                </p>
              </div>
            </div>
          )}

          <Separator />

          {formData.concept && (
            <div>
              <h3 className="font-medium mb-2">Concept</h3>
              <p className="text-sm">{formData.concept}</p>
            </div>
          )}

          {formData.illustration_url && (
            <div className="mt-4">
              <h3 className="font-medium mb-2">Hình ảnh tham khảo</h3>
              <div className="relative aspect-video rounded-lg overflow-hidden">
                <img
                  src={formData.illustration_url}
                  alt="Concept illustration"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}

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
      </CardContent>
      <CardFooter className="flex justify-between mt-4">
        <Button variant="outline" onClick={prevStep}>
          Quay lại
        </Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Đang xử lý...
            </>
          ) : (
            "Xác nhận đặt lịch"
          )}
        </Button>
      </CardFooter>
    </>
  )
}
