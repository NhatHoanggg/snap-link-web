"use client"

import { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  MessageSquareText,
  HelpCircle,
  Clock,
  WifiOff,
  ServerCrash,
  CreditCard,
} from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function BookingFailedContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [errorCode, setErrorCode] = useState<string>("")
  const [randomId, setRandomId] = useState<number | null>(null)

  // Lấy mã lỗi từ URL params (nếu có)
  useEffect(() => {
    const code = searchParams.get("code") || "unknown"
    setErrorCode(code)
    setRandomId(Math.floor(Math.random() * 10000)) // Đảm bảo chỉ chạy trên client
  }, [searchParams])

  const getErrorMessage = () => {
    switch (errorCode) {
      case "timeout":
        return "Yêu cầu đặt lịch đã hết thời gian chờ. Vui lòng kiểm tra kết nối mạng và thử lại."
      case "server":
        return "Máy chủ hiện đang gặp sự cố. Đội ngũ kỹ thuật của chúng tôi đang khắc phục."
      case "payment":
        return "Có lỗi xảy ra trong quá trình thanh toán. Vui lòng kiểm tra thông tin thanh toán và thử lại."
      case "unavailable":
        return "Ngày hoặc dịch vụ bạn chọn hiện không còn khả dụng. Vui lòng chọn ngày hoặc dịch vụ khác."
      default:
        return "Đã xảy ra lỗi không xác định trong quá trình đặt lịch. Vui lòng thử lại sau."
    }
  }

  const getErrorIcon = () => {
    switch (errorCode) {
      case "timeout":
        return <Clock className="absolute inset-0 m-auto h-12 w-12 text-red-600 dark:text-red-400" />
      case "server":
        return <ServerCrash className="absolute inset-0 m-auto h-12 w-12 text-red-600 dark:text-red-400" />
      case "payment":
        return <CreditCard className="absolute inset-0 m-auto h-12 w-12 text-red-600 dark:text-red-400" />
      case "unavailable":
        return <WifiOff className="absolute inset-0 m-auto h-12 w-12 text-red-600 dark:text-red-400" />
      default:
        return <AlertCircle className="absolute inset-0 m-auto h-12 w-12 text-red-600 dark:text-red-400" />
    }
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.2,
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

  const shakeVariants = {
    shake: {
      x: [0, -10, 10, -10, 10, 0],
      transition: { duration: 0.6, ease: "easeInOut" },
    },
  }

  return (
    <div className="container px-4 py-16 mx-auto">
      <motion.div
        className="max-w-2xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
      >
        <motion.div
          variants={itemVariants}
          className="text-center mb-8"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div className="inline-block mb-6" variants={shakeVariants} initial={{ x: 0 }} animate="shake">
            <div className="relative w-24 h-24 mx-auto">
              {getErrorIcon()}
            </div>
          </motion.div>
          <motion.h1
            variants={itemVariants}
            className="text-3xl sm:text-4xl font-bold mb-2 text-red-600 dark:text-red-400"
          >
            Đặt lịch thất bại
          </motion.h1>
          <motion.p variants={itemVariants} className="text-muted-foreground">
            {getErrorMessage()}
          </motion.p>
        </motion.div>

        <motion.div variants={itemVariants}>
          <Card className="border-2 border-red-200 dark:border-red-900/50 shadow-lg overflow-hidden">
            <CardHeader className="bg-red-50 dark:bg-red-900/20 border-b border-red-100 dark:border-red-900/30">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold flex items-center">
                  <HelpCircle className="w-5 h-5 mr-2 text-red-500" />
                  Bạn cần làm gì tiếp theo?
                </h2>
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
                  <RefreshCw className="h-5 w-5 mr-3 mt-0.5 text-red-500" />
                  <div>
                    <h3 className="font-medium">Thử lại</h3>
                    <p className="text-sm text-muted-foreground">
                      Vui lòng thử đặt lịch lại sau vài phút. Đôi khi lỗi chỉ là tạm thời.
                    </p>
                  </div>
                </motion.div>

                <Separator />

                <motion.div variants={itemVariants} className="flex items-start">
                  <MessageSquareText className="h-5 w-5 mr-3 mt-0.5 text-red-500" />
                  <div>
                    <h3 className="font-medium">Liên hệ hỗ trợ</h3>
                    <p className="text-sm text-muted-foreground">
                      Nếu vấn đề vẫn tiếp diễn, vui lòng liên hệ đội ngũ hỗ trợ của chúng tôi để được giúp đỡ.
                    </p>
                  </div>
                </motion.div>

                <Separator />

                <motion.div variants={itemVariants}>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger className="text-sm font-medium">
                        Các lỗi thường gặp và cách khắc phục
                      </AccordionTrigger>
                      <AccordionContent>
                        <ul className="space-y-3 text-sm">
                          <li className="flex items-start">
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                              1
                            </span>
                            <span>
                              <strong>Lỗi kết nối:</strong> Kiểm tra kết nối internet của bạn và thử làm mới trang.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                              2
                            </span>
                            <span>
                              <strong>Lỗi thanh toán:</strong> Kiểm tra thông tin thẻ và số dư tài khoản của bạn.
                            </span>
                          </li>
                          <li className="flex items-start">
                            <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-full w-5 h-5 flex items-center justify-center text-xs mr-2 mt-0.5">
                              3
                            </span>
                            <span>
                              <strong>Lỗi thời gian:</strong> Ngày hoặc giờ bạn chọn có thể đã được đặt bởi người khác.
                            </span>
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </motion.div>
              </motion.div>
            </CardContent>
            <CardFooter className="flex flex-col sm:flex-row gap-3 pt-2 pb-6">
              <Button
                variant="outline"
                className="w-full sm:w-auto border-red-200 dark:border-red-900/50 hover:bg-red-50 dark:hover:bg-red-900/20"
                onClick={() => router.push("/")}
                size="lg"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Trở về trang chủ
              </Button>
              <Button
                className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white"
                onClick={() => router.push("/booking")}
                size="lg"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Thử lại
              </Button>
            </CardFooter>
          </Card>
        </motion.div>

        {randomId !== null && (
          <motion.div
            variants={itemVariants}
            className="mt-8 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm text-muted-foreground">
              Mã lỗi: {errorCode.toUpperCase()}-{randomId}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Cần hỗ trợ? Liên hệ{" "}
              <a href="tel:+84123456789" className="text-red-600 dark:text-red-400 hover:underline">
                0123 456 789
              </a>{" "}
              hoặc email{" "}
              <a href="mailto:support@photoservice.com" className="text-red-600 dark:text-red-400 hover:underline">
                support@photoservice.com
              </a>
            </p>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}
