"use client"

import { useEffect, useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Camera, Home, MapPin } from "lucide-react"
import Image from "next/image"
import type { BookingFormData } from "@/services/booking.service"
import type { Service } from "@/services/services.service"
import { getServiceByIdPublic } from "@/services/services.service"

interface BookingReviewProps {
  formData: BookingFormData
  prevStep: () => void
  handleSubmit: () => void
}

export function BookingReview({ formData, prevStep, handleSubmit }: BookingReviewProps) {
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const totalPrice = service ? service.price * (formData.quantity || 1) : 0

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

          <div>
            <h3 className="font-medium mb-2">Concept</h3>
            <p className="text-sm">{formData.concept || "Không có"}</p>
          </div>

          {formData.illustration_url && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Hình ảnh minh họa</h3>
                <div className="relative w-48 h-48 rounded-md overflow-hidden border">
                  <Image
                    src={formData.illustration_url}
                    alt="Illustration"
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </>
          )}

          <Separator />

          <div className="flex items-start">
            <div className="w-full">
              <h3 className="font-medium">Tổng tiền</h3>
              <p className="text-lg font-bold text-primary">
                {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(totalPrice)}
              </p>
              {formData.quantity > 1 && (
                <p className="text-sm text-muted-foreground">
                  ({new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service?.price || 0)} x {formData.quantity} người)
                </p>
              )}
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep}>
          Quay lại
        </Button>
        <Button onClick={handleSubmit}>Xác nhận đặt lịch</Button>
      </CardFooter>
    </>
  )
}
