"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ConfettiEffect } from "@/components/booking/confetti-effect"
import { CalendarCheck, Camera, Home, MapPin, ArrowLeft, Share2, Clock, Phone, Mail } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

// Mock data
const mockBookingData = {
  booking_id: "BK-" + Math.floor(Math.random() * 10000),
  booking_date: new Date(),
  service: {
    title: "Gói Chụp Ảnh Cưới Premium",
    price: 5000000,
    quantity: 2
  },
  shooting_type: "studio",
  location: "Studio Hội An - 19 Đặng Huy Trứ",
  concept: "Phong cách vintage với tông màu ấm áp, kết hợp giữa truyền thống và hiện đại",
  total_price: 10000000
}

export function BookingSuccessContent() {
  const router = useRouter()
  const { toast } = useToast()
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowConfetti(false)
    }, 5000)

    return () => clearTimeout(timer)
  }, [])

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Đặt lịch chụp ảnh thành công",
          text: `Tôi đã đặt lịch chụp ảnh vào ngày ${format(mockBookingData.booking_date, "dd/MM/yyyy", { locale: vi })}. Dịch vụ: ${mockBookingData.service.title}`,
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
                  {mockBookingData.booking_id}
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
                    <p>{format(mockBookingData.booking_date, "EEEE, dd MMMM yyyy", { locale: vi })}</p>
                  </div>
                </motion.div>

                <Separator />

                <motion.div variants={itemVariants} className="flex items-start">
                  <Camera className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  <div>
                    <h3 className="font-medium">Dịch vụ</h3>
                    <p>{mockBookingData.service.title}</p>
                    <p className="text-sm text-muted-foreground">Số lượng: {mockBookingData.service.quantity} người</p>
                  </div>
                </motion.div>

                <Separator />

                <motion.div variants={itemVariants} className="flex items-start">
                  {mockBookingData.shooting_type === "studio" ? (
                    <Home className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  ) : (
                    <MapPin className="h-5 w-5 mr-3 mt-0.5 text-primary" />
                  )}
                  <div>
                    <h3 className="font-medium">Loại chụp & Địa điểm</h3>
                    <p>
                      {mockBookingData.shooting_type === "studio" ? "Studio" : "Outdoor"} - {mockBookingData.location}
                    </p>
                  </div>
                </motion.div>

                <Separator />

                <motion.div variants={itemVariants} className="flex items-start">
                  <div className="w-full">
                    <h3 className="font-medium">Tổng tiền</h3>
                    <p className="text-lg font-bold text-primary">
                      {new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(mockBookingData.total_price)}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      ({new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(mockBookingData.service.price)} x {mockBookingData.service.quantity} người)
                    </p>
                  </div>
                </motion.div>

                <Separator />

                <motion.div variants={itemVariants}>
                  <h3 className="font-medium mb-2">Concept</h3>
                  <p className="text-sm">{mockBookingData.concept}</p>
                </motion.div>
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
