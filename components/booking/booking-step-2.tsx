"use client"

import { useEffect, useState } from "react"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Camera, Home } from "lucide-react"
import { getMockServices } from "@/services/services.service"
import type { BookingFormData } from "@/services/booking.service"
import type { Service } from "@/services/services.service"
import { useToast } from "@/hooks/use-toast"

interface BookingStep2Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export function BookingStep2({ formData, updateFormData, nextStep, prevStep }: BookingStep2Props) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        const data = await getMockServices()
        setServices(data)
      } catch (error) {
        console.error("Error fetching services:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách dịch vụ. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchServices()
  }, [toast])

  const handleShootingTypeChange = (value: string) => {
    if (value === "studio") {
      updateFormData({ shootingType: value as "studio", location: "19 Đặng Huy Trứ" })
    } else {
      updateFormData({ shootingType: value as "outdoor", location: "" })
    }
  }

  const isNextDisabled =
    !formData.service || !formData.shootingType || (formData.shootingType === "studio" ? false : !formData.location)

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Chọn dịch vụ và loại chụp</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="service">Dịch vụ</Label>
          <Select
            value={formData.service}
            onValueChange={(value) => updateFormData({ service: value })}
            disabled={isLoading}
          >
            <SelectTrigger id="service">
              <SelectValue placeholder="Chọn dịch vụ" />
            </SelectTrigger>
            <SelectContent>
              {services.map((service) => (
                <SelectItem key={service.service_id} value={service.service_id.toString()}>
                  {service.title} -{" "}
                  {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-3">
          <Label>Loại chụp</Label>
          <RadioGroup
            value={formData.shootingType}
            onValueChange={handleShootingTypeChange}
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="studio"
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                formData.shootingType === "studio" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="studio" id="studio" className="sr-only" />
              <Home className="mb-3 h-6 w-6" />
              <span>Studio</span>
              <span className="text-xs text-muted-foreground mt-1">19 Đặng Huy Trứ</span>
            </Label>
            <Label
              htmlFor="outdoor"
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                formData.shootingType === "outdoor" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="outdoor" id="outdoor" className="sr-only" />
              <Camera className="mb-3 h-6 w-6" />
              <span>Outdoor</span>
              <span className="text-xs text-muted-foreground mt-1">Chọn địa điểm</span>
            </Label>
          </RadioGroup>
        </div>

        {formData.shootingType === "outdoor" && (
          <div className="space-y-3">
            <Label htmlFor="location">Địa điểm</Label>
            <Select value={formData.location} onValueChange={(value) => updateFormData({ location: value })}>
              <SelectTrigger id="location">
                <SelectValue placeholder="Chọn địa điểm" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Hội An">Hội An</SelectItem>
                <SelectItem value="Đà Nẵng">Đà Nẵng</SelectItem>
                <SelectItem value="Huế">Huế</SelectItem>
                <SelectItem value="Bà Nà Hills">Bà Nà Hills</SelectItem>
                <SelectItem value="Sơn Trà">Sơn Trà</SelectItem>
                <SelectItem value="Cầu Vàng">Cầu Vàng</SelectItem>
                <SelectItem value="Khác">Khác</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Quay lại
        </Button>
        <Button onClick={nextStep} disabled={isNextDisabled}>
          Tiếp theo
        </Button>
      </CardFooter>
    </>
  )
}
