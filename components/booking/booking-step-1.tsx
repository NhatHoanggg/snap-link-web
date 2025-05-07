"use client"

import { format, isSameDay, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon } from "lucide-react"
import type { BookingFormData } from "@/services/booking.service"
import type { Availability } from "@/services/availability.service"
import { useToast } from "@/hooks/use-toast"

interface BookingStep1Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  nextStep: () => void
  availabilities: Availability[]
}

export function BookingStep1({ formData, updateFormData, nextStep, availabilities }: BookingStep1Props) {
  const { toast } = useToast()

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      const isAvailable = availabilities.some(
        (availability) => isSameDay(parseISO(availability.available_date), date) && availability.status === "available",
      )

      if (isAvailable) {
        updateFormData({ date })
      } else {
        toast({
          title: "Không khả dụng",
          description: "Ngày này không có sẵn để đặt lịch.",
          variant: "destructive",
        })
      }
    } else {
      updateFormData({ date: undefined })
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Chọn ngày chụp</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <Calendar
            mode="single"
            selected={formData.date}
            onSelect={handleDateSelect}
            month={formData.date}
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

          {formData.date && (
            <div className="mt-4 p-4 bg-muted rounded-md">
              <div className="flex items-center">
                <CalendarIcon className="h-5 w-5 mr-2 text-primary" />
                <span className="font-medium">Ngày đã chọn:</span>
                <span className="ml-2">{format(formData.date, "EEEE, dd MMMM yyyy", { locale: vi })}</span>
              </div>
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div></div>
        <Button onClick={nextStep} disabled={!formData.date}>
          Tiếp theo
        </Button>
      </CardFooter>
    </>
  )
} 