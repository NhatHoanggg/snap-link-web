"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { getServiceById, updateService } from "@/services/services.service"
import { ArrowLeft, Camera } from "lucide-react"
import { toast } from "sonner"
import { use } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Image from "next/image"

interface EditServicePageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditServicePage({ params }: EditServicePageProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    thumbnail_url: "",
    is_active: true,
    unit_type: "",
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
          unit_type: service.unit_type,
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
        unit_type: formData.unit_type,
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

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "snaplink"
    );

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();
      console.log("Uploaded image URL:", data.secure_url);

      setFormData(prev => ({ ...prev, thumbnail_url: data.secure_url }));
      toast.success("Tải ảnh lên thành công");
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Tải ảnh lên thất bại");
    } finally {
      setUploading(false);
    }
  };

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

        {/* <div className="space-y-2">
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
        </div> */}
        <div className="space-y-2">
          <Label htmlFor="description">Mô tả</Label>
          <Textarea
            className="h-48 whitespace-pre-line break-words"
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Nhập mô tả dịch vụ"
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
          <Label htmlFor="unit_type">Đơn vị</Label>
          <Select
            name="unit_type"
            value={formData.unit_type}
            onValueChange={(value) => setFormData({ ...formData, unit_type: value })}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn đơn vị" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="package">Gói</SelectItem>
              <SelectItem value="person">Người</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Ảnh bìa</Label>
          <div className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg overflow-hidden">
            {formData.thumbnail_url ? (
              <Image
                src={formData.thumbnail_url}
                alt="Thumbnail preview"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-500">
                Chưa có ảnh bìa
              </div>
            )}
            <input
              type="file"
              id="thumbnail"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="absolute bottom-2 right-2 bg-white/80 hover:bg-white"
              onClick={() => document.getElementById("thumbnail")?.click()}
              disabled={uploading}
            >
              {uploading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
              ) : (
                <Camera className="h-4 w-4" />
              )}
            </Button>
          </div>
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