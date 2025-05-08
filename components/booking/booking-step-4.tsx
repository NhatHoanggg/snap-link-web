"use client"

import { useState, useEffect } from "react"
import { CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileUploader } from "./file-uploader"
import { Lightbulb, X } from "lucide-react"
import type { BookingFormData } from "@/services/booking.service"

interface BookingStep4Props {
  formData: BookingFormData
  updateFormData: (data: Partial<BookingFormData>) => void
  nextStep: () => void
  prevStep: () => void
}

export function BookingStep4({ formData, updateFormData, nextStep, prevStep }: BookingStep4Props) {
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])

  useEffect(() => {
    // Create object URLs for preview
    const urls = files.map(file => URL.createObjectURL(file))
    setPreviewUrls(urls)

    // Cleanup function to revoke object URLs
    return () => {
      urls.forEach(url => URL.revokeObjectURL(url))
    }
  }, [files])

  const handleFilesAdded = (newFiles: File[]) => {
    setFiles(newFiles)
    
    // Convert the first file to base64 for preview
    if (newFiles.length > 0) {
      const file = newFiles[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        updateFormData({ illustration_url: reader.result as string })
      }
      reader.readAsDataURL(file)
    } else {
      updateFormData({ illustration_url: "" })
    }
  }

  const handleRemoveFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index)
    setFiles(updatedFiles)
    
    if (updatedFiles.length === 0) {
      updateFormData({ illustration_url: "" })
    } else {
      // Convert the first remaining file to base64
      const file = updatedFiles[0]
      const reader = new FileReader()
      reader.onloadend = () => {
        updateFormData({ illustration_url: reader.result as string })
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <>
      <CardHeader>
        <CardTitle className="text-2xl">Thêm concept và hình ảnh tham khảo</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-3">
          <Label htmlFor="concept">Concept</Label>
          <div className="relative">
            <Lightbulb className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
            <Textarea
              id="concept"
              placeholder="Mô tả concept chụp ảnh của bạn..."
              className="pl-10"
              value={formData.concept}
              onChange={(e) => updateFormData({ concept: e.target.value })}
            />
          </div>
        </div>

        <div className="space-y-3">
          <Label>Hình ảnh tham khảo</Label>
          <FileUploader onFilesAdded={handleFilesAdded} />

          {files.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {files.map((file, index) => (
                <div key={index} className="relative group">
                  <div className="aspect-square rounded-md overflow-hidden border">
                    <img
                      src={previewUrls[index]}
                      alt={`Illustration ${index + 1}`}
                      className="object-cover w-full h-full"
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
