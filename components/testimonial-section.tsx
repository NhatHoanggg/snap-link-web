"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function TestimonialSection() {
  const [clientIndex, setClientIndex] = useState(0)
  const [photographerIndex, setPhotographerIndex] = useState(0)

  const clientTestimonials = [
    {
      name: "Sarah Johnson",
      location: "New York, NY",
      image: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg?height=100&width=100",
      content:
        "I found the perfect wedding photographer through this platform. The booking process was seamless, and the photographer exceeded our expectations. Highly recommend!",
      rating: 5,
    },
    {
      name: "Michael Chen",
      location: "San Francisco, CA",
      image: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg?height=100&width=100",
      content:
        "As someone who needed corporate headshots quickly, this platform was a lifesaver. I was able to compare portfolios, prices, and book within minutes.",
      rating: 5,
    },
    {
      name: "Emily Rodriguez",
      location: "Miami, FL",
      image: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg?height=100&width=100",
      content:
        "We booked a family photographer for our reunion and couldn't be happier with the results. The platform made it easy to find someone who specialized in large group photos.",
      rating: 5,
    },
  ]

  const photographerTestimonials = [
    {
      name: "Alex Morgan",
      specialty: "Wedding Photography",
      image: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg?height=100&width=100",
      content:
        "Joining this platform has transformed my business. I've been able to reach new clients and fill my calendar with bookings. The tools for managing my schedule are fantastic.",
      rating: 5,
    },
    {
      name: "Jessica Chen",
      specialty: "Portrait & Family",
      image: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg?height=100&width=100",
      content:
        "As a new photographer, this platform helped me establish my client base quickly. The review system has been crucial for building trust with potential clients.",
      rating: 5,
    },
    {
      name: "David Wilson",
      specialty: "Commercial Photography",
      image: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg?height=100&width=100",
      content:
        "The platform handles all the booking and payment logistics, allowing me to focus on what I do best - taking photos. My business has grown 40% since joining.",
      rating: 5,
    },
  ]

  const nextClientTestimonial = () => {
    setClientIndex((prevIndex) => (prevIndex === clientTestimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevClientTestimonial = () => {
    setClientIndex((prevIndex) => (prevIndex === 0 ? clientTestimonials.length - 1 : prevIndex - 1))
  }

  const nextPhotographerTestimonial = () => {
    setPhotographerIndex((prevIndex) => (prevIndex === photographerTestimonials.length - 1 ? 0 : prevIndex + 1))
  }

  const prevPhotographerTestimonial = () => {
    setPhotographerIndex((prevIndex) => (prevIndex === 0 ? photographerTestimonials.length - 1 : prevIndex - 1))
  }

  return (
    <Tabs defaultValue="clients" className="mx-auto max-w-4xl">
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="clients">Client Testimonials</TabsTrigger>
        <TabsTrigger value="photographers">Photographer Testimonials</TabsTrigger>
      </TabsList>

      <TabsContent value="clients" className="mt-8">
        <Card>
          <CardContent className="p-6 pt-6">
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${clientIndex * 100}%)` }}
                >
                  {clientTestimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 h-20 w-20 overflow-hidden rounded-full">
                          <img
                            src={testimonial.image || "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg"}
                            alt={testimonial.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3 className="mb-1 text-lg font-medium">{testimonial.name}</h3>
                        <p className="mb-4 text-sm text-muted-foreground">{testimonial.location}</p>
                        <div className="mb-4 flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-lg italic text-muted-foreground">{testimonial.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Button variant="outline" size="icon" onClick={prevClientTestimonial} aria-label="Previous testimonial">
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" onClick={nextClientTestimonial} aria-label="Next testimonial">
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      <TabsContent value="photographers" className="mt-8">
        <Card>
          <CardContent className="p-6 pt-6">
            <div className="relative">
              <div className="overflow-hidden">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{ transform: `translateX(-${photographerIndex * 100}%)` }}
                >
                  {photographerTestimonials.map((testimonial, index) => (
                    <div key={index} className="w-full flex-shrink-0 px-4">
                      <div className="flex flex-col items-center text-center">
                        <div className="mb-4 h-20 w-20 overflow-hidden rounded-full">
                          <img
                            src={testimonial.image || "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg"}
                            alt={testimonial.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <h3 className="mb-1 text-lg font-medium">{testimonial.name}</h3>
                        <p className="mb-4 text-sm text-muted-foreground">{testimonial.specialty}</p>
                        <div className="mb-4 flex">
                          {[...Array(testimonial.rating)].map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />
                          ))}
                        </div>
                        <p className="text-lg italic text-muted-foreground">{testimonial.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8 flex justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={prevPhotographerTestimonial}
                  aria-label="Previous testimonial"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={nextPhotographerTestimonial}
                  aria-label="Next testimonial"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  )
}

