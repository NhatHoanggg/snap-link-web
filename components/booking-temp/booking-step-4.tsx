"use client"

import { useEffect, useState } from "react"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Check, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { BookingFormData, Package } from "@/services/booking.service"
import { useToast } from "@/hooks/use-toast"

interface BookingStep4Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export function BookingStep4({ formData, updateFormData, nextStep, prevStep }: BookingStep4Props) {
  const [packages, setPackages] = useState<Package[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setIsLoading(true)
        // Trong thực tế, bạn sẽ gọi API để lấy các gói dịch vụ dựa trên service đã chọn
        // const response = await fetch(`/api/services/${formData.service}/packages`)
        // const data = await response.json()

        // Dữ liệu mẫu
        const mockPackages: Package[] = [
          {
            id: "basic",
            name: "Gói Cơ Bản",
            price: 1500000,
            description: "2 giờ chụp, 20 ảnh đã chỉnh sửa, 5 ảnh in 15x21cm",
            features: ["2 giờ chụp", "20 ảnh đã chỉnh sửa", "5 ảnh in 15x21cm", "Trang điểm cơ bản"],
          },
          {
            id: "standard",
            name: "Gói Tiêu Chuẩn",
            price: 2500000,
            description: "4 giờ chụp, 40 ảnh đã chỉnh sửa, 10 ảnh in 15x21cm, 1 ảnh in 30x45cm",
            features: [
              "4 giờ chụp",
              "40 ảnh đã chỉnh sửa",
              "10 ảnh in 15x21cm",
              "1 ảnh in 30x45cm",
              "Trang điểm chuyên nghiệp",
              "Cho thuê 2 trang phục",
            ],
          },
          {
            id: "premium",
            name: "Gói Cao Cấp",
            price: 4000000,
            description: "Trọn ngày chụp, 60 ảnh đã chỉnh sửa, album ảnh cao cấp, video highlight",
            features: [
              "Trọn ngày chụp",
              "60 ảnh đã chỉnh sửa",
              "Album ảnh cao cấp",
              "Video highlight 3-5 phút",
              "Trang điểm chuyên nghiệp",
              "Cho thuê 4 trang phục",
              "Hỗ trợ di chuyển",
            ],
          },
        ]

        setPackages(mockPackages)
      } catch (error) {
        console.error("Error fetching packages:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách gói dịch vụ. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchPackages()
  }, [formData.service, toast])

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Chọn gói dịch vụ</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <RadioGroup
            value={formData.package}
            onValueChange={(value) => updateFormData({ package: value })}
            className="space-y-4"
          >
            {packages.map((pkg) => (
              <div key={pkg.id} className="relative">
                <RadioGroupItem value={pkg.id} id={pkg.id} className="peer sr-only" />
                <Label
                  htmlFor={pkg.id}
                  className={cn(
                    "flex flex-col sm:flex-row items-start justify-between rounded-lg border p-4 cursor-pointer hover:bg-accent",
                    "peer-data-[state=checked]:border-primary peer-data-[state=checked]:ring-1 peer-data-[state=checked]:ring-primary",
                  )}
                >
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div className="text-lg font-semibold">{pkg.name}</div>
                      <div className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(pkg.price)}
                      </div>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{pkg.description}</p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                      {pkg.features.map((feature: string, index: number) => (
                        <li key={index} className="flex items-center text-sm">
                          <Check className="mr-2 h-4 w-4 text-primary" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                </Label>
              </div>
            ))}
          </RadioGroup>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={prevStep}>
          Quay lại
        </Button>
        <Button onClick={nextStep} disabled={!formData.package || isLoading}>
          Tiếp theo
        </Button>
      </CardFooter>
    </>
  )
}
