"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { createService } from "@/services/services.service"
import { ArrowLeft } from "lucide-react"
import { toast } from "sonner"

export default function CreateServicePage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail_url: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      await createService({
        ...formData,
        price: parseFloat(formData.price),
        is_active: true,
        service_id: 0, // Will be set by backend
        photographer_id: 0, // Will be set by backend
        created_at: new Date().toISOString(),
        updated_at: null,
      })

      toast.success("Tạo dịch vụ thành công")
      router.push("/services")
    } catch (error) {
      console.error("Error creating service:", error)
      toast.error("Có lỗi xảy ra khi tạo dịch vụ")
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
        <h1 className="text-2xl font-bold">Tạo dịch vụ mới</h1>
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
            {isLoading ? "Đang tạo..." : "Tạo dịch vụ"}
          </Button>
        </div>
      </form>
    </div>
  )
} 