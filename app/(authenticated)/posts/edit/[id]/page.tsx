"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Upload, ImageIcon, TagIcon, MessageSquare, Loader2 } from "lucide-react"
import { useRouter, useParams } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { postsService, type Post, type UpdatePostRequest } from "@/services/posts.service"
import { getTags, type Tag } from "@/services/tags.service"
import { uploadImage } from "@/services/cloudinary.service"

// Định nghĩa schema validation
const formSchema = z.object({
  image_url: z.string().min(1, "Vui lòng tải lên một hình ảnh"),
  caption: z.string().min(1, "Vui lòng nhập caption"),
  tags: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một tag"),
})

type FormValues = z.infer<typeof formSchema>

export default function EditPostPage() {
  const router = useRouter()
  const params = useParams()
  const postId = Number(params.id)
  const [post, setPost] = useState<Post | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [customTag, setCustomTag] = useState("")
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [isLoadingTags, setIsLoadingTags] = useState(false)
  const [currentImageUrl, setCurrentImageUrl] = useState<string>("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_url: "",
      caption: "",
      tags: [],
    },
  })

  const selectedTags = watch("tags")

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const postData = await postsService.getPostById(postId)
        setPost(postData)
        setCurrentImageUrl(postData.image_url)
        setValue("image_url", postData.image_url)
        setValue("caption", postData.caption)
        setValue("tags", postData.tags)
      } catch (error) {
        console.error("Error fetching post:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải bài đăng",
          variant: "destructive",
        })
        router.push("/posts")
      } finally {
        setIsLoading(false)
      }
    }

    const fetchTags = async () => {
      try {
        setIsLoadingTags(true)
        const tags = await getTags(null)
        setAvailableTags(tags)
      } catch (error) {
        console.error("Error fetching tags:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách tags",
          variant: "destructive",
        })
      } finally {
        setIsLoadingTags(false)
      }
    }

    if (postId) {
      fetchPost()
      fetchTags()
    }
  }, [postId, router, setValue, toast])

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Kiểm tra loại file
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Lỗi",
        description: "Vui lòng chọn file hình ảnh",
        variant: "destructive",
      })
      return
    }

    try {
      setIsUploading(true)
      const imageUrl = await uploadImage(file, "snaplink")
      setCurrentImageUrl(imageUrl)
      setValue("image_url", imageUrl, { shouldValidate: true })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải lên ảnh. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const toggleTag = (tag: string) => {
    const currentTags = [...selectedTags]
    const tagIndex = currentTags.indexOf(tag)

    if (tagIndex > -1) {
      currentTags.splice(tagIndex, 1)
    } else {
      currentTags.push(tag)
    }

    setValue("tags", currentTags, { shouldValidate: true })
  }

  const addCustomTag = () => {
    if (!customTag.trim()) return

    const normalizedTag = customTag.trim().toLowerCase().replace(/\s+/g, "-")

    if (!selectedTags.includes(normalizedTag)) {
      const newTags = [...selectedTags, normalizedTag]
      setValue("tags", newTags, { shouldValidate: true })
    }

    setCustomTag("")
  }

  const onSubmit = async (data: FormValues) => {
    setIsSubmitting(true)

    try {
      const postData: UpdatePostRequest = {
        image_url: data.image_url,
        caption: data.caption,
        tags: data.tags,
      }

      await postsService.updatePost(postId, postData)

      toast({
        title: "Thành công",
        description: "Bài đăng đã được cập nhật thành công",
      })

      // Chuyển về trang quản lý bài viết
      router.push("/posts")
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi cập nhật bài đăng",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Đang tải bài đăng...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return null
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Chỉnh sửa bài đăng</CardTitle>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-6">
          {/* Upload ảnh */}
          <div className="space-y-2">
            <Label htmlFor="image" className="flex items-center gap-2">
              <ImageIcon className="h-4 w-4" />
              Hình ảnh
            </Label>

            <div className="grid gap-4">
              <div className="relative rounded-lg overflow-hidden aspect-video">
                <Image src={currentImageUrl} alt="Current post image" fill className="object-cover" />
              </div>

              <div className="flex items-center gap-4">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  disabled={isUploading}
                />
                <Label
                  htmlFor="image"
                  className="flex items-center gap-2 px-4 py-2 border rounded-md cursor-pointer hover:bg-muted"
                >
                  {isUploading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Upload className="w-4 h-4" />
                  )}
                  <span>{isUploading ? "Đang tải lên..." : "Thay đổi ảnh"}</span>
                </Label>
              </div>
            </div>
            {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
          </div>

          {/* Caption */}
          <div className="space-y-2">
            <Label htmlFor="caption" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Caption
            </Label>
            <Textarea
              id="caption"
              placeholder="Viết caption cho bài đăng của bạn..."
              className="min-h-32 resize-none"
              {...register("caption")}
            />
            {errors.caption && <p className="text-sm text-destructive">{errors.caption.message}</p>}
          </div>

          {/* Tags */}
          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <TagIcon className="h-4 w-4" />
              Tags
            </Label>

            {/* Hiển thị tags đã chọn */}
            <div className="flex flex-wrap gap-2">
              <AnimatePresence>
                {selectedTags.map((tag) => (
                  <motion.div
                    key={tag}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                  >
                    <Badge variant="secondary" className="pl-2 pr-1 py-1 flex items-center gap-1">
                      {tag}
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-4 w-4 rounded-full"
                        onClick={() => toggleTag(tag)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </Badge>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Thêm tag tùy chỉnh */}
            <div className="flex gap-2">
              <Input
                placeholder="Thêm tag mới..."
                value={customTag}
                onChange={(e) => setCustomTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault()
                    addCustomTag()
                  }
                }}
              />
              <Button type="button" onClick={addCustomTag}>
                Thêm
              </Button>
            </div>

            {/* Danh sách tag có sẵn */}
            <div>
              <Label className="text-sm text-muted-foreground mb-2 block">Hoặc chọn từ danh sách có sẵn:</Label>
              <div className="flex flex-wrap gap-2 mt-2">
                {isLoadingTags ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm text-muted-foreground">Đang tải tags...</span>
                  </div>
                ) : (
                  availableTags.map((tag) => (
                    <Badge
                      key={tag.name}
                      variant={selectedTags.includes(tag.name) ? "default" : "outline"}
                      className="cursor-pointer"
                      onClick={() => toggleTag(tag.name)}
                    >
                      {tag.name}
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="outline" onClick={() => router.push("/posts")}>
            Hủy
          </Button>
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang cập nhật...
              </>
            ) : (
              "Cập nhật bài đăng"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
