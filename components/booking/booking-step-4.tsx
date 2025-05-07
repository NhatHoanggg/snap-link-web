"use client"

import { useState } from "react"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "./file-uploader"
import { Lightbulb, X } from "lucide-react"
import Image from "next/image"
import type { BookingFormData } from "@/services/booking.service"

interface BookingStep4Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export function BookingStep4({ formData, updateFormData, nextStep, prevStep }: BookingStep4Props) {
  const [files, setFiles] = useState<File[]>([])

  const handleFilesAdded = (newFiles: File[]) => {
    const updatedFiles = [...files, ...newFiles]
    setFiles(updatedFiles)

    // Chuyển đổi File[] thành URL[] để lưu trong formData
    const fileUrls = updatedFiles.map((file) => URL.createObjectURL(file))
    updateFormData({ illustration_url: fileUrls[0] }) // Chỉ lưu URL đầu tiên
  }

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...files]
    updatedFiles.splice(index, 1)
    setFiles(updatedFiles)

    const fileUrls = updatedFiles.map((file) => URL.createObjectURL(file))
    updateFormData({ illustration_url: fileUrls[0] || "" }) // Chỉ lưu URL đầu tiên hoặc xóa nếu không còn file
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Concept và hình ảnh minh họa</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="concept">Concept chụp ảnh</Label>
          <Textarea
            id="concept"
            placeholder="Mô tả concept, ý tưởng chụp ảnh của bạn..."
            value={formData.concept}
            onChange={(e) => updateFormData({ concept: e.target.value })}
            rows={5}
          />
        </div>

        <div className="p-4 bg-muted rounded-md flex items-start">
          <Lightbulb className="h-5 w-5 mr-2 mt-0.5 text-amber-500" />
          <div className="text-sm">
            <p className="font-medium">Gợi ý:</p>
            <p className="text-muted-foreground mt-1">
              Mô tả chi tiết concept, phong cách, màu sắc, bối cảnh, trang phục, đạo cụ... mà bạn mong muốn. Điều này sẽ
              giúp chúng tôi chuẩn bị tốt nhất cho buổi chụp của bạn.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <Label>Hình ảnh minh họa (nếu có)</Label>
          <FileUploader onFilesAdded={handleFilesAdded} />

          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-md overflow-hidden border">
                    <Image
                      src={URL.createObjectURL(file) || "/placeholder.svg"}
                      alt={`Illustration ${index + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute -top-2 -right-2 h-6 w-6 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between mt-6">
        <Button variant="outline" onClick={prevStep}>
          Quay lại
        </Button>
        <Button onClick={nextStep}>Tiếp theo</Button>
      </CardFooter>
    </>
  )
}
