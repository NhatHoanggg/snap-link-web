"use client"

import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Input } from "@/components/ui/input"
import { Camera, Home } from "lucide-react"
import type { BookingFormData } from "@/services/booking.service"
// import { useToast } from "@/hooks/use-toast"
import { Photographer } from "@/services/photographer.service"

interface BookingStep2Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  nextStep: () => void
  prevStep: () => void
  photographer: Photographer
}

export function BookingStep2({ formData, updateFormData, nextStep, prevStep, photographer }: BookingStep2Props) {
  // const { toast } = useToast()

  const handleShootingTypeChange = (value: string) => {
    if (value === "studio") {
      updateFormData({ 
        shooting_type: value as "studio", 
        custom_location: photographer?.address_detail || "19 Đặng Huy Trứ" 
      })
    } else {
      updateFormData({ 
        shooting_type: value as "outdoor", 
        custom_location: "" 
      })
    }
  }

  const isNextDisabled = !formData.shooting_type || !formData.custom_location

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Chọn loại chụp và địa điểm</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label>Loại chụp</Label>
          <RadioGroup
            value={formData.shooting_type}
            onValueChange={handleShootingTypeChange}
            className="grid grid-cols-2 gap-4"
          >
            <Label
              htmlFor="studio"
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                formData.shooting_type === "studio" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="studio" id="studio" className="sr-only" />
              <Home className="mb-3 h-6 w-6" />
              <span>Studio</span>
              <span className="text-xs text-muted-foreground mt-1">Studio chụp ảnh</span>
            </Label>
            <Label
              htmlFor="outdoor"
              className={`flex flex-col items-center justify-between rounded-md border-2 p-4 cursor-pointer hover:bg-accent ${
                formData.shooting_type === "outdoor" ? "border-primary" : "border-muted"
              }`}
            >
              <RadioGroupItem value="outdoor" id="outdoor" className="sr-only" />
              <Camera className="mb-3 h-6 w-6" />
              <span>Outdoor</span>
              <span className="text-xs text-muted-foreground mt-1">Chọn địa điểm</span>
            </Label>
          </RadioGroup>
        </div>

        <div className="space-y-3">
          <Label htmlFor="location">Địa điểm</Label>
          <Input
            id="location"
            value={formData.custom_location}
            onChange={(e) => updateFormData({ custom_location: e.target.value })}
            placeholder={formData.shooting_type === "studio" ? "Địa chỉ studio" : "Nhập địa điểm chụp"}
            readOnly={formData.shooting_type === "studio"}
            className="w-full"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
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
