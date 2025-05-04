"use client"

import { useState, useEffect } from "react"
import { format, addMonths, subMonths, isSameDay, parseISO } from "date-fns"
import { vi } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, ChevronRight, CalendarIcon, CheckCircle, XCircle, Trash2, CalendarPlus } from "lucide-react"
import { getAvailabilities, createAvailability, deleteAvailability } from "@/services/availability.service"
import type { Availability } from "@/services/availability.service"
import { Skeleton } from "@/components/ui/skeleton"
import { useToast } from "@/hooks/use-toast"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export function AvailabilityCalendar() {
  const [date, setDate] = useState<Date>(new Date())
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isLoading, setIsLoading] = useState(true)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    fetchAvailabilities()
  }, [])

  const fetchAvailabilities = async () => {
    try {
      setIsLoading(true)
      const data = await getAvailabilities()
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

  const handlePreviousMonth = () => {
    setDate(subMonths(date, 1))
  }

  const handleNextMonth = () => {
    setDate(addMonths(date, 1))
  }

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date)
  }

  const handleCreateAvailability = async () => {
    if (selectedDate) {
      try {
        await createAvailability(format(selectedDate, "yyyy-MM-dd"))
        await fetchAvailabilities()
        toast({
          title: "Thành công",
          description: "Đã thêm ngày làm việc mới.",
        })
      } catch (error) {
        console.error("Error creating availability:", error)
        toast({
          title: "Lỗi",
          description: "Không thể thêm ngày làm việc. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      }
    }
  }

  const handleDeleteAvailability = async () => {
    if (selectedDate) {
      try {
        const availability = availabilities.find(
          (a) => isSameDay(parseISO(a.available_date), selectedDate) && a.status === "available",
        )
        if (availability) {
          await deleteAvailability(availability.availability_id)
          await fetchAvailabilities()
          toast({
            title: "Thành công",
            description: "Đã xóa ngày làm việc.",
          })
          setSelectedDate(undefined)
        }
      } catch (error) {
        console.error("Error deleting availability:", error)
        toast({
          title: "Lỗi",
          description: "Không thể xóa ngày làm việc. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      }
    }
  }

  const getSelectedDateStatus = () => {
    if (!selectedDate) return null
    return availabilities.find((a) => isSameDay(parseISO(a.available_date), selectedDate))
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Lịch làm việc</span>
          <div className="flex items-center space-x-1">
            <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="text-sm font-medium min-w-24 text-center">{format(date, "MMMM yyyy", { locale: vi })}</div>
            <Button variant="outline" size="icon" onClick={handleNextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
        <CardDescription>Quản lý lịch làm việc của bạn</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-64 w-full" />
          </div>
        ) : (
          <AnimatePresence mode="wait">
            <motion.div
              key={date.toString()}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={handleDateSelect}
                month={date}
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
            </motion.div>
          </AnimatePresence>
        )}

        <div className="flex items-center justify-center mt-4 space-x-4">
          <div className="flex items-center">
            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 mr-2">
              <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
            </Badge>
            <span className="text-sm">Có sẵn</span>
          </div>
          <div className="flex items-center">
            <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20 mr-2">
              <XCircle className="h-3 w-3 text-red-500 mr-1" />
            </Badge>
            <span className="text-sm">Đã đặt</span>
          </div>
        </div>

        {selectedDate && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="w-full p-3 mt-4 rounded-md bg-muted"
          >
            <div className="flex items-center mb-2">
              <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
              <span className="font-medium">Ngày đã chọn:</span>
            </div>
            <div className="pl-6 text-sm mb-4">{format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })}</div>

            {(() => {
              const status = getSelectedDateStatus()
              if (!status) {
                return (
                  <Button className="w-full" onClick={handleCreateAvailability}>
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Thêm ngày làm việc
                  </Button>
                )
              }
              if (status.status === "available") {
                return (
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => setShowDeleteDialog(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Xóa ngày làm việc
                  </Button>
                )
              }
              return null
            })()}
          </motion.div>
        )}
      </CardContent>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ngày làm việc này không?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteAvailability}>Xóa</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  )
}
