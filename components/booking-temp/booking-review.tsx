"use client"

import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { CalendarIcon, Camera, Home, MapPin, Package } from "lucide-react"
import Image from "next/image"
import type { BookingFormData } from "@/services/booking.service"

interface BookingReviewProps {
  formData: BookingFormData
  prevStep: () => void
  handleSubmit: () => void
}

export function BookingReview({ formData, prevStep, handleSubmit }: BookingReviewProps) {
  // Giả lập dữ liệu gói dịch vụ
  const packageDetails = {
    basic: {
      name: "Gói Cơ Bản",
      price: 1500000,
    },
    standard: {
      name: "Gói Tiêu Chuẩn",
      price: 2500000,
    },
    premium: {
      name: "Gói Cao Cấp",
      price: 4000000,
    },
  }

  // Giả lập dữ liệu dịch vụ
  const serviceDetails = {
    "1": "Gói 1: Chụp ảnh Hội An",
    "2": "Gói 2: Chụp Chill Chill 3",
    "3": "Gói 3: Chụp ảnh cưới",
    "4": "Gói 4: Chụp ảnh gia đình",
  }

  const selectedPackage = formData.package ? packageDetails[formData.package as keyof typeof packageDetails] : null
  const selectedService = formData.service ? serviceDetails[formData.service as keyof typeof serviceDetails] : null

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
              <p>{formData.date ? format(formData.date, "EEEE, dd MMMM yyyy", { locale: vi }) : "Chưa chọn"}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start">
            <Camera className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium">Dịch vụ</h3>
              <p>{selectedService || "Chưa chọn"}</p>
            </div>
          </div>

          <Separator />

          <div className="flex items-start">
            {formData.shootingType === "studio" ? (
              <Home className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            ) : (
              <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            )}
            <div>
              <h3 className="font-medium">Loại chụp & Địa điểm</h3>
              <p>
                {formData.shootingType === "studio" ? "Studio" : "Outdoor"} - {formData.location}
                {formData.locationDetails && ` (${formData.locationDetails})`}
              </p>
              {formData.locationNotes && <p className="text-sm text-muted-foreground mt-1">{formData.locationNotes}</p>}
            </div>
          </div>

          <Separator />

          <div className="flex items-start">
            <Package className="h-5 w-5 mr-3 mt-0.5 text-primary" />
            <div>
              <h3 className="font-medium">Gói dịch vụ</h3>
              <p>
                {selectedPackage ? (
                  <>
                    {selectedPackage.name} -{" "}
                    {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
                      selectedPackage.price,
                    )}
                  </>
                ) : (
                  "Chưa chọn"
                )}
              </p>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="font-medium mb-2">Concept</h3>
            <p className="text-sm">{formData.concept || "Không có"}</p>
          </div>

          {formData.illustrations && formData.illustrations.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-medium mb-2">Hình ảnh minh họa</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {formData.illustrations.map((url: string, index: number) => (
                    <div key={index} className="aspect-square rounded-md overflow-hidden border">
                      <Image
                        src={url || "/placeholder.svg"}
                        alt={`Illustration ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Quay lại
        </Button>
        <Button onClick={handleSubmit}>Xác nhận đặt lịch</Button>
      </CardFooter>
    </>
  )
}
