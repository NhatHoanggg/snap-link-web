"use client"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageUpload } from "@/components/upload/upload-image"

export default function UploadPage() {
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)

  const handleUploadSuccess = (imageUrl: string) => {
    setUploadedImage(imageUrl)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Upload Image</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <ImageUpload onUploadSuccess={handleUploadSuccess} />

          {uploadedImage && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Preview</h3>
              <div className="relative aspect-video w-full rounded-lg overflow-hidden border">
                <Image
                  src={uploadedImage}
                  alt="Uploaded image"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-muted-foreground">
                  Image uploaded successfully
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setUploadedImage(null)}
                >
                  Clear
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
