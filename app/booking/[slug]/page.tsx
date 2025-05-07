"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { BookingForm } from "@/components/booking/booking-form"
import { getPhotographerServicesBySlug } from "@/services/services.service"
import { getAvailabilitiesBySlug } from "@/services/availability.service"
import type { Service } from "@/services/services.service"
import type { Availability } from "@/services/availability.service"
import { Loader2 } from "lucide-react"

export default function BookingPage() {
  const params = useParams()
  const [services, setServices] = useState<Service[]>([])
  const [availabilities, setAvailabilities] = useState<Availability[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)

        // Lấy danh sách dịch vụ của photographer
        const servicesData = await getPhotographerServicesBySlug(params.slug as string)
        setServices(servicesData)

        // Lấy lịch làm việc của photographer
        const availabilitiesData = await getAvailabilitiesBySlug(params.slug as string)
        setAvailabilities(availabilitiesData)
      } catch (err) {
        console.error("Error fetching data:", err)
        setError("Không thể tải dữ liệu. Vui lòng thử lại sau.")
      } finally {
        setIsLoading(false)
      }
    }

    if (params.slug) {
      fetchData()
    }
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-red-600 mb-2">Đã có lỗi xảy ra</h2>
          <p className="text-muted-foreground">{error}</p>
        </div>
      </div>
    )
  }

  if (services.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-2">Không tìm thấy dịch vụ</h2>
          <p className="text-muted-foreground">Photographer này chưa có dịch vụ nào.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8">Đặt lịch chụp ảnh</h1>
        <BookingForm 
          services={services}
          availabilities={availabilities}
          photographerSlug={params.slug as string}
        />
      </div>
    </div>
  )
} 