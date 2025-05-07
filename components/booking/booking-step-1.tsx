"use client"

import { useState, useEffect } from "react"
import { format, isSameDay, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Loader2 } from "lucide-react"
import { getMockAvailabilities } from "@/services/availability.service"
import type { BookingFormData } from "@/services/booking.service"
import type { Availability } from "@/services/availability.service"
import { useToast } from "@/hooks/use-toast"

interface BookingStep1Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  nextStep: () => void
}

export function BookingStep1({ formData, updateFormData, nextStep }: BookingStep1Props) {
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  useEffect(() => {
    const fetchAvailabilities = async () => {
      try {
        setIsLoading(true)
        const data = await getMockAvailabilities()
        setAvailabilities(data)
      } catch (error) {
        console.error("Error fetching availabilities:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải lịch làm việc. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailabilities()
  }, [toast])

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const isAvailable = availabilities.some(
        (availability) => isSameDay(parseISO(availability.available_date), date) && availability.status === "available",
      )

      if (isAvailable) {
        console.log('Selected date:', date)
        updateFormData({ booking_date: date.toISOString() })
      } else {
        toast({
          title: "Không khả dụng",
          description: "Ngày này không có sẵn để đặt lịch.",
          variant: "destructive",
        })
      }
    } else {
      updateFormData({ booking_date: new Date().toISOString() })
    }
  }

  // Tùy chỉnh hiển thị ngày trong calendar
//   const dayClassName = (date: Date) => {
//     const availability = availabilities.find((a) => isSameDay(parseISO(a.available_date), date))

//     if (!availability) return ""

//     if (availability.status === "available") {
//       return "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 font-medium"
//     }

//     if (availability.status === "booked") {
//       return "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 line-through opacity-70"
//     }

//     return ""
//   }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Chọn ngày chụp</CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-4">
            {/* <Calendar
              mode="single"
              selected={formData.date}
              onSelect={handleDateSelect}
              className="rounded-md border mx-auto"
              modifiers={{
                available: (date) =>
                  availabilities.some((a) => isSameDay(parseISO(a.available_date), date) && a.status === "available"),
                booked: (date) =>
                  availabilities.some((a) => isSameDay(parseISO(a.available_date), date) && a.status === "booked"),
              }}
              modifiersClassNames={{
                available: "available-day",
                booked: "booked-day",
              }}
              components={{
                Day: ({ date, ...props }) => {
                  const isAvailable = availabilities.some(
                    (a) => isSameDay(parseISO(a.available_date), date) && a.status === "available",
                  )
                  const isBooked = availabilities.some(
                    (a) => isSameDay(parseISO(a.available_date), date) && a.status === "booked",
                  )

                  return (
                    <div
                      {...props}
                      className={`${props.className} ${isAvailable ? dayClassName(date) : ""} ${
                        isBooked ? dayClassName(date) : ""
                      }`}
                    >
                      {date.getDate()}
                    </div>
                  )
                },
              }}
            /> */}
            <Calendar
                mode="single"
                selected={formData.booking_date ? new Date(formData.booking_date) : undefined}
                onSelect={handleDateSelect}
                month={formData.booking_date ? new Date(formData.booking_date) : undefined}
                className="rounded-md border"
                modifiers={{
                  available: (date) =>
                    availabilities.some((a) => isSameDay(parseISO(a.available_date), date) && a.status === "available"),
                  booked: (date) =>
                    availabilities.some((a) => isSameDay(parseISO(a.available_date), date) && a.status === "booked"),
                }}
                modifiersClassNames={{
                  available: "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 font-medium",
                  booked: "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 line-through opacity-70",
                }}
              />

            <div className="flex items-center justify-center space-x-8 mt-6">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
                <span className="text-sm">Có sẵn</span>
              </div>
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
                <span className="text-sm">Đã đặt</span>
              </div>
            </div>

            {formData.booking_date && (
              <div className="mt-4 p-4 bg-muted rounded-md">
                <div className="flex items-center">
                  <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                  <span className="font-medium">Ngày đã chọn:</span>
                  <span className="ml-2">{format(new Date(formData.booking_date), "EEEE, dd MMMM yyyy", { locale: vi })}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <div></div>
        <Button onClick={nextStep} disabled={!formData.booking_date || isLoading}>
          Tiếp theo
        </Button>
      </CardFooter>
    </>
  )
}
