"use client"

import type React from "react"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import {
  MapPin,
  Star,
  Loader2,
  Tag,
  Globe,
  Camera,
  Calendar,
  Heart,
  Share2,
  Percent,
  Gift,
  Copy,
  CheckCircle,
  Instagram,
  Facebook,
  Twitter,
  Youtube,
  ExternalLink,
  ArrowRight,
  Info,
  BookOpen,
  ImageIcon,
  Clock,
  Users,
  Save,
} from "lucide-react"
import { photographerService, type Photographer } from "@/services/photographer.service"
import { checkFollowStatus, followPhotographer, unfollowPhotographer } from "@/services/follow.service"
import { useAuth } from "@/services/auth"
import { getPhotographerDiscounts, type PhotographerDiscount, saveDiscount } from "@/services/discount.service"
import { format, parseISO, isAfter } from "date-fns"
import { vi } from "date-fns/locale"
import { cn } from "@/lib/utils"
import toast, { Toaster, ToastBar } from "react-hot-toast"
import { getReviewsByPhotographerId, type ReviewResponse } from "@/services/review.service"

// Helper function to get discount status
const getDiscountStatus = (discount: PhotographerDiscount): "active" | "expired" | "upcoming" => {
  const now = new Date()
  const validFrom = new Date(discount.valid_from)
  const validTo = new Date(discount.valid_to)

  if (isAfter(now, validTo)) {
    return "expired"
  }

  if (isAfter(validFrom, now)) {
    return "upcoming"
  }

  return "active"
}

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: "active" | "expired" | "upcoming"): "default" | "secondary" | "destructive" | "outline" => {
  switch (status) {
    case "active":
      return "default"
    case "expired":
      return "destructive"
    case "upcoming":
      return "secondary"
    default:
      return "default"
  }
}

// Helper function to translate status
const translateStatus = (status: "active" | "expired" | "upcoming") => {
  switch (status) {
    case "active":
      return "Đang hoạt động"
    case "expired":
      return "Đã hết hạn"
    case "upcoming":
      return "Sắp diễn ra"
    default:
      return status
  }
}

// Helper function to format discount value
const formatDiscountValue = (discount: PhotographerDiscount) => {
  if (discount.discount_type === "fixed") {
    return `${discount.value.toLocaleString()} VND`
  } else {
    return `${discount.value}%`
  }
}

// Social media icon mapping
const SocialMediaIcons: Record<string, React.ReactNode> = {
  instagram: <Instagram className="h-5 w-5" />,
  facebook: <Facebook className="h-5 w-5" />,
  twitter: <Twitter className="h-5 w-5" />,
  youtube: <Youtube className="h-5 w-5" />,
}

interface FeaturedPhoto {
  featured_photo_id: number
  image_url: string
  title: string
  description?: string
}

interface Service {
  service_id: number
  title: string
  description: string
  price: number
  thumbnail_url?: string
  duration?: string
  bookings_count?: number
}

export default function PhotographerDetail() {
  const params = useParams()
  const router = useRouter()
  const [photographer, setPhotographer] = useState<Photographer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const [discounts, setDiscounts] = useState<PhotographerDiscount[]>([])
  const [activeTab, setActiveTab] = useState("photos")
  const [isDiscountDialogOpen, setIsDiscountDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{
    url: string
    title: string
    description: string
  } | null>(null)
  const [isHeaderSticky, setIsHeaderSticky] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)
  const [selectedDiscount, setSelectedDiscount] = useState<PhotographerDiscount | null>(null)
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [isServiceDialogOpen, setIsServiceDialogOpen] = useState(false)
  const [reviews, setReviews] = useState<ReviewResponse[]>([])
  const [isReviewsLoading, setIsReviewsLoading] = useState(false)

  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await photographerService.getPhotographerBySlug(params.slug as string)
        setPhotographer(response)

        console.log(response)

        if (isAuthenticated && user) {
          const followStatus = await checkFollowStatus(response.photographer_id)
          setIsFollowing(followStatus.is_following)

          const discountsResponse = await getPhotographerDiscounts(response.photographer_id)
          setDiscounts(discountsResponse.discounts || [])
        }
      } catch (err) {
        setError("Không thể tải thông tin nhiếp ảnh gia. Vui lòng thử lại sau.")
        console.error("Error fetching photographer:", err)
        toast.error("Không thể tải thông tin nhiếp ảnh gia. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchPhotographer()
    }
  }, [params.slug, isAuthenticated, user, toast])

  useEffect(() => {
    const handleScroll = () => {
      if (headerRef.current) {
        const headerHeight = headerRef.current.offsetHeight
        const scrollPosition = window.scrollY
        setIsHeaderSticky(scrollPosition > headerHeight - 100)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatLocation = (photographer: Photographer) => {
    const parts = [photographer.ward, photographer.district, photographer.province].filter(Boolean)
    return parts.length > 0 ? parts.join(", ") : "Chưa cập nhật"
  }

  const handleFollowToggle = async () => {
    if (!isAuthenticated || !user || !photographer) return

    try {
      setIsFollowLoading(true)
      if (isFollowing) {
        await unfollowPhotographer(photographer.photographer_id)
        setIsFollowing(false)
        toast.success("Đã hủy theo dõi nhiếp ảnh gia.")
      } else {
        await followPhotographer(photographer.photographer_id)
        setIsFollowing(true)
        toast.success("Đã theo dõi nhiếp ảnh gia.")
      }
    } catch (error) {
      console.error("Error toggling follow status:", error)
      toast.error("Không thể thay đổi trạng thái theo dõi. Vui lòng thử lại sau.")

    } finally {
      setIsFollowLoading(false)
    }
  }

  const handleBookingClick = () => {
    if (!isAuthenticated || !user) {
      toast.error("Vui lòng đăng nhập để đặt lịch chụp ảnh")
      router.push("/auth/login")
      return
    }
    
    // If authenticated, proceed to booking page
    router.push(`/booking/${photographer?.slug}`)
  }

  const handleCopyDiscountCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Đã sao chép mã giảm giá ${code} vào clipboard`)
  }

  const handleSaveDiscount = async (code: string) => {
    try {
      // toast.loading(`Đang lưu mã giảm giá ${code}`)
      await saveDiscount(code)
      
      // Update is_saved state for the discount in both lists
      setDiscounts(prevDiscounts => 
        prevDiscounts.map(discount => 
          discount.code === code 
            ? { ...discount, is_saved: true }
            : discount
        )
      )
      
      // If this is the selected discount, update its state too
      if (selectedDiscount?.code === code) {
        setSelectedDiscount(prev => prev ? { ...prev, is_saved: true } : null)
      }
      
      toast.success(`Đã lưu mã giảm giá ${code}`)
    } catch (error) {
      console.error("Error saving discount:", error)
      toast.error("Không thể lưu mã giảm giá. Vui lòng thử lại sau.")
    }
  }

  const handleShareProfile = async () => {
    if (navigator.share && photographer) {
      try {
        await navigator.share({
          title: `Nhiếp ảnh gia ${photographer.full_name}`,
          text: `Xem hồ sơ của nhiếp ảnh gia ${photographer.full_name}`,
          url: window.location.href,
        })
      } catch (error) {
        console.error("Error sharing:", error)
      }
    } else {

      navigator.clipboard.writeText(window.location.href)

      toast.success("Đã sao chép đường dẫn vào clipboard")
    }
  }

  const handleViewImage = (photo: FeaturedPhoto) => {
    setSelectedImage({
      url: photo.image_url || "/placeholder.svg",
      title: photo.title || "Untitled",
      description: photo.description || "",
    })
    setIsImageDialogOpen(true)
  }

  const handleViewDiscount = (discount: PhotographerDiscount) => {
    setSelectedDiscount(discount)
    setIsDiscountDialogOpen(true)
  }

  const handleViewService = (service: Service) => {
    setSelectedService(service)
    setIsServiceDialogOpen(true)
  }

  const fetchReviews = async () => {
    if (!photographer) return
    
    try {
      setIsReviewsLoading(true)
      const reviewsData = await getReviewsByPhotographerId(photographer.photographer_id)
      setReviews(reviewsData.reviews)
    } catch (error) {
      console.error("Error fetching reviews:", error)
      toast.error("Không thể tải đánh giá. Vui lòng thử lại sau.")
    } finally {
      setIsReviewsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === "reviews") {
      fetchReviews()
    }
  }, [activeTab, photographer])

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-16 w-16 animate-spin text-primary mb-6" />
        <p className="text-xl font-medium">Đang tải thông tin...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="p-8 bg-destructive/10 text-destructive rounded-2xl text-center max-w-2xl mx-auto">
          <h2 className="text-2xl font-semibold mb-4">Đã xảy ra lỗi</h2>
          <p className="mb-6 text-lg">{error}</p>
          <Button variant="outline" size="lg" onClick={() => router.push("/photographers")}>
            Quay lại danh sách nhiếp ảnh gia
          </Button>
        </div>
      </div>
    )
  }

  if (!photographer) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="text-center p-12 border rounded-2xl max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">Nhiếp ảnh gia không tồn tại</h1>
          <p className="text-muted-foreground mb-6 text-lg">Nhiếp ảnh gia bạn đang tìm kiếm không tồn tại.</p>
          <Button asChild size="lg">
            <Link href="/photographers">Quay lại danh sách nhiếp ảnh gia</Link>
          </Button>
        </div>
      </div>
    )
  }

  const activeDiscounts = discounts.filter((discount) => getDiscountStatus(discount) === "active")

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div ref={headerRef} className="relative h-[500px] w-full">
        <Image
          src={photographer.background_image || "/placeholder.svg?height=500&width=1920"}
          alt={`${photographer.full_name} background`}
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />

        {/* Sticky Header */}
        <div
          className={cn(
            "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg shadow-md transition-all duration-300 transform",
            isHeaderSticky ? "translate-y-0" : "-translate-y-full",
          )}
        >
          <div className="container mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-10 w-10 border-2 border-primary/20">
                <AvatarImage src={photographer.avatar || "/placeholder.svg"} alt={photographer.full_name} />
                <AvatarFallback>{photographer.full_name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h2 className="font-semibold text-lg leading-tight">{photographer.full_name}</h2>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{formatLocation(photographer)}</span>
                </div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <MapPin className="h-3 w-3 mr-1" />
                  <span>{photographer.address_detail}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={handleShareProfile}>
                <Share2 className="h-4 w-4 mr-2" />
                Chia sẻ
              </Button>
              <Button size="sm" onClick={handleBookingClick}>
                <Calendar className="h-4 w-4 mr-2" />
                Đặt lịch
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-64 relative z-10 pb-20">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Profile Info */}
          <div className="lg:w-1/3">
            <Card className=" border-none shadow-2xl backdrop-blur-sm">
              <div className="relative">
                <div className="absolute -top-32 left-1/2 transform -translate-x-1/2">
                  <div className="relative w-48 h-48 rounded-full border-4 border-background overflow-hidden bg-background shadow-xl z-40">
                    <Avatar className="w-full h-full">
                      <AvatarImage 
                        src={photographer.avatar || "/placeholder.svg"} 
                        alt={photographer.full_name}
                        className="object-cover"
                      />
                      <AvatarFallback className="text-4xl">{photographer.full_name.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </div>
                </div>
                <CardHeader className="pt-20 pb-6 text-center">
                  <CardTitle className="text-3xl font-bold">{photographer.full_name}</CardTitle>
                  <div className="flex items-center justify-center gap-1 mt-2 text-muted-foreground">
                    {/* <span><MapPin className="h-4 w-4" /></span> */}
                    <span className="text-sm">{formatLocation(photographer)}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-2 text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span className="text-sm">Địa chỉ: {photographer.address_detail}</span>
                  </div>
                  {photographer.average_rating > 0 && (
                    <div className="flex items-center justify-center gap-1 mt-2">
                      <div className="flex">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-5 w-5 ${
                              i < Math.floor(photographer.average_rating)
                                ? "text-yellow-400 fill-yellow-400"
                                : "text-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                      <span className="text-sm font-medium ml-2">
                        {photographer.average_rating.toFixed(1)} ({photographer.total_reviews} đánh giá)
                      </span>
                    </div>
                  )}
                  <div className="flex justify-center gap-2 mt-4">
                    <Badge variant="secondary" className="font-normal text-sm px-3 py-1.5">
                      <Camera className="h-3.5 w-3.5 mr-1.5" />
                      Nhiếp ảnh gia
                    </Badge>
                    {photographer && (
                      <Badge variant="default" className="bg-blue-500 hover:bg-blue-600 font-normal text-sm px-3 py-1.5">
                        <CheckCircle className="h-3.5 w-3.5 mr-1.5" />
                        Đã xác thực
                      </Badge>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="px-6 pb-6">
                  <div className="grid grid-cols-2 gap-4 mb-8">
                    <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="text-2xl font-bold text-primary mb-1">{photographer.experience_years}</div>
                      <div className="text-xs text-muted-foreground">Năm kinh nghiệm</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="text-2xl font-bold text-primary mb-1">{photographer.total_bookings}</div>
                      <div className="text-xs text-muted-foreground">Lượt đặt</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="text-2xl font-bold text-primary mb-1">{photographer.followers_count}</div>
                      <div className="text-xs text-muted-foreground">Người theo dõi</div>
                    </div>
                    <div className="text-center p-4 bg-gradient-to-br from-primary/5 to-primary/10 rounded-xl hover:shadow-md transition-all duration-300">
                      <div className="text-xl font-bold text-primary mb-1">
                        {formatPrice(photographer.price_per_hour)}
                      </div>
                      <div className="text-xs text-muted-foreground">Mỗi giờ</div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-4">
                    <Button
                      className="w-full py-6 text-base font-medium shadow-lg hover:shadow-xl transition-all duration-300"
                      size="lg"
                      onClick={handleBookingClick}
                    >
                      <Calendar className="h-5 w-5 mr-2" />
                      Đặt lịch ngay
                    </Button>

                    <div className="flex gap-2">
                      <Button
                        variant={isFollowing ? "outline" : "secondary"}
                        className="flex-1 py-6 font-medium"
                        onClick={handleFollowToggle}
                        disabled={isFollowLoading || !isAuthenticated}
                      >
                        {isFollowLoading ? (
                          <Loader2 className="h-5 w-5 animate-spin mr-2" />
                        ) : (
                          <Heart className={`h-5 w-5 mr-2 ${isFollowing ? "fill-primary text-primary" : ""}`} />
                        )}
                        {isFollowing ? "Đang theo dõi" : "Theo dõi"}
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-[50px] w-[50px]"
                              onClick={handleShareProfile}
                            >
                              <Share2 className="h-5 w-5" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>Chia sẻ hồ sơ</TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  </div>
                </CardContent>
              </div>
            </Card>

            {/* Active Discounts */}
            {activeDiscounts.length > 0 && (
              <Card className="mt-8 border-none shadow-xl overflow-hidden bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20">
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl flex items-center text-green-800 dark:text-green-400">
                    <Gift className="h-6 w-6 mr-2 text-green-600 dark:text-green-400" />
                    <span>Mã giảm giá</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 px-6">
                  {activeDiscounts.slice(0, 3).map((discount) => {
                    const status = getDiscountStatus(discount)
                    const isActive = status === "active"

                    return (
                      <div
                        key={discount.id}
                        className="flex items-center justify-between p-4 bg-white dark:bg-background rounded-xl border border-green-100 dark:border-green-900 hover:shadow-md transition-all duration-300"
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-2.5 rounded-lg ${
                              discount.discount_type === "percent"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                            }`}
                          >
                            {discount.discount_type === "percent" ? (
                              <Percent className="h-5 w-5" />
                            ) : (
                              <Tag className="h-5 w-5" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{formatDiscountValue(discount)}</p>
                            <p className="text-xs text-muted-foreground line-clamp-1">{discount.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleSaveDiscount(discount.code)}
                                  disabled={!isActive || discount.is_saved}
                                >
                                  <Save className={`h-4 w-4 ${discount.is_saved ? "text-muted-foreground" : ""}`} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {discount.is_saved 
                                  ? "Đã lưu mã giảm giá" 
                                  : isActive 
                                    ? "Lưu mã giảm giá" 
                                    : "Mã giảm giá không khả dụng"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleCopyDiscountCode(discount.code)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Sao chép mã</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleViewDiscount(discount)}
                                >
                                  <Info className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>Xem chi tiết</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    )
                  })}
                  {activeDiscounts.length > 3 && (
                    <Button
                      variant="ghost"
                      className="w-full text-green-700 hover:text-green-800 hover:bg-green-100 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/30 font-medium"
                      onClick={() => {
                        setSelectedDiscount(null)
                        setIsDiscountDialogOpen(true)
                      }}
                    >
                      Xem tất cả {activeDiscounts.length} mã giảm giá
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Photographer Tags */}
            {photographer.tags && photographer.tags.length > 0 && (
              <Card className="mt-8 border-none shadow-xl overflow-hidden">
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl flex items-center">
                    <Tag className="h-6 w-6 mr-2 text-primary" />
                    <span>Phong cách chụp ảnh</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6">
                  <div className="flex flex-wrap gap-2">
                    {photographer.tags.map((tag, index) => (
                      <Badge
                        key={index}
                        variant="outline"
                        className="px-4 py-1.5 text-sm bg-primary/5 hover:bg-primary/10 transition-colors"
                      >
                        <Link href={`/search?max_price=1000000&sort_by=rating&tag=${tag}`}>
                          {tag}
                        </Link>
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Social Media Links */}
            {photographer.social_media_links && Object.keys(photographer.social_media_links).length > 0 && (
              <Card className="mt-8 border-none shadow-xl overflow-hidden">
                <CardHeader className="pb-2 pt-6">
                  <CardTitle className="text-xl flex items-center">
                    <Globe className="h-6 w-6 mr-2 text-primary" />
                    <span>Liên kết mạng xã hội</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 pb-6">
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(photographer.social_media_links).map(([platform, url]) => (
                      <a
                        key={platform}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2.5 bg-muted hover:bg-muted/80 rounded-xl text-sm font-medium transition-all duration-300 hover:shadow-sm"
                      >
                        {SocialMediaIcons[platform.toLowerCase()] || <ExternalLink className="h-5 w-5" />}
                        <span className="capitalize">{platform}</span>
                      </a>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Content */}
          <div className="lg:w-2/3 space-y-8">
            {/* About Section */}
            <Card className="overflow-hidden border-none shadow-xl backdrop-blur-sm">
              <CardHeader className="pb-2 pt-6">
                <CardTitle className="text-2xl flex items-center">
                  <Info className="h-6 w-6 mr-2 text-primary" />
                  Giới thiệu
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 pb-6">
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  {photographer.bio ? (
                    <p className="whitespace-pre-line text-base leading-relaxed">{photographer.bio}</p>
                  ) : (
                    <p className="text-muted-foreground italic">Nhiếp ảnh gia chưa cập nhật thông tin giới thiệu.</p>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Tabs for Photos and Services */}
            <Tabs defaultValue="photos" value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3 p-1 bg-muted/50 rounded-xl h-14">
                <TabsTrigger
                  value="photos"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 h-12 text-base"
                >
                  <ImageIcon className="h-5 w-5 mr-2" />
                  Ảnh đáng chú ý
                </TabsTrigger>
                <TabsTrigger
                  value="services"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 h-12 text-base"
                >
                  <BookOpen className="h-5 w-5 mr-2" />
                  Dịch vụ
                </TabsTrigger>
                <TabsTrigger
                  value="reviews"
                  className="rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-md transition-all duration-300 h-12 text-base"
                >
                  <Star className="h-5 w-5 mr-2" />
                  Đánh giá
                </TabsTrigger>
              </TabsList>

              {/* Photos Tab */}
              <TabsContent value="photos" className="mt-6">
                {photographer.featured_photos && photographer.featured_photos.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {photographer.featured_photos.map((photo) => (
                      <div
                        key={photo.featured_photo_id}
                        className="group relative aspect-square rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer"
                        onClick={() => handleViewImage(photo)}
                      >
                        <Image
                          src={photo.image_url || "/placeholder.svg"}
                          alt={photo.title || "Featured photo"}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-6 flex flex-col justify-end">
                          <h3 className="text-white text-xl font-semibold mb-2">{photo.title}</h3>
                          {photo.description && (
                            <p className="text-white/90 text-sm line-clamp-2">{photo.description}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/30 rounded-2xl">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-xl font-medium mb-2">Chưa có ảnh nổi bật</h3>
                    <p className="text-muted-foreground">Nhiếp ảnh gia chưa thêm ảnh nổi bật nào.</p>
                  </div>
                )}
              </TabsContent>

              {/* Services Tab */}
              <TabsContent value="services" className="mt-6">
                {photographer.services && photographer.services.length > 0 ? (
                  <div className="space-y-6">
                    {photographer.services.map((service) => (
                      <Card
                        key={service.service_id}
                        className="overflow-hidden border-none shadow-xl hover:shadow-2xl transition-all duration-300 group"
                      >
                        <div className="flex flex-col md:flex-row">
                          <div className="relative h-60 md:h-auto md:w-1/3 md:max-w-[240px]">
                            <Image
                              src={service.thumbnail_url || "/placeholder.svg"}
                              alt={service.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent md:bg-gradient-to-t md:from-black/50 md:to-transparent opacity-30"></div>
                          </div>
                          <div className="flex-1 p-6">
                            <div className="flex flex-col h-full">
                              <div>
                                <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                                <p className="text-muted-foreground mb-6 line-clamp-3 leading-relaxed">
                                  {service.description}
                                </p>
                              </div>
                              <div className="mt-auto flex flex-wrap items-center gap-6">
                                <Badge
                                  variant="outline"
                                  className="bg-primary/10 text-primary px-4 py-1.5 text-base font-medium"
                                >
                                  {formatPrice(service.price)}
                                </Badge>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 flex items-end">
                            <Button
                              size="lg"
                              className="group-hover:bg-primary group-hover:text-white transition-colors duration-300"
                              onClick={() => handleViewService(service)}
                            >
                              Xem chi tiết
                              <ArrowRight className="h-4 w-4 ml-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/30 rounded-2xl">
                    <BookOpen className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-xl font-medium mb-2">Chưa có dịch vụ</h3>
                    <p className="text-muted-foreground">Nhiếp ảnh gia chưa thêm dịch vụ nào.</p>
                  </div>
                )}
              </TabsContent>

              {/* Reviews Tab */}
              <TabsContent value="reviews" className="mt-6">
                {isReviewsLoading ? (
                  <div className="flex flex-col items-center justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <p className="text-muted-foreground">Đang tải đánh giá...</p>
                  </div>
                ) : reviews.length > 0 ? (
                  <div className="space-y-6">
                    {reviews.map((review) => (
                      <Card key={review.review_id} className="overflow-hidden border-none shadow-xl">
                        <CardContent className="p-6">
                          <div className="flex items-start gap-4">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={review.customer_avatar || "/placeholder.svg"} alt={review.customer_name || "User"} />
                              <AvatarFallback>{review.customer_name?.[0] || "U"}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <div>
                                  <h4 className="font-semibold">{review.customer_name || "Khách hàng"}</h4>
                                  <p className="text-sm text-muted-foreground">
                                    {format(parseISO(review.created_at), "dd/MM/yyyy", { locale: vi })}
                                  </p>
                                </div>
                                <div className="flex items-center gap-1">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-5 w-5 ${
                                        i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                      }`}
                                    />
                                  ))}
                                </div>
                              </div>
                              <p className="text-base leading-relaxed whitespace-pre-line">{review.comment}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-16 bg-muted/30 rounded-2xl">
                    <Star className="h-16 w-16 text-muted-foreground mx-auto mb-6" />
                    <h3 className="text-xl font-medium mb-2">Chưa có đánh giá</h3>
                    <p className="text-muted-foreground">Chưa có đánh giá nào cho nhiếp ảnh gia này.</p>
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      {/* Discount Dialog */}
      <Dialog open={isDiscountDialogOpen} onOpenChange={setIsDiscountDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-2xl">Mã giảm giá từ {photographer.full_name}</DialogTitle>
            <DialogDescription>
              {selectedDiscount ? "Sử dụng mã giảm giá này khi đặt lịch với nhiếp ảnh gia" : "Danh sách mã giảm giá từ nhiếp ảnh gia"}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="max-h-[60vh] pr-4">
            <div className="space-y-5 py-2">
              {selectedDiscount ? (
                (() => {
                  const status = getDiscountStatus(selectedDiscount)
                  const isActive = status === "active"

                  return (
                    <div
                      className={`p-5 rounded-xl border ${
                        isActive
                          ? "border-green-200 bg-green-50/50 dark:bg-green-950/10"
                          : "border-gray-200 bg-gray-50/50 dark:bg-gray-800/10"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div className="flex items-center gap-3">
                          <div
                            className={`p-3 rounded-xl ${
                              selectedDiscount.discount_type === "percent"
                                ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                            }`}
                          >
                            {selectedDiscount.discount_type === "percent" ? (
                              <Percent className="h-6 w-6" />
                            ) : (
                              <Tag className="h-6 w-6" />
                            )}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{formatDiscountValue(selectedDiscount)}</h3>
                            <p className="text-sm text-muted-foreground">{selectedDiscount.description}</p>
                          </div>
                        </div>
                        <Badge variant={getStatusBadgeVariant(status)} className="text-sm px-3 py-1">
                          {translateStatus(status)}
                        </Badge>
                      </div>

                      <div className="bg-background dark:bg-muted p-4 rounded-lg flex items-center justify-between mb-4">
                        <code className="font-mono font-semibold text-lg">{selectedDiscount.code}</code>
                        <div className="flex items-center gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10"
                                  onClick={() => handleSaveDiscount(selectedDiscount.code)}
                                  disabled={!isActive || selectedDiscount.is_saved}
                                >
                                  <Save className={`h-5 w-5 ${selectedDiscount.is_saved ? "text-muted-foreground" : ""}`} />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                {selectedDiscount.is_saved 
                                  ? "Đã lưu mã giảm giá" 
                                  : isActive 
                                    ? "Lưu mã giảm giá" 
                                    : "Mã giảm giá không khả dụng"}
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-10 w-10"
                                  onClick={() => handleCopyDiscountCode(selectedDiscount.code)}
                                  disabled={!isActive}
                                >
                                  <Copy className="h-5 w-5" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>{isActive ? "Sao chép mã" : "Mã giảm giá không khả dụng"}</TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>

                      <div className="space-y-3 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Thời hạn:</span>
                          <span className="font-medium">
                            {format(parseISO(selectedDiscount.valid_from), "dd/MM/yyyy", { locale: vi })} -{" "}
                            {format(parseISO(selectedDiscount.valid_to), "dd/MM/yyyy", { locale: vi })}
                          </span>
                        </div>
                        {isActive && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Thời gian còn lại:</span>
                              <span className="text-green-600 font-medium">
                                {(() => {
                                  const now = new Date()
                                  const validTo = parseISO(selectedDiscount.valid_to)
                                  const diffTime = Math.abs(validTo.getTime() - now.getTime())
                                  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                  return `${diffDays} ngày`
                                })()}
                              </span>
                            </div>
                            <Progress
                              value={(() => {
                                const now = new Date()
                                const validFrom = parseISO(selectedDiscount.valid_from)
                                const validTo = parseISO(selectedDiscount.valid_to)
                                const total = validTo.getTime() - validFrom.getTime()
                                const elapsed = now.getTime() - validFrom.getTime()
                                return Math.min(100, Math.max(0, (elapsed / total) * 100))
                              })()}
                              className="h-2"
                            />
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Số lần sử dụng:</span>
                          <span className="font-medium">
                            {selectedDiscount.current_uses}/{selectedDiscount.max_uses}
                          </span>
                        </div>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <>
                  {discounts.map((discount) => {
                    const status = getDiscountStatus(discount)
                    const isActive = status === "active"

                    return (
                      <div
                        key={discount.id}
                        className={`p-5 rounded-xl border ${
                          isActive
                            ? "border-green-200 bg-green-50/50 dark:bg-green-950/10"
                            : "border-gray-200 bg-gray-50/50 dark:bg-gray-800/10"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`p-3 rounded-xl ${
                                discount.discount_type === "percent"
                                  ? "bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300"
                                  : "bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300"
                              }`}
                            >
                              {discount.discount_type === "percent" ? (
                                <Percent className="h-6 w-6" />
                              ) : (
                                <Tag className="h-6 w-6" />
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{formatDiscountValue(discount)}</h3>
                              <p className="text-sm text-muted-foreground">{discount.description}</p>
                            </div>
                          </div>
                          <Badge variant={getStatusBadgeVariant(status)} className="text-sm px-3 py-1">
                            {translateStatus(status)}
                          </Badge>
                        </div>

                        <div className="bg-background dark:bg-muted p-4 rounded-lg flex items-center justify-between mb-4">
                          <code className="font-mono font-semibold text-lg">{discount.code}</code>
                          <div className="flex items-center gap-2">
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={() => handleSaveDiscount(discount.code)}
                                    disabled={!isActive || discount.is_saved}
                                  >
                                    <Save className={`h-5 w-5 ${discount.is_saved ? "text-muted-foreground" : ""}`} />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                  {discount.is_saved 
                                    ? "Đã lưu mã giảm giá" 
                                    : isActive 
                                      ? "Lưu mã giảm giá" 
                                      : "Mã giảm giá không khả dụng"}
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={() => handleCopyDiscountCode(discount.code)}
                                  >
                                    <Copy className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Sao chép mã</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-10 w-10"
                                    onClick={() => handleViewDiscount(discount)}
                                  >
                                    <Info className="h-5 w-5" />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent>Xem chi tiết</TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>

                        <div className="space-y-3 text-sm">
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Thời hạn:</span>
                            <span className="font-medium">
                              {format(parseISO(discount.valid_from), "dd/MM/yyyy", { locale: vi })} -{" "}
                              {format(parseISO(discount.valid_to), "dd/MM/yyyy", { locale: vi })}
                            </span>
                          </div>
                          {isActive && (
                            <div>
                              <div className="flex justify-between text-sm mb-1">
                                <span className="text-muted-foreground">Thời gian còn lại:</span>
                                <span className="text-green-600 font-medium">
                                  {(() => {
                                    const now = new Date()
                                    const validTo = parseISO(discount.valid_to)
                                    const diffTime = Math.abs(validTo.getTime() - now.getTime())
                                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                    return `${diffDays} ngày`
                                  })()}
                                </span>
                              </div>
                              <Progress
                                value={(() => {
                                  const now = new Date()
                                  const validFrom = parseISO(discount.valid_from)
                                  const validTo = parseISO(discount.valid_to)
                                  const total = validTo.getTime() - validFrom.getTime()
                                  const elapsed = now.getTime() - validFrom.getTime()
                                  return Math.min(100, Math.max(0, (elapsed / total) * 100))
                                })()}
                                className="h-2"
                              />
                            </div>
                          )}
                          <div className="flex justify-between">
                            <span className="text-muted-foreground">Số lần sử dụng:</span>
                            <span className="font-medium">
                              {discount.current_uses}/{discount.max_uses}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </>
              )}
            </div>
          </ScrollArea>
          {selectedDiscount && (
            <div className="mt-4 flex justify-end">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedDiscount(null)
                  setIsDiscountDialogOpen(true)
                }}
              >
                Xem tất cả mã giảm giá
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Image Dialog */}
      <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
        <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Xem ảnh chi tiết</DialogTitle>
          </DialogHeader>
          <div className="bg-background rounded-xl overflow-hidden">
            {selectedImage && (
              <>
                <div className="relative w-full h-[400px] sm:h-[400px] mt-6">
                  <Image
                    src={selectedImage.url || "/placeholder.svg"}
                    alt={selectedImage.title || "Featured photo"}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="p-4 sm:p-6">
                  <h3 className="text-xl sm:text-2xl font-bold">{selectedImage.title}</h3>
                  {selectedImage.description && (
                    <p className="text-muted-foreground mt-2">{selectedImage.description}</p>
                  )}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Service Dialog */}
      <Dialog open={isServiceDialogOpen} onOpenChange={setIsServiceDialogOpen}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto p-0 bg-transparent border-none shadow-none">
          <DialogHeader className="sr-only">
            <DialogTitle>Chi tiết dịch vụ</DialogTitle>
          </DialogHeader>
          <div className="bg-background rounded-xl overflow-hidden">
            {selectedService && (
              <>
                <div className="relative w-full h-[250px] sm:h-[350px]">
                  <Image
                    src={selectedService.thumbnail_url || "/placeholder.svg"}
                    alt={selectedService.title}
                    fill
                    className="object-cover rounded-t-xl"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
                    <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2">{selectedService.title}</h3>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 backdrop-blur-sm text-white border-none hover:bg-white/30"
                    >
                      {formatPrice(selectedService.price)}
                    </Badge>
                  </div>
                </div>
                <div className="p-4 sm:p-6 space-y-6">
                  <div className="prose prose-base sm:prose-lg dark:prose-invert max-w-none">
                    <p className="text-base leading-relaxed whitespace-pre-line">{selectedService.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {selectedService.duration && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Clock className="h-5 w-5" />
                        <span>Thời lượng: {selectedService.duration}</span>
                      </div>
                    )}
                    {selectedService.bookings_count !== undefined && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Users className="h-5 w-5" />
                        <span>Đã đặt: {selectedService.bookings_count}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex justify-end gap-4 pt-4">
                    <Button variant="outline" onClick={() => setIsServiceDialogOpen(false)}>
                      Đóng
                    </Button>
                    {/* <Button asChild>
                      <Link href={`/booking/${photographer.slug}?service=${selectedService.service_id}`}>
                        Đặt lịch ngay
                        <Calendar className="h-4 w-4 ml-2" />
                      </Link>
                    </Button> */}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <Toaster position="bottom-right">
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button onClick={() => toast.dismiss(t.id)}>X</button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  )
}