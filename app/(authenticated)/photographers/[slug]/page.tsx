"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { MapPin, Star, Loader2, Tag } from "lucide-react"
import { photographerService, type Photographer } from "@/services/photographer.service"

export default function PhotographerDetail() {
  const params = useParams()
  const [photographer, setPhotographer] = useState<Photographer | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchPhotographer = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await photographerService.getPhotographerBySlug(params.slug as string)
        setPhotographer(response)
      } catch (err) {
        setError("Failed to load photographer details. Please try again later.")
        console.error("Error fetching photographer:", err)
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

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading photographer details...</p>
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
          <h1 className="text-2xl font-bold mb-2">Photographer not found</h1>
          <p className="text-muted-foreground mb-4">The photographer you&apos;re looking for doesn&apos;t exist.</p>
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
              <h1 className="text-4xl font-bold mb-2">{photographer.full_name}</h1>
              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{formatLocation(photographer)}</span>
                </div>
                {photographer.average_rating > 0 && (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                    <span>{photographer.average_rating.toFixed(1)} ({photographer.total_reviews} reviews)</span>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {photographer.social_media_links?.instagram && (
                <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 border-white/20">
                  <Link href={photographer.social_media_links.instagram} target="_blank">
                    <Image src="/media/instagram.svg" alt="Instagram" width={20} height={20} />
                  </Link>
                </Button>
              )}
              {photographer.social_media_links?.facebook && (
                <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 border-white/20">
                  <Link href={photographer.social_media_links.facebook} target="_blank">
                    <Image src="/media/facebook.svg" alt="Facebook" width={20} height={20} />
                  </Link>
                </Button>
              )}
              {photographer.social_media_links?.tiktok && (
                <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 border-white/20">
                  <Link href={photographer.social_media_links.tiktok} target="_blank">
                    {/* <tiktok className="h-4 w-4" /> */}
                    <Image src="/media/tiktok.svg" alt="tiktok" width={20} height={20} />
                  </Link>
                </Button>
              )}
              {photographer.social_media_links?.zalo && (
                <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 border-white/20">
                  <Link href={photographer.social_media_links.zalo} target="_blank">
                    {/* <zalo className="h-4 w-4" /> */}
                    <Image src="/media/zalo.svg" alt="zalo" width={20} height={20} />
                  </Link>
                </Button>
              )}
              {photographer.social_media_links?.linkedin && (
                <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 border-white/20">
                  <Link href={photographer.social_media_links.linkedin} target="_blank">
                    {/* <linkedin className="h-4 w-4" /> */}
                    <Image src="/media/linkedin.svg" alt="linkedin" width={20} height={20} />
                  </Link>
                </Button>
              )}
              {photographer.social_media_links?.twitter && (
                <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 border-white/20">
                  <Link href={photographer.social_media_links.twitter} target="_blank">
                    {/* <twitter className="h-4 w-4" /> */}
                    <Image src="/media/twitter.svg" alt="twitter" width={20} height={20} />
                  </Link>
                </Button>
              )}
              {photographer.social_media_links?.youtube && (
                <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 border-white/20">
                  <Link href={photographer.social_media_links.youtube} target="_blank">
                    {/* <Youtube className="h-4 w-4" /> */}
                    <Image src="/media/youtube.svg" alt="Youtube" width={20} height={20} />
                  </Link>
                </Button>
              )}
              {photographer.social_media_links?.reddit && (
                <Button variant="outline" size="icon" className="bg-white/10 hover:bg-white/20 border-white/20">
                  <Link href={photographer.social_media_links.reddit} target="_blank">
                    {/* <reddit className="h-4 w-4" /> */}
                    <Image src="/media/reddit.svg" alt="reddit" width={20} height={20} />
                  </Link>
                </Button>
              )}

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
              <p className="text-muted-foreground">{photographer.bio}</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{photographer.experience_years}</div>
                  <div className="text-sm text-muted-foreground">Years Experience</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{photographer.total_bookings}</div>
                  <div className="text-sm text-muted-foreground">Total Bookings</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{photographer.followers_count}</div>
                  <div className="text-sm text-muted-foreground">Followers</div>
                </div>
                <div className="text-center p-4 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-primary">{formatPrice(photographer.price_per_hour)}</div>
                  <div className="text-sm text-muted-foreground">Per Hour</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {photographer.tags && photographer.tags.length > 0 && (
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Specialties</h2>
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
              <TabsTrigger value="photos">Featured Photos</TabsTrigger>
              <TabsTrigger value="services">Services</TabsTrigger>
            </TabsList>
            <TabsContent value="photos" className="mt-4">
              {photographer.featured_photos && photographer.featured_photos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photographer.featured_photos.map((photo) => (
                    <div key={photo.featured_photo_id} className="relative aspect-square rounded-lg overflow-hidden group">
                      <Image
                        src={photo.image_url || "/placeholder.svg"}
                        alt={photo.title}
                        fill
                        className="object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-4 flex flex-col justify-end">
                        <h3 className="text-white font-medium">{photo.title}</h3>
                        <p className="text-white/80 text-sm">{photo.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No featured photos available
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
                            <p className="text-sm text-muted-foreground mb-2">{service.description}</p>
                            <div className="flex justify-between items-center">
                              <Badge variant="outline" className="bg-primary/10 text-primary">
                                {formatPrice(service.price)}
                              </Badge>
                              <Button variant="outline" size="sm">View Details</Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No services available
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Right Column - Booking Card */}
        <div className="lg:col-span-1">
          <Card className="sticky top-8">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Book a Session</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Base Rate</span>
                  <span className="font-semibold">{formatPrice(photographer.price_per_hour)}/hour</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Experience</span>
                  <span>{photographer.experience_years} years</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Total Bookings</span>
                  <span>{photographer.total_bookings}</span>
                </div>
                <div className="pt-4">
                  <Button asChild className="w-full">
                    <Link href={`/booking/${photographer.slug}`}>Book Now</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 