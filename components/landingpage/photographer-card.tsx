"use client"

import { useState } from "react"
import { Heart, MapPin, Star } from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"

interface Photographer {
  id: number
  name: string
  specialty: string
  location: string
  rating: number
  reviews: number
  price: string
  image: string
  coverImage: string
  tags: string[]
  featured: boolean
}

export function PhotographerCard({ photographer }: { photographer: Photographer }) {
  const [isFavorite, setIsFavorite] = useState(false)

  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <div className="relative">
        {/* Cover Image */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={photographer.coverImage || "/placeholder.svg"}
            alt={`${photographer.name}'s work`}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Featured Badge */}
          {photographer.featured && (
            <Badge className="absolute left-3 top-3 bg-primary text-primary-foreground">Featured</Badge>
          )}

          {/* Favorite Button */}
          <button
            onClick={() => setIsFavorite(!isFavorite)}
            className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/30 text-white backdrop-blur-sm transition-colors hover:bg-black/50"
            aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Heart className={`h-4 w-4 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
          </button>
        </div>

        {/* Photographer Image */}
        <div className="absolute -bottom-8 left-4 h-16 w-16 overflow-hidden rounded-full border-4 border-background">
          <img
            src={photographer.image || "/placeholder.svg"}
            alt={photographer.name}
            className="h-full w-full object-cover"
          />
        </div>
      </div>

      <CardContent className="mt-8 pt-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-bold">{photographer.name}</h3>
            <p className="text-sm text-muted-foreground">{photographer.specialty}</p>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
            <span className="font-medium">{photographer.rating}</span>
            <span className="text-muted-foreground">({photographer.reviews})</span>
          </div>
        </div>

        <div className="mb-3 flex items-center gap-1 text-sm">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="text-muted-foreground">{photographer.location}</span>
        </div>

        <div className="mb-3 flex flex-wrap gap-2">
          {photographer.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="bg-muted">
              {tag}
            </Badge>
          ))}
        </div>

        <div className="text-sm">
          <span className="font-medium">Starting at </span>
          <span>{photographer.price}</span>
          <span className="text-muted-foreground"> per session</span>
        </div>
      </CardContent>

      <CardFooter className="border-t p-4">
        <div className="flex w-full gap-2">
          <Button variant="outline" size="sm" className="flex-1">
            View Profile
          </Button>
          <Button size="sm" className="flex-1">
            Book Now
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

