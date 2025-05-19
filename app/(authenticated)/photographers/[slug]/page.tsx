"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Loader2, Tag, Globe } from "lucide-react"
import { photographerService, type Photographer } from "@/services/photographer.service"
import { checkFollowStatus, followPhotographer, unfollowPhotographer } from "@/services/follow.service"
import { useAuth } from "@/services/auth"
import toast, { Toaster, ToastBar } from "react-hot-toast"

export default function PhotographerDetail() {
  const params = useParams()
  const [photographer, setPhotographer] = useState<Photographer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFollowing, setIsFollowing] = useState(false)
  const [isFollowLoading, setIsFollowLoading] = useState(false)
  const { user, isAuthenticated } = useAuth()

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await photographerService.getPhotographerBySlug(params.slug as string)
        setPhotographer(response)
        // console.log(response)

        if (isAuthenticated && user) {
          const followStatus = await checkFollowStatus(response.photographer_id)
          setIsFollowing(followStatus.is_following)
          console.log(followStatus)
        }

      } catch (err) {
        setError("Failed to load photographer details. Please try again later.")
        console.error("Error fetching photographer:", err)
        toast.error("Lỗi khi tải thông tin nhiếp ảnh gia. Vui lòng thử lại sau.")
      } finally {
        setLoading(false)
      }
    }

    if (params.slug) {
      fetchPhotographer()
    }
  }, [params.slug])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatLocation = (photographer: Photographer) => {
    const parts = [
      photographer.ward,
      photographer.district,
      photographer.province
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : "Chưa cập nhật";
  }

  const handleFollowToggle = async () => {
    if (!isAuthenticated || !user || !photographer) return;
    
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
    } finally {
      setIsFollowLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Đang tải thông tin...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (!photographer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Nhiếp ảnh gia không tồn tại</h1>
          <p className="text-muted-foreground mb-4">The photographer you are looking for doesn&apos;t exist.</p>
          <Button asChild>
            <Link href="/photographers">Back to Photographers</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative h-[400px] rounded-xl overflow-hidden mb-8">
        <Image
          src={photographer.background_image || photographer.avatar || "/placeholder.svg"}
          alt={photographer.full_name}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="flex items-end gap-6">
            <div className="relative h-32 w-32 rounded-full overflow-hidden border-4 border-white">
              <Image
                src={photographer.avatar || "/placeholder.svg"}
                alt={photographer.full_name}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 text-white">
              <div className="flex items-center justify-between mb-2">
                <h1 className="text-4xl font-bold">{photographer.full_name}</h1>
                {isAuthenticated && user && (
                  <Button
                    variant={isFollowing ? "secondary" : "default"}
                    onClick={handleFollowToggle}
                    disabled={isFollowLoading}
                    className="min-w-[120px]"
                  >
                    {isFollowLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : null}
                    {isFollowing ? "Đã theo dõi" : "Theo dõi"}
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{formatLocation(photographer)}</span>
                </div>
                </div>
                {photographer.average_rating > 0 && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                    <span>{photographer.average_rating.toFixed(1)} ({photographer.total_reviews} reviews)</span>
                  </div>
                )}
              <Badge> Nhiếp ảnh gia</Badge>
            </div>
            
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Info & Stats */}
        <div className="lg:col-span-2 space-y-8">
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">About</h2>
              <p className="text-muted-foreground whitespace-pre-line break-words">{photographer.bio}</p>
              
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{photographer.experience_years}</div>
                  <div className="text-sm text-muted-foreground">Năm kinh nghiệm</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{photographer.total_bookings}</div>
                  <div className="text-sm text-muted-foreground">Tổng lượt đặt</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{photographer.followers_count}</div>
                  <div className="text-sm text-muted-foreground">Người theo dõi</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formatPrice(photographer.price_per_hour)}</div>
                  <div className="text-sm text-muted-foreground">Mỗi giờ</div>
                </div>
              </div>

              { photographer.social_media_links && (
                  <div className="space-y-2 mt-6">
                    <h3 className="text-sm font-medium flex items-center gap-2">
                      <Globe className="h-4 w-4 text-primary" /> Liên kết mạng xã hội
                    </h3>
                    {Object.keys(photographer.social_media_links).length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(photographer.social_media_links).map(
                          ([platform, url]) => (
                            <a
                              key={platform}
                              href={url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1 bg-muted rounded-full text-sm hover:bg-muted/80 transition-colors"
                            >
                              <span>{platform}</span>
                            </a>
                          )
                        )}
                      </div>
                    ) : (
                      <p className="text-sm text-muted-foreground">
                        Chưa cập nhật liên kết mạng xã hội
                      </p>
                    )}
                  </div>
                )}
            </CardContent>
          </Card>

          {photographer.tags && photographer.tags.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Phong cách chụp ảnh</h2>
                <div className="flex flex-wrap gap-2">
                  {photographer.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-3 py-1">
                      <Tag className="h-3 w-3 mr-1" />
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Tabs defaultValue="photos" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="photos">Ảnh đáng chú ý</TabsTrigger>
              <TabsTrigger value="services">Dịch vụ của tôi</TabsTrigger>
            </TabsList>
            <TabsContent value="photos" className="mt-4">
              {photographer.featured_photos && photographer.featured_photos.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {photographer.featured_photos.map((photo) => (
                    <div
                      key={photo.featured_photo_id}
                      className="relative aspect-square rounded-lg overflow-hidden group shadow-md"
                    >
                      <Image
                        src={photo.image_url || "/placeholder.svg"}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-4 flex flex-col justify-end">
                        <h3 className="text-white text-lg font-semibold">{photo.title}</h3>
                        <p className="text-white/90 text-sm line-clamp-2">{photo.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Không có ảnh nổi bật
                </div>
              )}
            </TabsContent>
            <TabsContent value="services" className="mt-4">
              {photographer.services && photographer.services.length > 0 ? (
                <div className="grid gap-4">
                  {photographer.services.map((service) => (
                    <Card key={service.service_id}>
                      <CardContent className="p-4">
                        <div className="flex gap-4">
                          <div className="relative h-24 w-24 rounded-lg overflow-hidden flex-shrink-0">
                            <Image
                              src={service.thumbnail_url || "/placeholder.svg"}
                              alt={service.title}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold mb-1">{service.title}</h3>
                            <p className="text-sm text-muted-foreground mb-2 whitespace-pre-line break-words">{service.description}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                {formatPrice(service.price)}
                              </Badge>
                              <Button variant="outline" size="sm">Xem chi tiết</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Không có dịch vụ nào
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Đặt ngay</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Base Rate</span>
                  <span className="font-semibold">{formatPrice(photographer.price_per_hour)}/giờ</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Kinh nghiệm</span>
                  <span>{photographer.experience_years} năm</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Đã đặt</span>
                  <span>{photographer.total_bookings}</span>
                </div>
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href={`/booking/${photographer.slug}`}>ĐẶT NGAY</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
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