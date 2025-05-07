"use client"

import type React from "react"

import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { MapPin } from "lucide-react"
import type { BookingFormData } from "@/services/booking.service"

interface BookingStep3Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export function BookingStep3({ formData, updateFormData, nextStep, prevStep }: BookingStep3Props) {
  // Nếu là studio, chuyển thẳng sang bước tiếp theo
  if (formData.shootingType === "studio") {
    nextStep()
    return null
  }

  const handleCustomLocationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFormData({ location: e.target.value })
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Chi tiết địa điểm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="p-4 bg-muted rounded-md flex items-start">
          <MapPin className="h-5 w-5 mr-2 mt-0.5 text-primary" />
          <div>
            <p className="font-medium">Địa điểm đã chọn: {formData.location}</p>
            <p className="text-sm text-muted-foreground mt-1">
              Vui lòng cung cấp thêm thông tin chi tiết về địa điểm chụp (nếu cần)
            </p>
          </div>
        </div>

        {formData.location === "Khác" && (
          <div className="space-y-3">
            <Label htmlFor="customLocation">Địa điểm cụ thể</Label>
            <Input
              id="customLocation"
              placeholder="Nhập địa điểm cụ thể"
              value={formData.customLocation || ""}
              onChange={handleCustomLocationChange}
            />
          </div>
        )}

        <div className="space-y-3">
          <Label htmlFor="locationDetails">Chi tiết địa điểm</Label>
          <Input
            id="locationDetails"
            placeholder="Ví dụ: Phố cổ Hội An, Cầu Ánh Sao, v.v."
            value={formData.locationDetails || ""}
            onChange={(e) => updateFormData({ locationDetails: e.target.value })}
          />
        </div>

        <div className="space-y-3">
          <Label htmlFor="locationNotes">Ghi chú về địa điểm</Label>
          <Input
            id="locationNotes"
            placeholder="Các yêu cầu đặc biệt về địa điểm"
            value={formData.locationNotes || ""}
            onChange={(e) => updateFormData({ locationNotes: e.target.value })}
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Quay lại
        </Button>
        <Button onClick={nextStep}>Tiếp theo</Button>
      </CardFooter>
    </>
  )
}
