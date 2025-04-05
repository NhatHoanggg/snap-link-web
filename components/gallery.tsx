"use client"

import { useState } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  const images = [
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Wedding couple at sunset",
      category: "Wedding",
    },
    {
      src: "/placeholder.svg?height=800&width=600",
      alt: "Family portrait in a park",
      category: "Family",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Corporate event photography",
      category: "Event",
    },
    {
      src: "/placeholder.svg?height=800&width=600",
      alt: "Portrait of a woman",
      category: "Portrait",
    },
    {
      src: "/placeholder.svg?height=600&width=800",
      alt: "Product photography",
      category: "Commercial",
    },
    {
      src: "/placeholder.svg?height=800&width=600",
      alt: "Engagement photo",
      category: "Engagement",
    },
  ]

  return (
    <>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {images.map((image, index) => (
          <div
            key={index}
            className="group relative cursor-pointer overflow-hidden rounded-lg"
            onClick={() => setSelectedImage(image.src)}
          >
            <img
              src={image.src || "/placeholder.svg"}
              alt={image.alt}
              className="h-64 w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
              <div>
                <p className="text-sm font-medium text-white">{image.alt}</p>
                <p className="text-xs text-gray-300">{image.category}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl p-0">
          {selectedImage && (
            <img
              src={selectedImage || "/placeholder.svg"}
              alt="Enlarged view"
              className="h-full w-full object-contain"
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

