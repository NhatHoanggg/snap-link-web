"use client"

import { Calendar, Clock, MapPin, MoreHorizontal, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function UpcomingSessions() {
  const sessions = [
    {
      id: "S-1234",
      client: "Sarah Johnson",
      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_2_l3vjqr.jpg",
      date: "May 28, 2025",
      time: "10:00 AM - 2:00 PM",
      type: "Wedding Photography",
      location: "Grand Plaza Hotel, New York",
      status: "confirmed",
    },
    {
      id: "S-1235",
      client: "Michael Chen",
      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg",
      date: "May 30, 2025",
      time: "2:00 PM - 4:00 PM",
      type: "Corporate Event",
      location: "Tech Conference Center, San Francisco",
      status: "confirmed",
    },
    {
      id: "S-1236",
      client: "Emily Rodriguez",
      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_1_x6d27i.jpg",
      date: "June 5, 2025",
      time: "11:30 AM - 1:00 PM",
      type: "Family Portrait",
      location: "Sunset Park, Miami",
      status: "confirmed",
    },
  ]

  return (
    <div className="space-y-4">
      {sessions.map((session) => (
        <Card key={session.id} className="overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-l-4 border-primary p-4">
              <div className="flex items-center space-x-4">
                <Avatar>
                  <AvatarImage src={session.avatar} alt={session.client} />
                  <AvatarFallback>{session.client.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <div className="flex items-center">
                    <h4 className="font-medium">{session.client}</h4>
                    <Badge className="ml-2">{session.type}</Badge>
                  </div>
                  <div className="mt-1 flex flex-col space-y-1 text-sm text-muted-foreground sm:flex-row sm:space-x-4 sm:space-y-0">
                    <div className="flex items-center">
                      <Calendar className="mr-1 h-3 w-3" />
                      {session.date}
                    </div>
                    <div className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      {session.time}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="mr-1 h-3 w-3" />
                      {session.location}
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Details
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem>
                      <User className="mr-2 h-4 w-4" />
                      Contact Client
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <MapPin className="mr-2 h-4 w-4" />
                      View Location
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>
                      <Clock className="mr-2 h-4 w-4" />
                      Reschedule
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                      <Calendar className="mr-2 h-4 w-4" />
                      Cancel Session
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

