"use client"

import type React from "react"

import { useState, useRef } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { X, Upload, ImageIcon, TagIcon, MessageSquare, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"

// Định nghĩa schema validation
const formSchema = z.object({
  image_url: z.string().min(1, "Vui lòng tải lên một hình ảnh"),
  caption: z.string().min(1, "Vui lòng nhập caption"),
  tags: z.array(z.string()).min(1, "Vui lòng chọn ít nhất một tag"),
})

type FormValues = z.infer<typeof formSchema>

// Danh sách tag mẫu (trong thực tế có thể lấy từ API)
const availableTags = [
  "photography",
  "travel",
  "nature",
  "portrait",
  "food",
  "fashion",
  "art",
  "music",
  "technology",
  "sports",
  "lifestyle",
  "animals",
  "architecture",
  "beauty",
  "business",
  "education",
]

export function CreatePostForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [customTag, setCustomTag] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
    reset,
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      image_url: "",
      caption: "",
      tags: [],
    },
  })

  const selectedTags = watch("tags")

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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

    setIsUploading(true)

    // Tạo URL preview
    const previewUrl = URL.createObjectURL(file)
    setImagePreview(previewUrl)

    // Mô phỏng upload ảnh lên server
    setTimeout(() => {
      // Trong thực tế, đây là nơi bạn sẽ upload ảnh lên server và nhận về URL
      const fakeImageUrl = previewUrl
      setValue("image_url", fakeImageUrl, { shouldValidate: true })
      setIsUploading(false)
    }, 1500)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setValue("image_url", "", { shouldValidate: true })
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
      // Mô phỏng gửi dữ liệu lên server
      console.log("Submitting data:", data)

      // Trong thực tế, đây là nơi bạn sẽ gọi API để tạo post
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Thành công",
        description: "Bài đăng đã được tạo thành công",
      })

      // Reset form
      reset()
      setImagePreview(null)
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Lỗi",
        description: "Có lỗi xảy ra khi tạo bài đăng",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl">Tạo bài đăng mới</CardTitle>
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
              <AnimatePresence>
                {!imagePreview ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 text-center"
                  >
                    <div className="mb-4 rounded-full bg-primary/10 p-3">
                      <Upload className="h-6 w-6 text-primary" />
                    </div>
                    <div className="mb-2 text-lg font-medium">Kéo thả hoặc nhấp để tải lên</div>
                    <div className="text-sm text-muted-foreground mb-4">Hỗ trợ JPG, PNG hoặc GIF (tối đa 5MB)</div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploading}
                    >
                      {isUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Đang tải lên...
                        </>
                      ) : (
                        "Chọn file"
                      )}
                    </Button>
                    <input
                      id="image"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      disabled={isUploading}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="relative rounded-lg overflow-hidden aspect-video"
                  >
                    <Image src={imagePreview || "/placeholder.svg"} alt="Preview" fill className="object-cover" />
                    <Button
                      type="button"
                      size="icon"
                      variant="destructive"
                      className="absolute top-2 right-2"
                      onClick={handleRemoveImage}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>

              {errors.image_url && <p className="text-sm text-destructive">{errors.image_url.message}</p>}
            </div>
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
                {availableTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? "default" : "outline"}
                    className="cursor-pointer"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>

            {errors.tags && <p className="text-sm text-destructive">{errors.tags.message}</p>}
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button type="submit" disabled={isSubmitting || isUploading}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Đang tạo bài đăng...
              </>
            ) : (
              "Tạo bài đăng"
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
