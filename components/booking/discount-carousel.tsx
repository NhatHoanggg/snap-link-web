"use client"

import { useEffect, useState } from "react"
import { format, parseISO, isAfter } from "date-fns"
import { vi } from "date-fns/locale"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Percent, Tag, Clock, Loader2 } from "lucide-react"
import useEmblaCarousel from "embla-carousel-react"
import { getSavedDiscounts, type SavedDiscount } from "@/services/discount.service"
// import { useToast } from "@/hooks/use-toast"
import toast, {ToastBar,Toaster } from "react-hot-toast"

interface DiscountCarouselProps {
  onSelectDiscount: (code: string) => void
  selectedCode?: string
  photographerId?: number
}

export function DiscountCarousel({ onSelectDiscount, selectedCode, photographerId }: DiscountCarouselProps) {
  const [discounts, setDiscounts] = useState<SavedDiscount[]>([])
  const [loading, setLoading] = useState(true)
  const [emblaRef] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  })

  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        setLoading(true)
        const response = await getSavedDiscounts()
        // Filter only active discounts and from current photographer
        const activeDiscounts = response.user_discounts.filter((discount) => {
          const now = new Date()
          const validTo = new Date(discount.discount.valid_to)
          const isActive = !discount.times_used && !isAfter(now, validTo)
          const isFromPhotographer = photographerId ? discount.photographer_id === photographerId : true
          return isActive && isFromPhotographer
        })
        setDiscounts(activeDiscounts)
      } catch (error) {
        console.error("Failed to fetch discounts:", error)
        toast.error("Không thể tải danh sách mã giảm giá")
      } finally {
        setLoading(false)
      }
    }

    loadDiscounts()
  }, [toast, photographerId])

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (discounts.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex gap-4 pb-4">
          {discounts.map((savedDiscount) => {
            const discount = savedDiscount.discount
            const isSelected = selectedCode === discount.code

            return (
              <Card
                key={savedDiscount.id}
                className={`flex-none w-[280px] cursor-pointer transition-all hover:shadow-md ${
                  isSelected ? "border-primary" : ""
                }`}
                onClick={() => onSelectDiscount(discount.code)}
              >
                <div className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant={isSelected ? "default" : "secondary"}>
                      {discount.discount_type === "percent" ? "Phần trăm" : "Cố định"}
                    </Badge>

                    <Badge variant="outline">
                      {/* {discount.code} */}
                      <p className="text-xs font-normal">{discount.code}</p>
                    </Badge>

                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>
                        {format(parseISO(discount.valid_to), "dd/MM", { locale: vi })}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div
                      className={`p-2 rounded-md ${
                        discount.discount_type === "percent"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }`}
                    >
                      {discount.discount_type === "percent" ? (
                        <Percent className="h-5 w-5" />
                      ) : (
                        <Tag className="h-5 w-5" />
                      )}
                    </div>
                    <div>
                      <p className="text-sm font-medium">Giá trị</p>
                      <p className="text-xl font-bold">
                        {discount.discount_type === "fixed"
                          ? `${discount.value.toLocaleString()} VND`
                          : `${discount.value}%`}
                      </p>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{discount.description}</p>

                  <Button
                    variant={isSelected ? "default" : "outline"}
                    className="w-full"
                    size="sm"
                  >
                    {isSelected ? "Đã chọn" : "Chọn mã"}
                  </Button>
                </div>
              </Card>
            )
          })}
        </div>
      </div>
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
  )
} 