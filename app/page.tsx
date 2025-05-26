"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Filter, MapPin, Search } from "lucide-react"
import { useAuth } from "@/services/auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Sparkles, Camera, Clock, Shield, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PhotographerCard } from "@/components/landingpage/photographer-card" 
import { HowItWorks } from "@/components/landingpage/how-it-works"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home")
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[700px] items-center justify-center overflow-hidden bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?height=1080&width=1920')] bg-cover bg-center bg-no-repeat"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="mb-6 text-5xl font-bold tracking-tight sm:text-6xl md:text-7xl">
              Lưu Giữ <span className="text-yellow-400">Khoảnh Khắc Đẹp Nhất</span>
            </h1>
            <p className="mx-auto mb-8 max-w-2xl text-xl text-gray-200 sm:text-2xl">
              Kết nối với những nhiếp ảnh gia tài năng <br /> Và biến yêu cầu của bạn thành hiện thực
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="mx-auto mb-8 max-w-3xl rounded-xl bg-white/10 p-4 backdrop-blur-sm"
          >
            <div className="flex flex-col gap-4 md:flex-row">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Bạn cần loại nhiếp ảnh nào?"
                  className="h-14 border-0 bg-white pl-12 text-lg text-black placeholder:text-gray-500"
                />
              </div>
              <div className="relative flex-grow">
                <MapPin className="absolute left-4 top-4 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Địa điểm"
                  className="h-14 border-0 bg-white pl-12 text-lg text-black placeholder:text-gray-500"
                />
              </div>
              <Button size="lg" className="h-14 px-8 text-lg">
                Tìm kiếm
              </Button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="flex flex-wrap items-center justify-center gap-4 text-sm"
          >
            <span className="text-gray-300">Phổ biến:</span>
            {["Đám cưới", "Chân dung", "Gia đình", "Sự kiện", "Thương mại"].map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/20 px-4 py-2 text-base hover:bg-white/30">
                {tag}
              </Badge>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight">Tại sao chọn SnapLink?</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Trải nghiệm nền tảng đặt lịch nhiếp ảnh tốt nhất với các tính năng độc đáo của chúng tôi
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: <Camera className="h-12 w-12 text-primary" />,
                title: "Nhiếp ảnh gia Chuyên nghiệp",
                description: "Tiếp cận hàng nghìn nhiếp ảnh gia chuyên nghiệp đã được xác minh",
              },
              {
                icon: <Clock className="h-12 w-12 text-primary" />,
                title: "Đặt lịch Ngay lập tức",
                description: "Đặt lịch chụp ảnh ngay lập tức với quy trình đơn giản của chúng tôi",
              },
              {
                icon: <Shield className="h-12 w-12 text-primary" />,
                title: "Thanh toán An toàn",
                description: "Xử lý thanh toán an toàn và bảo mật cho mọi giao dịch",
              },
              {
                icon: <Star className="h-12 w-12 text-primary" />,
                title: "Chất lượng Đảm bảo",
                description: "Chúng tôi cam kết dịch vụ nhiếp ảnh chất lượng cao nhất",
              },
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border bg-card p-6 text-center shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex justify-center">{feature.icon}</div>
                <h3 className="mb-2 text-xl font-bold">{feature.title}</h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Photographers */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-4xl font-bold tracking-tight">Nhiếp ảnh gia Nổi bật</h2>
              <p className="mt-2 text-lg text-muted-foreground">Khám phá những nhiếp ảnh gia chuyên nghiệp hàng đầu của chúng tôi</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="lg" className="gap-2">
                <Filter className="h-4 w-4" />
                Bộ lọc
              </Button>
              <Button variant="outline" size="lg">
                Phổ biến nhất
              </Button>
              <Button variant="outline" size="lg">
                Mới nhất
              </Button>
            </div>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                name: "Alex Morgan",
                specialty: "Nhiếp ảnh Đám cưới",
                location: "Hà Nội",
                rating: 4.9,
                reviews: 127,
                price: "2-3.5 triệu",
                image: "https://images.unsplash.com/flagged/photo-1578001646127-f97b867353b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEwfHxwaG90b2dyYXBoZXJ8ZW58MHx8MHx8fDI%3D",
                coverImage: "https://images.unsplash.com/flagged/photo-1578001646127-f97b867353b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEwfHxwaG90b2dyYXBoZXJ8ZW58MHx8MHx8fDI%3D",
                tags: ["Đám cưới", "Chân dung", "Sự kiện"],
                featured: true,
              },
              {
                id: 2,
                name: "Jessica Chen",
                specialty: "Chân dung & Gia đình",
                location: "TP.HCM",
                rating: 4.8,
                reviews: 98,
                price: "1.5-2.5 triệu",
                image: "https://images.unsplash.com/photo-1728546679568-5f5d7a3c1ec2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGFzaWFuJTIwcGhvdG9ncmFwaGVyfGVufDB8fDB8fHwy",
                coverImage: "https://images.unsplash.com/photo-1728546679568-5f5d7a3c1ec2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGFzaWFuJTIwcGhvdG9ncmFwaGVyfGVufDB8fDB8fHwy",
                tags: ["Gia đình", "Chân dung", "Thai sản"],
                featured: true,
              },
              {
                id: 3,
                name: "Michael Rodriguez",
                specialty: "Thương mại & Sản phẩm",
                location: "Đà Nẵng",
                rating: 4.7,
                reviews: 84,
                price: "3-5 triệu",
                image: "https://images.unsplash.com/photo-1464160551369-33c49e545109?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ5fHxhc2lhbiUyMHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                coverImage: "https://images.unsplash.com/photo-1464160551369-33c49e545109?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ5fHxhc2lhbiUyMHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                tags: ["Thương mại", "Sản phẩm", "Bất động sản"],
                featured: false,
              },
            ].map((photographer) => (
              <motion.div
                key={photographer.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                viewport={{ once: true }}
              >
              <PhotographerCard photographer={photographer} />
              </motion.div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="gap-2">
              Xem tất cả nhiếp ảnh gia
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* Special Offers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight">Ưu đãi Đặc biệt</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Tận dụng các gói dịch vụ và ưu đãi độc quyền của chúng tôi
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Buổi chụp đầu tiên miễn phí",
                description: "Nhận buổi chụp ảnh đầu tiên miễn phí với bất kỳ nhiếp ảnh gia mới nào của chúng tôi",
                icon: <Sparkles className="h-8 w-8 text-yellow-400" />,
              },
              {
                title: "Gói Đám cưới",
                description: "Giảm giá đặc biệt 20% cho các gói nhiếp ảnh đám cưới cao cấp",
                icon: <Sparkles className="h-8 w-8 text-yellow-400" />,
              },
              {
                title: "Thưởng Giới thiệu",
                description: "Nhận 1 triệu đồng cho mỗi người bạn giới thiệu đặt lịch chụp ảnh",
                icon: <Sparkles className="h-8 w-8 text-yellow-400" />,
              },
            ].map((offer, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="rounded-xl border bg-card p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 flex items-center gap-2">
                  {offer.icon}
                  <h3 className="text-xl font-bold">{offer.title}</h3>
                </div>
                <p className="text-muted-foreground">{offer.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Cách Thức Hoạt Động</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Nền tảng của chúng tôi giúp kết nối nhiếp ảnh gia với khách hàng một cách dễ dàng
            </p>
          </div>

          <Tabs defaultValue="clients" className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clients">Cho Khách hàng</TabsTrigger>
              <TabsTrigger value="photographers">Cho Nhiếp ảnh gia</TabsTrigger>
            </TabsList>
            <TabsContent value="clients" className="mt-8">
              <HowItWorks
                steps={[
                  {
                    title: "Tìm kiếm",
                    description: "Tìm kiếm nhiếp ảnh gia theo địa điểm, chuyên môn và giá cả.",
                    icon: "search",
                  },
                  {
                    title: "So sánh",
                    description: "Xem portfolio, đọc đánh giá và so sánh giá cả.",
                    icon: "list",
                  },
                  {
                    title: "Đặt lịch",
                    description: "Chọn ngày và giờ, sau đó đặt lịch an toàn qua nền tảng của chúng tôi.",
                    icon: "calendar",
                  },
                  {
                    title: "Tận hưởng",
                    description: "Gặp nhiếp ảnh gia và nhận những bức ảnh đẹp.",
                    icon: "camera",
                  },
                ]}
              />
            </TabsContent>
            <TabsContent value="photographers" className="mt-8">
              <HowItWorks
                steps={[
                  {
                    title: "Tham gia",
                    description: "Tạo hồ sơ chuyên nghiệp và trưng bày portfolio của bạn.",
                    icon: "user-plus",
                  },
                  {
                    title: "Thiết lập",
                    description: "Xác định dịch vụ, giá cả và lịch trình của bạn.",
                    icon: "settings",
                  },
                  {
                    title: "Nhận đơn đặt",
                    description: "Nhận yêu cầu đặt lịch và giao tiếp với khách hàng.",
                    icon: "calendar",
                  },
                  {
                    title: "Phát triển",
                    description: "Xây dựng danh tiếng với đánh giá và mở rộng kinh doanh.",
                    icon: "trending-up",
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Danh Mục Nhiếp Ảnh</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Tìm nhiếp ảnh gia phù hợp cho mọi dịp
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              {
                name: "Đám cưới",
                icon: "heart",
                image: "https://images.unsplash.com/photo-1519027156611-f83273d3333a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdlZGRpbmclMjBhc2lhfGVufDB8fDB8fHwy",
                count: 245,
              },
              {
                name: "Chân dung",
                icon: "user",
                image: "https://images.unsplash.com/photo-1704731267884-91c2a0f6c20e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI1fHxhc2lhJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDI%3D",
                count: 189,
              },
              {
                name: "Gia đình",
                icon: "users",
                image: "https://images.unsplash.com/photo-1655185495345-af05a1086560?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFzaWElMjBmYW1pbHl8ZW58MHx8MHx8fDI%3D",
                count: 156,
              },
              {
                name: "Sự kiện",
                icon: "calendar",
                image: "https://images.unsplash.com/photo-1709037805294-314fe71b2186?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fGFzaWElMjBwYXJ0eXxlbnwwfHwwfHx8Mg%3D%3D",
                count: 132,
              },
              {
                name: "Thương mại",
                icon: "briefcase",
                image: "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                count: 98,
              },
              {
                name: "Bất động sản",
                icon: "home",
                image: "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                count: 87,
              },
              {
                name: "Thời trang",
                icon: "scissors",
                image: "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                count: 76,
              },
              {
                name: "Ẩm thực",
                icon: "utensils",
                image: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXNpYW4lMjBmb29kfGVufDB8fDB8fHwy",
                count: 64,
              },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/category/${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="relative flex h-48 flex-col items-center justify-center p-6 text-white">
                  <h3 className="mb-2 text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.count} nhiếp ảnh gia</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 rounded-xl bg-primary p-8 text-primary-foreground md:grid-cols-4">
            {[
              { value: "10,000+", label: "Nhiếp ảnh gia" },
              { value: "50,000+", label: "Khách hàng hài lòng" },
              { value: "100,000+", label: "Lượt đặt lịch" },
              { value: "500+", label: "Thành phố" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold">{stat.value}</p>
                <p className="text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* For Clients */}
            <Card className="overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1448376561459-dbe8868fa34c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGFzaWFuJTIwZ2lybHxlbnwwfHwwfHx8Mg%3D%3D?height=400&width=800')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
              <CardContent className="p-6 pt-8">
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold">Bạn đang tìm nhiếp ảnh gia?</h3>
                  <p className="text-muted-foreground">
                    Tìm nhiếp ảnh gia chuyên nghiệp cho những khoảnh khắc đặc biệt của bạn. Xem portfolio, đọc đánh giá và đặt lịch với sự tự tin.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Truy cập hàng nghìn nhiếp ảnh gia đã được kiểm duyệt</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Đặt lịch và thanh toán an toàn</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Đọc đánh giá thực từ khách hàng</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-6">
                  <Button size="lg" className="w-full">
                    Tìm nhiếp ảnh gia
                  </Button>
              </CardFooter>
            </Card>

            {/* For Photographers */}
            <Card className="overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509145844239-0d160c78a06a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
              <CardContent className="p-6 pt-8">
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold">Bạn là nhiếp ảnh gia?</h3>
                  <p className="text-muted-foreground">
                    Tham gia mạng lưới của chúng tôi và phát triển kinh doanh. Nhận thêm khách hàng, quản lý đặt lịch dễ dàng và trưng bày portfolio của bạn cho hàng nghìn người.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Tạo hồ sơ và portfolio chuyên nghiệp</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Quản lý đặt lịch và lịch trình tại một nơi</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Nhận thanh toán an toàn và đúng hạn</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-6">
                <Button size="lg" variant="outline" className="w-full">
                  Tham gia làm nhiếp ảnh gia
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

