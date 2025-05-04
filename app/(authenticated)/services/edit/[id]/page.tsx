"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getServiceById, updateService } from "@/services/services.service"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"
import { use } from "react"

interface EditServicePageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail_url: "",
    is_active: true,
  })

  const resolvedParams = use(params)
  const serviceId = parseInt(resolvedParams.id)

  useEffect(() => {
    const fetchService = async () => {
      try {
        const service = await getServiceById(serviceId)
        setFormData({
          title: service.title,
          description: service.description,
          price: service.price.toString(),
          thumbnail_url: service.thumbnail_url,
          is_active: service.is_active,
        })
      } catch (error) {
        console.error("Error fetching service:", error)
        toast.error("Không thể tải thông tin dịch vụ")
        router.push("/services")
      }
    }

    fetchService()
  }, [serviceId, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await updateService(serviceId, {
        ...formData,
        price: parseFloat(formData.price),
        service_id: serviceId,
        photographer_id: 0, // Will be set by backend
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })

      toast.success("Cập nhật dịch vụ thành công")
      router.push("/services")
    } catch (error) {
      console.error("Error updating service:", error)
      toast.error("Có lỗi xảy ra khi cập nhật dịch vụ")
    } finally {
      setIsLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container max-w-2xl py-8">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">Chỉnh sửa dịch vụ</h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Tên dịch vụ</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Nhập tên dịch vụ"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả dịch vụ"
            required
            rows={4}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="price">Giá (VNĐ)</Label>
          <Input
            id="price"
            name="price"
            type="number"
            value={formData.price}
            onChange={handleChange}
            placeholder="Nhập giá dịch vụ"
            required
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="thumbnail_url">URL ảnh bìa</Label>
          <Input
            id="thumbnail_url"
            name="thumbnail_url"
            value={formData.thumbnail_url}
            onChange={handleChange}
            placeholder="Nhập URL ảnh bìa"
            required
          />
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Hủy
          </Button>
          <Button type="submit" disabled={isLoading}>
            {isLoading ? "Đang cập nhật..." : "Cập nhật"}
          </Button>
        </div>
      </form>
    </div>
  )
} 