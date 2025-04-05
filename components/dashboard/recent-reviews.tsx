"use client"

import { Star } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentReviews() {
  const reviews = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_2_l3vjqr.jpg",
      date: "May 15, 2025",
      rating: 5,
      comment: "Alex was amazing! The photos are stunning and we couldn't be happier.",
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg",
      date: "May 10, 2025",
      rating: 5,
      comment: "Professional, punctual, and delivered high-quality images for our event.",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_1_x6d27i.jpg",
      date: "May 5, 2025",
      rating: 4,
      comment: "Great family portrait session! Alex was patient with our kids.",
    },
  ]

  return (
    <div className="space-y-6">
      {reviews.map((review) => (
        <div key={review.id} className="space-y-2">
          <div className="flex items-center space-x-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src={review.avatar} alt={review.name} />
              <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-medium leading-none">{review.name}</p>
              <p className="text-xs text-muted-foreground">{review.date}</p>
            </div>
          </div>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`}
              />
            ))}
          </div>
          <p className="text-sm text-muted-foreground">{review.comment}</p>
        </div>
      ))}
    </div>
  )
}

