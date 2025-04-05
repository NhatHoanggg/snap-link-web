"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const testimonials = [
  {
    name: "Sarah Johnson",
    role: "Bride",
    image: "https://images.unsplash.com/photo-1541823709867-1b206113eafd?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXNpYW4lMjBnaXJsfGVufDB8fDB8fHww",
    content:
      "Alex captured our wedding day perfectly. The photos are absolutely stunning and really captured the emotions of the day. We couldn't be happier with the results!",
    rating: 5,
  },
  {
    name: "Michael Chen",
    role: "Corporate Client",
    image: "https://images.unsplash.com/photo-1611403119860-57c4937ef987?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8YXNpYW4lMjBib3l8ZW58MHx8MHx8fDA%3D",
    content:
      "We hired Alex for our company event and the photos were exceptional. Professional, punctual, and delivered high-quality images that exceeded our expectations.",
    rating: 5,
  },
  {
    name: "Emily Rodriguez",
    role: "Family Portrait",
    image: "https://plus.unsplash.com/premium_photo-1664476664393-76eda212f0d5?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTN8fGFzaWFuJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D",
    content:
      "Alex has a special talent for making everyone feel comfortable in front of the camera. Our family photos turned out beautifully and captured our personalities perfectly.",
    rating: 5,
  },
  {
    name: "David Thompson",
    role: "Engagement Session",
    image: "https://images.unsplash.com/photo-1611459293885-f8e692ab0356?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXNpYW4lMjBib3l8ZW58MHx8MHx8fDA%3D",
    content:
      "Our engagement shoot with Alex was such a fun experience! The photos are gorgeous and really showcase our relationship. We'll cherish these forever.",
    rating: 5,
  },
  {
    name: "Jessica Williams",
    role: "Portrait Client",
    image: "https://images.unsplash.com/photo-1602214206299-791b63837bcf?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Njh8fGFzaWFuJTIwZ2lybHxlbnwwfHwwfHx8MA%3D%3D",
    content:
      "Alex has an amazing eye for detail and lighting. My professional headshots came out better than I could have imagined. Highly recommend!",
    rating: 5,
  },
]

export function TestimonialCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const nextTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === testimonials.length - 3 ? 0 : prevIndex + 1))
  }

  const prevTestimonial = () => {
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? testimonials.length - 3 : prevIndex - 1))
  }

  return (
    <div className="relative">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-300 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * (100 / 3)}%)` }}
        >
          {testimonials.map((testimonial, index) => (
            <div key={index} className="w-full flex-shrink-0 px-4 md:w-1/3">
              <Card className="h-full">
                <CardContent className="flex h-full flex-col p-6">
                  <div className="mb-4 flex items-center gap-4">
                    <div className="h-12 w-12 overflow-hidden rounded-full">
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <h3 className="font-medium">{testimonial.name}</h3>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </div>
                  <div className="mb-4 flex">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                    ))}
                  </div>
                  <p className="flex-1 text-muted-foreground">{testimonial.content}</p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8 flex justify-center gap-4">
        <Button variant="outline" size="icon" onClick={prevTestimonial} aria-label="Previous testimonial">
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={nextTestimonial} aria-label="Next testimonial">
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}

