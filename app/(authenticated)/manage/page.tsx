"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ImageIcon,
  Percent,
  Calendar,
  Clock,
  Star,
  MessageSquare,
  ShoppingBag,
  HandCoins ,
} from "lucide-react"

interface StatCard {
  title: string
  description: string
  icon: React.ReactNode
  href: string
  color: string
  count?: number
}

export default function ManagementDashboard() {
  const router = useRouter()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const statCards: StatCard[] = [
    {
      title: "Bài viết",
      description: "Quản lý bài viết và nội dung",
      icon: <ImageIcon className="h-6 w-6" />,
      href: "/posts",
      color: "bg-blue-500",
    },
    {
      title: "Khuyến mãi",
      description: "Quản lý mã giảm giá và ưu đãi",
      icon: <Percent className="h-6 w-6" />,
      href: "/manage/discounts",
      color: "bg-green-500",
    },
    {
      title: "Đặt lịch",
      description: "Quản lý lịch đặt chụp ảnh",
      icon: <Calendar className="h-6 w-6" />,
      href: "/manage/bookings",
      color: "bg-pink-500",
    },
    {
      title: "Yêu cầu",
      description: "Xem và xử lý yêu cầu từ khách hàng",
      icon: <MessageSquare className="h-6 w-6" />,
      href: "/requests",
      color: "bg-orange-500",
    },
    {
      title: "Dịch vụ",
      description: "Quản lý các gói dịch vụ",
      icon: <ShoppingBag className="h-6 w-6" />,
      href: "/services",
      color: "bg-purple-500",
    },
    {
      title: "Ảnh nổi bật",
      description: "Quản lý ảnh đáng chú ý",
      icon: <Star className="h-6 w-6" />,
      href: "/portfolio/featured-photos/",
      color: "bg-red-500",
    },
    {
      title: "Lịch làm việc",
      description: "Quản lý thời gian làm việc",
      icon: <Clock className="h-6 w-6" />,
      href: "/schedule",
      color: "bg-yellow-500",
    },
    {
      title: "Xem đề xuất",
      description: "Quản lý đề xuất của bạn",
      icon: <HandCoins className="h-6 w-6" />,
      href: "/manage/request-offers",
      color: "bg-indigo-500",
    },
  ]

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Quản lý</h1>
        <p className="text-muted-foreground mt-1">Quản lý tất cả các hoạt động của bạn</p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        {statCards.map((card) => (
          <motion.div key={card.title} variants={item}>
            <Card
              className={`relative overflow-hidden transition-all duration-300 hover:shadow-lg ${
                hoveredCard === card.title ? "scale-[1.02]" : ""
              }`}
              onMouseEnter={() => setHoveredCard(card.title)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div className={`absolute top-0 right-0 w-32 h-32 ${card.color} opacity-10 rounded-full -mr-16 -mt-16`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">{card.title}</CardTitle>
                  <div className={`p-2 rounded-lg ${card.color} bg-opacity-10`}>{card.icon}</div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4 line-clamp-3 min-h-[64px]">{card.description}</p>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => router.push(card.href)}
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}
