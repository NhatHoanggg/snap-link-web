"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Upload } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploaderProps {
  onFilesAdded: (files: File[]) => void
}

export function FileUploader({ onFilesAdded }: FileUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files) {
      const validFiles = validateFiles(Array.from(e.dataTransfer.files))
      if (validFiles.length > 0) {
        onFilesAdded(validFiles)
      }
    }
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const validFiles = validateFiles(Array.from(e.target.files))
      if (validFiles.length > 0) {
        onFilesAdded(validFiles)
      }
      // Reset input để có thể chọn lại cùng một file
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
    }
  }

  const validateFiles = (files: File[]): File[] => {
    const validFiles: File[] = []
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg", "image/webp"]

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "File không hợp lệ",
          description: `${file.name} không phải là file ảnh hợp lệ. Chỉ chấp nhận JPG, PNG và WEBP.`,
          variant: "destructive",
        })
        continue
      }

      if (file.size > maxSize) {
        toast({
          title: "File quá lớn",
          description: `${file.name} vượt quá kích thước tối đa 5MB.`,
          variant: "destructive",
        })
        continue
      }

      validFiles.push(file)
    }

    return validFiles
  }

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
        isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInputChange}
        multiple
        accept="image/jpeg,image/png,image/jpg,image/webp"
        className="hidden"
      />
      <Upload className="mx-auto h-10 w-10 text-muted-foreground mb-4" />
      <p className="text-sm font-medium">
        Kéo thả ảnh vào đây hoặc <span className="text-primary">chọn file</span>
      </p>
      <p className="text-xs text-muted-foreground mt-1">JPG, PNG hoặc WEBP (tối đa 5MB)</p>
    </div>
  )
}
