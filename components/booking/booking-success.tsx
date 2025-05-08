"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ConfettiEffect } from "@/components/booking/confetti-effect"
import { CalendarCheck, Camera, Home, MapPin, ArrowLeft, Share2, Clock, Phone, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { getBookingByCode, type BookingResponse } from "@/services/booking.service"
import { getServiceByIdPublic, type Service } from "@/services/services.service"

export function BookingSuccessContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { toast } = useToast()
  const [showConfetti, setShowConfetti] = useState(true)
  const [booking, setBooking] = useState<BookingResponse | null>(null)
  const [service, setService] = useState<Service | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    const fetchBookingData = async () => {
      try {
        const code = searchParams.get('code')
        if (!code) {
          router.push('/')
          return
        }

        const bookingData = await getBookingByCode(code)
        setBooking(bookingData)

        if (bookingData.service_id) {
          const serviceData = await getServiceByIdPublic(bookingData.service_id)
          setService(serviceData)
        }
      } catch (error) {
        console.error('Error fetching booking data:', error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin đặt lịch. Vui lòng thử lại sau.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchBookingData()
  }, [searchParams, router, toast])

  const handleShare = async () => {
    if (!booking) return

    if (navigator.share) {
      try {
        await navigator.share({
          title: "Đặt lịch chụp ảnh thành công",
          text: `Tôi đã đặt lịch chụp ảnh vào ngày ${format(new Date(booking.booking_date), "dd/MM/yyyy", { locale: vi })}. Dịch vụ: ${service?.title || 'Chụp ảnh'}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Lỗi khi chia sẻ:", error)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast({
        title: "Đã sao chép",
        description: "Đường dẫn đã được sao chép vào clipboard",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="container px-4 py-16 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Đang tải thông tin đặt lịch...</p>
        </div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="container px-4 py-16 mx-auto">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-4">Không tìm thấy thông tin đặt lịch</h1>
          <Button onClick={() => router.push('/')}>Trở về trang chủ</Button>
        </div>
      </div>
    )
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  }

  const pulseVariants = {
    pulse: {
      scale: [1, 1.05, 1],
      transition: {
        duration: 2,
        repeat: Number.POSITIVE_INFINITY,
        repeatType: "reverse" as const,
      },
    },
  }

  return (
    <div className="container px-4 py-16 mx-auto">
      {showConfetti && <ConfettiEffect />}

      <motion.div
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div variants={itemVariants} className="text-center mb-8">
          <motion.div className="inline-block mb-6" animate="pulse" variants={pulseVariants} initial={{ scale: 1 }}>
          </motion.div>
          <motion.h1 variants={itemVariants} className="text-3xl sm:text-4xl font-bold mb-2">
            Đặt lịch thành công!
          </motion.h1>
          <motion.p variants={itemVariants} className="text-muted-foreground">
            Cảm ơn bạn đã đặt lịch chụp ảnh với chúng tôi
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 shadow-lg overflow-hidden">
            <CardHeader className="bg-primary/5 dark:bg-primary/10">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Chi tiết đặt lịch</h2>
                <div className="px-3 py-1 bg-primary text-primary-foreground rounded-full text-sm font-medium">
                  {booking.booking_code}
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <motion.div
                className="space-y-4"
                variants={{
                  hidden: { opacity: 0 },
                  visible: {
                    opacity: 1,
                    transition: {
                      staggerChildren: 0.1,
                    },
                  },
                }}
              >
                <motion.div variants={itemVariants} className="flex items-start">
                  <CalendarCheck className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">Ngày chụp</h3>
                    <p>{format(new Date(booking.booking_date), "EEEE, dd MMMM yyyy", { locale: vi })}</p>
                  </div>
                </motion.div>

                <Separator />

                <motion.div variants={itemVariants} className="flex items-start">
                  <Camera className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">Dịch vụ</h3>
                    <p>{service?.title || 'Chụp ảnh'}</p>
                    {booking.quantity > 1 && (
                      <p className="text-sm text-muted-foreground">Số lượng: {booking.quantity} người</p>
                    )}
                  </div>
                </motion.div>

                <Separator />

                <motion.div variants={itemVariants} className="flex items-start">
                  {booking.shooting_type === "studio" ? (
                    <Home className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  ) : (
                    <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  )}
                  <div>
                    <h3 className="font-medium">Loại chụp & Địa điểm</h3>
                    <p>
                      {booking.shooting_type === "studio" ? "Studio" : "Outdoor"} - {booking.custom_location}
                    </p>
                  </div>
                </motion.div>

                <Separator />

                {service && (
                  <motion.div variants={itemVariants} className="flex items-start">
                    <div className="w-full">
                      <h3 className="font-medium">Tổng tiền</h3>
                      <p className="text-lg font-bold text-primary">
                        {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price * booking.quantity)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ({new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(service.price)} x {booking.quantity} người)
                      </p>
                    </div>
                  </motion.div>
                )}

                <Separator />

                {booking.concept && (
                  <motion.div variants={itemVariants}>
                    <h3 className="font-medium mb-2">Concept</h3>
                    <p className="text-sm">{booking.concept}</p>
                  </motion.div>
                )}

                {booking.illustration_url && (
                  <motion.div variants={itemVariants} className="mt-4">
                    <h3 className="font-medium mb-2">Hình ảnh minh họa</h3>
                    <div className="relative aspect-video rounded-lg overflow-hidden">
                      <img
                        src={booking.illustration_url}
                        alt="Concept illustration"
                        className="object-cover w-full h-full"
                      />
                    </div>
                  </motion.div>
                )}
              </motion.div>

              <motion.div
                variants={itemVariants}
                className="mt-6 p-4 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800"
              >
                <div className="flex items-start space-x-3">
                  <Clock className="h-5 w-5 text-amber-600 dark:text-amber-400 mt-0.5" />
                  <p className="text-sm text-amber-800 dark:text-amber-300">
                    Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất để xác nhận lịch chụp. Vui lòng kiểm tra email
                    và điện thoại của bạn.
                  </p>
                </div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
              <Button variant="outline" className="w-full sm:w-auto" onClick={() => router.push("/")} size="lg">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Trở về trang chủ
              </Button>
              <Button className="w-full sm:w-auto" onClick={handleShare} size="lg">
                <Share2 className="mr-2 h-4 w-4" />
                Chia sẻ
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-sm text-muted-foreground"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4">
            <a href="tel:+84123456789" className="flex items-center text-primary hover:underline">
              <Phone className="h-4 w-4 mr-1" />
              0123 456 789
            </a>
            <span className="hidden sm:inline">•</span>
            <a href="mailto:info@photoservice.com" className="flex items-center text-primary hover:underline">
              <Mail className="h-4 w-4 mr-1" />
              info@photoservice.com
            </a>
          </div>
        </motion.div>
      </motion.div>
    </div>
  )
}
