"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogContent, DialogTrigger, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getFeaturedPhotos, createFeaturedPhoto, updateFeaturedPhoto, type FeaturedPhoto, deleteFeaturedPhoto } from "@/services/photo.service"
import { Plus, Camera, MoreVertical, Edit2, Trash2 } from "lucide-react"
import toast from "react-hot-toast"
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function FeaturedPhotos() {
  const [photos, setPhotos] = useState<FeaturedPhoto[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedPhoto, setSelectedPhoto] = useState<FeaturedPhoto | null>(null)
  const [newPhoto, setNewPhoto] = useState({
    title: "",
    description: "",
    image_url: ""
  })

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const data = await getFeaturedPhotos()
        setPhotos(data)
        setLoading(false)
      } catch (error) {
        console.error("Error fetching photos:", error)
        setLoading(false)
      }
    }

    fetchPhotos()
  }, [])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    const formData = new FormData()
    formData.append("file", file)
    formData.append(
      "upload_preset",
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "snaplink"
    )

    try {
      const response = await fetch(
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formData,
        }
      )

      const data = await response.json()
      setNewPhoto(prev => ({ ...prev, image_url: data.secure_url }))
      toast.success("Upload ảnh thành công")
    } catch (error) {
      console.error("Error uploading image:", error)
      toast.error("Upload ảnh thất bại")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async () => {
    if (!newPhoto.image_url || !newPhoto.title) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    try {
      const createdPhoto = await createFeaturedPhoto(newPhoto)
      setPhotos(prev => [createdPhoto, ...prev])
      setIsDialogOpen(false)
      setNewPhoto({ title: "", description: "", image_url: "" })
      toast.success("Thêm ảnh thành công")
    } catch (error) {
      console.error("Error creating photo:", error)
      toast.error("Thêm ảnh thất bại")
    }
  }

  const handleEdit = (photo: FeaturedPhoto) => {
    setSelectedPhoto(photo)
    setNewPhoto({
      title: photo.title,
      description: photo.description,
      image_url: photo.image_url
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = async () => {
    if (!selectedPhoto || !newPhoto.title) {
      toast.error("Vui lòng điền đầy đủ thông tin")
      return
    }

    try {
      const updatedPhoto = await updateFeaturedPhoto(selectedPhoto.featured_photo_id, {
        title: newPhoto.title,
        description: newPhoto.description,
        image_url: newPhoto.image_url
      })
      setPhotos(prev => prev.map(photo => 
        photo.featured_photo_id === selectedPhoto.featured_photo_id ? updatedPhoto : photo
      ))
      setIsEditDialogOpen(false)
      setSelectedPhoto(null)
      setNewPhoto({ title: "", description: "", image_url: "" })
      toast.success("Cập nhật ảnh thành công")
    } catch (error) {
      console.error("Error updating photo:", error)
      toast.error("Cập nhật ảnh thất bại")
    }
  }

  const handleDelete = async () => {
    if (!selectedPhoto) return

    try {
      await deleteFeaturedPhoto(selectedPhoto.featured_photo_id)
      setPhotos(prev => prev.filter(photo => photo.featured_photo_id !== selectedPhoto.featured_photo_id))
      setIsDeleteDialogOpen(false)
      setSelectedPhoto(null)
      toast.success("Xóa ảnh thành công")
    } catch (error) {
      console.error("Error deleting photo:", error)
      toast.error("Xóa ảnh thất bại")
    }
  }

  const formatDate = (date: Date) => {
    try {
      return format(date, "MMM d, yyyy")
    } catch (error) {
      console.error("Error formatting date:", error)
      return date.toString()
    }
  }

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-0">
              <Skeleton className="w-full h-[200px]" />
            </CardContent>
            <CardFooter className="flex flex-col items-start p-4">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2" />
            </CardFooter>
          </Card>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Thêm ảnh mới
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Thêm ảnh mới</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="space-y-2">
                <Label>Ảnh</Label>
                <div className="flex items-center gap-4">
                  {newPhoto.image_url ? (
                    <div className="relative w-32 h-32">
                      <Image
                        src={newPhoto.image_url}
                        alt="Preview"
                        fill
                        className="object-cover rounded-lg"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                      <Camera className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      id="photo"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("photo")?.click()}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                      ) : (
                        "Chọn ảnh"
                      )}
                    </Button>
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tiêu đề</Label>
                <Input
                  value={newPhoto.title}
                  onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Nhập tiêu đề ảnh"
                />
              </div>
              <div className="space-y-2">
                <Label>Mô tả</Label>
                <Textarea
                  value={newPhoto.description}
                  onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Nhập mô tả ảnh"
                  rows={4}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Hủy
              </Button>
              <Button onClick={handleSubmit}>Thêm ảnh</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {photos.map((photo) => (
          <div key={photo.featured_photo_id} className="relative group">
            <Dialog>
              <DialogTrigger asChild>
                <Card className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-300">
                  <CardContent className="p-0">
                    <div className="w-full h-auto overflow-hidden">
                      <Image
                        src={photo.image_url || "/placeholder.svg"}
                        alt={photo.title}
                        width={400}
                        height={300}
                        className="w-full h-auto object-contain"
                        style={{ maxHeight: "300px" }}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col items-start p-4">
                    <h3 className="font-medium text-lg line-clamp-1">{photo.title}</h3>
                    <p className="text-sm text-muted-foreground">{formatDate(photo.uploaded_at)}</p>
                  </CardFooter>
                </Card>
              </DialogTrigger>
              <DialogContent className="max-w-4xl">
                <DialogHeader>
                  <DialogTitle>{photo.title}</DialogTitle>
                </DialogHeader>
                <div className="grid gap-4">
                  <div className="w-full">
                    <Image
                      src={photo.image_url || "/placeholder.svg"}
                      alt={photo.title}
                      width={800}
                      height={600}
                      className="w-full h-auto object-contain max-h-[70vh]"
                      sizes="(max-width: 768px) 100vw, 90vw"
                    />
                  </div>
                  <div>
                    <p className="text-muted-foreground mt-1">{photo.description}</p>
                    <p className="text-sm text-muted-foreground mt-2">Uploaded on {formatDate(photo.uploaded_at)}</p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="icon" className="bg-white/80 hover:bg-white">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-48 p-2">
                  <div className="space-y-1">
                    <Button
                      variant="ghost"
                      className="w-full justify-start"
                      onClick={() => handleEdit(photo)}
                    >
                      <Edit2 className="mr-2 h-4 w-4" />
                      Chỉnh sửa
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start text-red-600 hover:text-red-600 hover:bg-red-50"
                      onClick={() => {
                        setSelectedPhoto(photo)
                        setIsDeleteDialogOpen(true)
                      }}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Xóa
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa ảnh</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label>Ảnh</Label>
              <div className="flex items-center gap-4">
                {newPhoto.image_url ? (
                  <div className="relative w-32 h-32">
                    <Image
                      src={newPhoto.image_url}
                      alt="Preview"
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
                    <Camera className="h-8 w-8 text-gray-400" />
                  </div>
                )}
                <div>
                  <input
                    type="file"
                    id="edit-photo"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => document.getElementById("edit-photo")?.click()}
                    disabled={uploading}
                  >
                    {uploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-gray-900"></div>
                    ) : (
                      "Chọn ảnh"
                    )}
                  </Button>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Tiêu đề</Label>
              <Input
                value={newPhoto.title}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Nhập tiêu đề ảnh"
              />
            </div>
            <div className="space-y-2">
              <Label>Mô tả</Label>
              <Textarea
                value={newPhoto.description}
                onChange={(e) => setNewPhoto(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Nhập mô tả ảnh"
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdate}>Cập nhật</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Bạn có chắc chắn muốn xóa ảnh này?</AlertDialogTitle>
            <AlertDialogDescription>
              Hành động này không thể hoàn tác. Ảnh sẽ bị xóa vĩnh viễn.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}