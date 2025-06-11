"use client"

import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Loader2, MapPin, Star, Users, ArrowRight } from "lucide-react"
import toast, { Toaster, ToastBar } from "react-hot-toast"
import { photographerService, type Photographer } from "@/services/photographer.service"
import { useRouter } from "next/navigation"
import Image from "next/image"

interface DateSelectionProps {
  selectedDate: Date | null
  onDateSelect: (date: Date) => void
  nextStep: () => void
}

export function DateSelection({ selectedDate, onDateSelect, nextStep }: DateSelectionProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const router = useRouter()

  const fetchPhotographers = async (date: Date) => {
    try {
      setIsLoading(true)
      const formattedDate = format(date, "yyyy-MM-dd")
      const response = await photographerService.getPhotographersByDate(formattedDate, 0, 100)
      setPhotographers(response.photographers)
    } catch (error) {
      console.error("Error fetching photographers:", error)
      toast.error("Không thể tải danh sách nhiếp ảnh gia. Vui lòng thử lại sau.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      onDateSelect(date)
      fetchPhotographers(date)
    }
  }

  const handlePhotographerSelect = (photographer: Photographer) => {
    router.push(`/photographers/${photographer.slug}`)
  }

  return (
    <div className="min-h-screen bg-card/80">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Chọn ngày chụp ảnh</h1>
          <p className="text-lg text-muted-foreground">Tìm nhiếp ảnh gia phù hợp cho ngày bạn mong muốn</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto bg-card/80">
          {/* Calendar Section */}
          <Card className="shadow-xl border border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold text-card-foreground flex items-center gap-2">
                <CalendarIcon className="h-6 w-6 text-primary" />
                Chọn ngày
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center ">
                <Calendar
                  mode="single"
                  selected={selectedDate || undefined}
                  onSelect={handleDateSelect}
                  className="rounded-md border border-border shadow-sm bg-background"
                  initialFocus
                />
              </div>

              {selectedDate && (
                <div className="mt-6 p-4 bg-accent/10 rounded-xl border border-accent/20">
                  <div className="flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-sm text-muted-foreground mb-1">Ngày đã chọn</p>
                      <p className="text-xl font-semibold text-foreground">
                        {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Photographers Section */}
          <Card className="shadow-xl border border-border bg-card/80 backdrop-blur-sm">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold text-card-foreground flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Nhiếp ảnh gia có sẵn
                {photographers.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-accent/20 text-accent-foreground">
                    {photographers.length} người
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="max-h-[600px] overflow-y-auto custom-scrollbar">
              {!selectedDate ? (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <CalendarIcon className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Chọn ngày để xem nhiếp ảnh gia</h3>
                  <p className="text-muted-foreground">Vui lòng chọn ngày chụp ảnh để xem danh sách nhiếp ảnh gia có sẵn</p>
                </div>
              ) : isLoading ? (
                <div className="flex flex-col items-center justify-center h-64">
                  <Loader2 className="w-12 h-12 animate-spin text-primary mb-4" />
                  <p className="text-muted-foreground">Đang tìm kiếm nhiếp ảnh gia...</p>
                </div>
              ) : photographers.length > 0 ? (
                <div className="space-y-4">
                  {photographers.map((photographer) => (
                    <div
                      key={photographer.photographer_id}
                      className="group border border-border rounded-xl p-4 hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer bg-card/50 hover:bg-card"
                      onClick={() => handlePhotographerSelect(photographer)}
                    >
                      <div className="flex items-start space-x-4">
                        <div className="relative w-16 h-16 rounded-full overflow-hidden ring-2 ring-border group-hover:ring-primary/50 transition-all">
                          <Image
                            src={photographer.avatar || "/placeholder.svg?height=64&width=64"}
                            alt={photographer.full_name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between">
                            <div>
                              <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {photographer.full_name}
                              </h4>
                              <div className="flex items-center mt-1 text-sm text-muted-foreground">
                                <MapPin className="h-4 w-4 mr-1" />
                                <span>{photographer.province}</span>
                              </div>
                              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">{photographer.address_detail}</p>
                            </div>
                            <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>

                          <div className="flex items-center justify-between mt-3">
                            <div className="flex items-center">
                              <div className="flex items-center bg-accent/10 px-2 py-1 rounded-full">
                                <Star className="h-4 w-4 text-accent fill-current" />
                                <span className="ml-1 text-sm font-medium text-accent-foreground">
                                  {photographer.average_rating}
                                </span>
                              </div>
                              <span className="ml-2 text-sm text-muted-foreground">
                                ({photographer.total_reviews} đánh giá)
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-center">
                  <Users className="h-16 w-16 text-muted-foreground/30 mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">Không có nhiếp ảnh gia</h3>
                  <p className="text-muted-foreground">Không có nhiếp ảnh gia nào có sẵn trong ngày đã chọn</p>
                  <p className="text-sm text-muted-foreground/70 mt-1">Vui lòng chọn ngày khác</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Button */}
        <div className="flex justify-center mt-8">
          <Button
            onClick={nextStep}
            disabled={!selectedDate || isLoading}
            size="lg"
            className="px-8 py-3 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Đang tải...
              </>
            ) : (
              <>
                Tiếp theo
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "var(--card)",
            color: "var(--card-foreground)",
            boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
          },
        }}
      >
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button onClick={() => toast.dismiss(t.id)} className="ml-2 text-muted-foreground hover:text-foreground">
                    ×
                  </button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  )
}