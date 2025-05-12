"use client"

import { useEffect, useState } from "react"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BookingFormData } from "@/services/booking.service"
import type { Service } from "@/services/services.service"
import { getPhotographerServicesBySlug } from "@/services/services.service"
import { useToast } from "@/hooks/use-toast"
import { useParams } from "next/navigation"

interface BookingStep3Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export function BookingStep3({ formData, updateFormData, nextStep, prevStep }: BookingStep3Props) {
  const [services, setServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()
  const params = useParams()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setIsLoading(true)
        const data = await getPhotographerServicesBySlug(params.slug as string)
        setServices(Array.isArray(data) ? data : [data])
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
  }, [params.slug, toast])

  const selectedService = services.find(service => service.service_id === formData.service_id)

  const isNextDisabled = !formData.service_id || (selectedService?.unit_type === "person" && !formData.quantity)

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Chọn dịch vụ</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <RadioGroup
              value={formData.service_id?.toString()}
              onValueChange={(value) => updateFormData({ service_id: parseInt(value) })}
              className="space-y-4"
            >
              {services.map((service) => (
                <div key={service.service_id} className="relative">
                  <RadioGroupItem value={service.service_id.toString()} id={service.service_id.toString()} className="peer sr-only" />
                  <Label
                    htmlFor={service.service_id.toString()}
                    className={cn(
                      "flex flex-col sm:flex-row items-start justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent",
                      "peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary",
                    )}
                  >
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <div className="text-lg font-semibold">{service.title}</div>
                        <div className="text-lg font-bold text-primary">
                          {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)}
                        </div>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground whitespace-pre-line break-words">{service.description}</p>
                    </div>
                  </Label>
                </div>
              ))}
            </RadioGroup>

            {selectedService?.unit_type === "person" && (
              <div className="space-y-3">
                <Label htmlFor="quantity">Số lượng người</Label>
                <Input
                  id="quantity"
                  type="number"
                  min="1"
                  value={formData.quantity}
                  onChange={(e) => updateFormData({ quantity: parseInt(e.target.value) })}
                  placeholder="Nhập số lượng người"
                  className="w-full"
                />
              </div>
            )}
          </>
        )}
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
