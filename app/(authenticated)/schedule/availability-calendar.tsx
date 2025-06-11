"use client"

import { useState, useEffect } from "react"
import {
  format,
  addMonths,
  subMonths,
  isSameDay,
  parseISO,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  isToday,
  isSameMonth,
} from "date-fns"
import { vi } from "date-fns/locale"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar } from "@/components/ui/calendar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ChevronLeft,
  ChevronRight,
  CalendarIcon,
  CheckCircle,
  XCircle,
  Trash2,
  CalendarPlus,
  Clock,
  TrendingUp,
  CalendarIcon as CalendarViewIcon,
} from "lucide-react"
import { getAvailabilities, createAvailability, deleteAvailability } from "@/services/availability.service"
import type { Availability } from "@/services/availability.service"
import { Skeleton } from "@/components/ui/skeleton"
import toast, { Toaster } from "react-hot-toast"
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
  const [activeTab, setActiveTab] = useState("calendar")

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
      toast.error("Không thể tải lịch làm việc. Vui lòng thử lại sau.")
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
        const newAvailability = await createAvailability(format(selectedDate, "yyyy-MM-dd"))
        setAvailabilities((prev) => [...prev, newAvailability])
        toast.success("Đã thêm ngày làm việc mới.")
      } catch (error) {
        console.error("Error creating availability:", error)
        toast.error("Không thể thêm ngày làm việc. Vui lòng thử lại sau.")
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
          setAvailabilities((prev) => prev.filter((a) => a.availability_id !== availability.availability_id))
          toast.success("Đã xóa ngày làm việc.")
          setSelectedDate(undefined)
          setShowDeleteDialog(false)
        }
      } catch (error) {
        console.error("Error deleting availability:", error)
        toast.error("Không thể xóa ngày làm việc. Vui lòng thử lại sau.")
      }
    }
  }

  const getSelectedDateStatus = () => {
    if (!selectedDate) return null
    return availabilities.find((a) => isSameDay(parseISO(a.available_date), selectedDate))
  }

  const getStats = () => {
    const available = availabilities.filter((a) => a.status === "available").length
    const booked = availabilities.filter((a) => a.status === "booked").length
    const total = available + booked
    return { available, booked, total }
  }

  const getWeekView = () => {
    const start = startOfWeek(date, { weekStartsOn: 1 })
    const end = endOfWeek(date, { weekStartsOn: 1 })
    return eachDayOfInterval({ start, end })
  }

  const stats = getStats()

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Quản lý lịch làm việc</h1>
        <p className="text-muted-foreground mt-2">Quản lý và theo dõi lịch làm việc của bạn một cách hiệu quả</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tổng ngày</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
              <CalendarViewIcon className="h-8 w-8 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Có sẵn</p>
                <p className="text-2xl font-bold text-green-600">{stats.available}</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Đã đặt</p>
                <p className="text-2xl font-bold text-red-600">{stats.booked}</p>
              </div>
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Tỷ lệ đặt</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stats.total > 0 ? Math.round((stats.booked / stats.total) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="calendar">Lịch tháng</TabsTrigger>
          <TabsTrigger value="week">Lịch tuần</TabsTrigger>
        </TabsList>

        <TabsContent value="calendar" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Calendar Section */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <CalendarIcon className="h-5 w-5" />
                    Lịch tháng
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <div className="text-sm font-medium min-w-32 text-center">
                      {format(date, "MMMM yyyy", { locale: vi })}
                    </div>
                    <Button variant="outline" size="sm" onClick={handleNextMonth}>
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
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
                        className="rounded-md border w-full"
                        modifiers={{
                          available: (date) =>
                            availabilities.some(
                              (a) => isSameDay(parseISO(a.available_date), date) && a.status === "available",
                            ),
                          booked: (date) =>
                            availabilities.some(
                              (a) => isSameDay(parseISO(a.available_date), date) && a.status === "booked",
                            ),
                        }}
                        modifiersClassNames={{
                          available:
                            "bg-green-50 hover:bg-green-100 dark:bg-green-900/20 dark:hover:bg-green-900/30 text-green-600 dark:text-green-400 font-medium",
                          booked:
                            "bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 line-through opacity-70",
                        }}
                      />
                    </motion.div>
                  </AnimatePresence>
                )}
              </CardContent>
            </Card>

            {/* Side Panel */}
            <div className="space-y-6">
              {/* Legend */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Chú thích</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20">
                      <CheckCircle className="h-3 w-3 text-green-500 mr-1" />
                    </Badge>
                    <span className="text-sm">Có sẵn</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-red-50 dark:bg-red-900/20">
                      <XCircle className="h-3 w-3 text-red-500 mr-1" />
                    </Badge>
                    <span className="text-sm">Đã đặt</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                      <Clock className="h-3 w-3 text-blue-500 mr-1" />
                    </Badge>
                    <span className="text-sm">Hôm nay</span>
                  </div>
                </CardContent>
              </Card>

              {/* Selected Date Actions */}
              {selectedDate && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Ngày đã chọn</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4"
                    >
                      <div className="p-3 rounded-md bg-muted">
                        <div className="flex items-center mb-2">
                          <CalendarIcon className="h-4 w-4 mr-2 text-primary" />
                          <span className="font-medium">
                            {format(selectedDate, "EEEE, dd MMMM yyyy", { locale: vi })}
                          </span>
                        </div>
                        {isToday(selectedDate) && (
                          <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20">
                            <Clock className="h-3 w-3 text-blue-500 mr-1" />
                            Hôm nay
                          </Badge>
                        )}
                      </div>

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
                            <Button variant="destructive" className="w-full" onClick={() => setShowDeleteDialog(true)}>
                              <Trash2 className="mr-2 h-4 w-4" />
                              Xóa ngày làm việc
                            </Button>
                          )
                        }
                        if (status.status === "booked") {
                          return (
                            <div className="p-3 rounded-md bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300">
                              <div className="flex items-center">
                                <XCircle className="h-4 w-4 mr-2" />
                                <span className="text-sm font-medium">Ngày này đã được đặt</span>
                              </div>
                            </div>
                          )
                        }
                        return null
                      })()}
                    </motion.div>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="week" className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5" />
                  Lịch tuần
                </CardTitle>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={handlePreviousMonth}>
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="text-sm font-medium min-w-48 text-center">
                    {format(startOfWeek(date, { weekStartsOn: 1 }), "dd MMM", { locale: vi })} -{" "}
                    {format(endOfWeek(date, { weekStartsOn: 1 }), "dd MMM yyyy", { locale: vi })}
                  </div>
                  <Button variant="outline" size="sm" onClick={handleNextMonth}>
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {getWeekView().map((day) => {
                  const availability = availabilities.find((a) => isSameDay(parseISO(a.available_date), day))
                  const isCurrentMonth = isSameMonth(day, date)

                  return (
                    <Card
                      key={day.toString()}
                      className={`p-4 cursor-pointer transition-colors ${
                        selectedDate && isSameDay(day, selectedDate) ? "ring-2 ring-primary" : ""
                      } ${!isCurrentMonth ? "opacity-50" : ""}`}
                      onClick={() => handleDateSelect(day)}
                    >
                      <div className="text-center space-y-2">
                        <div className="text-xs font-medium text-muted-foreground">
                          {format(day, "EEE", { locale: vi })}
                        </div>
                        <div className={`text-lg font-semibold ${isToday(day) ? "text-primary" : ""}`}>
                          {format(day, "dd")}
                        </div>
                        {availability && (
                          <Badge
                            variant="outline"
                            className={
                              availability.status === "available"
                                ? "bg-green-50 dark:bg-green-900/20 text-green-600"
                                : "bg-red-50 dark:bg-red-900/20 text-red-600"
                            }
                          >
                            {availability.status === "available" ? (
                              <CheckCircle className="h-3 w-3 mr-1" />
                            ) : (
                              <XCircle className="h-3 w-3 mr-1" />
                            )}
                            {availability.status === "available" ? "Sẵn sàng" : "Đã đặt"}
                          </Badge>
                        )}
                      </div>
                    </Card>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa ngày làm việc này không? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAvailability}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Toaster position="bottom-right" />
    </div>
  )
}
