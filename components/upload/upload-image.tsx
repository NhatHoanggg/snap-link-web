"use client"

import { CldUploadWidget } from "next-cloudinary"
import { CloudinaryUploadWidgetResults } from "next-cloudinary"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import { Upload } from "lucide-react"

interface UploadWidgetProps {
  open: () => void
}

interface ImageUploadProps {
  onUploadSuccess: (imageUrl: string) => void
  onUploadError?: () => void
  maxFiles?: number
  maxImageFileSize?: number
  cropping?: boolean
  croppingAspectRatio?: number
}

export function ImageUpload({
  onUploadSuccess,
  onUploadError,
  maxFiles = 1,
  maxImageFileSize = 5000000,
  cropping = true,
  croppingAspectRatio = 1,
}: ImageUploadProps) {
  const handleUploadSuccess = (result: CloudinaryUploadWidgetResults) => {
    if (result?.info && typeof result.info === "object" && "secure_url" in result.info) {
      const imageUrl = result.info.secure_url as string
      onUploadSuccess(imageUrl)
      toast({
        title: "Success",
        description: "Image uploaded successfully!",
      })
    }
  }

  const handleUploadError = () => {
    onUploadError?.()
    toast({
      title: "Error",
      description: "Failed to upload image. Please try again.",
      variant: "destructive",
    })
  }

  return (
    <CldUploadWidget
      uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
      onSuccess={handleUploadSuccess}
      onError={handleUploadError}
      options={{
        maxFiles,
        sources: ["local", "url", "camera"],
        multiple: false,
        resourceType: "image",
        maxImageFileSize,
        cropping,
        croppingAspectRatio,
        croppingDefaultSelectionRatio: 1,
        croppingShowDimensions: true,
        croppingCoordinatesMode: "custom",
        showSkipCropButton: false,
        showPoweredBy: false,
        styles: {
          palette: {
            window: "#FFFFFF",
            windowBorder: "#90A0B3",
            tabIcon: "#0078FF",
            menuIcons: "#5A616A",
            textDark: "#000000",
            textLight: "#FFFFFF",
            link: "#0078FF",
            action: "#FF620C",
            inactiveTabIcon: "#0E2F5A",
            error: "#F44235",
            inProgress: "#0078FF",
            complete: "#20B832",
            sourceBg: "#E4EBF1",
          },
          fonts: {
            default: null,
            "'Poppins', sans-serif": {
              url: "https://fonts.googleapis.com/css?family=Poppins",
              active: true,
            },
          },
        },
      }}
    >
      {({ open }: UploadWidgetProps) => (
        <Button
          variant="outline"
          className="w-full h-32 border-dashed"
          onClick={() => open()}
        >
          <div className="flex flex-col items-center gap-2">
            <Upload className="h-8 w-8" />
            <span>Click to upload</span>
            <span className="text-sm text-muted-foreground">
              PNG, JPG, JPEG, WEBP up to 10MB
            </span>
          </div>
        </Button>
      )}
    </CldUploadWidget>
  )
}