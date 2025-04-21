"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
// import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Star, Clock, Calendar, Loader2 } from "lucide-react"
import { photographerService, type Photographer } from "@/lib/services/photographer.service"

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
            <Link href="/search">Back to Search</Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="relative h-[400px] rounded-lg overflow-hidden">
            <Image
              src={photographer.avatar || "/placeholder.svg"}
              alt={photographer.full_name}
              fill
              className="object-cover"
            />
            {photographer.average_rating > 0 && (
              <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-3 py-1.5 rounded-md flex items-center">
                <Star className="h-4 w-4 mr-1 text-yellow-400 fill-yellow-400" />
                {photographer.average_rating.toFixed(1)}
              </div>
            )}
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex items-center text-sm">
              <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{photographer.location ?? "Chưa cập nhật"}</span>
            </div>

            <div className="flex items-center text-sm">
              <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{photographer.experience_years} năm kinh nghiệm</span>
            </div>

            <div className="flex items-center text-sm">
              <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
              <span>{photographer.total_bookings} bookings</span>
            </div>

            <div className="mt-4">
              <Badge className="bg-primary text-primary-foreground text-lg px-4 py-2">
                {formatPrice(photographer.price_per_hour)}/hour
              </Badge>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{photographer.full_name}</h1>
            <p className="text-muted-foreground">{photographer.bio}</p>
          </div>

          {photographer.portfolio?.featured_photos && photographer.portfolio.featured_photos.length > 0 && (
            <div>
              <h2 className="text-xl font-semibold mb-4">Featured Photos</h2>
              <div className="grid grid-cols-2 gap-4">
                {photographer.portfolio.featured_photos.map((photo) => (
                  <div key={photo.featured_photo_id} className="relative h-48 rounded-lg overflow-hidden">
                    <Image
                      src={photo.image_url || "/placeholder.svg"}
                      alt={photo.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-4">
            <Button asChild className="w-full">
              <Link href={`/booking/${photographer.slug}`}>Book Now</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 