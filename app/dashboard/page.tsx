"use client"

import { useState } from "react"
// import Link from "next/link"
import { ArrowUpRight, Calendar, ChevronRight, DollarSign, Download, MessageSquare, MoreHorizontal, Star, TrendingUp, Users } from 'lucide-react'
import { DateRange } from "react-day-picker"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu"

import { RecentReviews } from "@/components/dashboard/recent-reviews"
import { CalendarDateRangePicker } from "@/components/dashboard/date-range-picker"
import { UpcomingSessions } from "@/components/dashboard/upcoming-sessions"
import { RecentBookings } from "@/components/dashboard/recent-bookings"
import { Overview } from "@/components/dashboard/overview-chart"

export default function DashboardPage() {
  const [dateRange, setDateRange] = useState<DateRange>({
    from: new Date(new Date().setMonth(new Date().getMonth() - 1)),
    to: new Date()
  })

  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
          <div className="flex items-center space-x-2">
            <CalendarDateRangePicker date={dateRange} setDate={(date) => date && setDateRange(date)} />
            <Button>
              <Download className="mr-2 h-4 w-4" />
              Download Report
            </Button>
          </div>
        </div>

        {/* Profile Completion Alert */}
        <Card className="border-amber-200 bg-amber-50 dark:bg-amber-950/20">
          <CardContent className="flex items-center justify-between p-6">
            <div className="flex items-center space-x-4">
              <div className="rounded-full bg-amber-100 p-2 dark:bg-amber-900">
                <Users className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="font-medium">Your profile is 80% complete</p>
                <p className="text-sm text-muted-foreground">
                  Complete your profile to attract more clients and improve visibility.
                </p>
              </div>
            </div>
            <Button variant="outline" className="border-amber-200 bg-white dark:bg-transparent">
              Complete Profile
            </Button>
          </CardContent>
        </Card>

        {/* Stats Overview */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Bookings</p>
                  <p className="text-2xl font-bold">145</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2">
                  <Calendar className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="font-medium text-green-500">+12%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                  <p className="text-2xl font-bold">$12,450</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2">
                  <DollarSign className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="font-medium text-green-500">+8%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Profile Views</p>
                  <p className="text-2xl font-bold">1,245</p>
                </div>
                <div className="rounded-full bg-primary/10 p-2">
                  <Users className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <TrendingUp className="mr-1 h-4 w-4 text-green-500" />
                <span className="font-medium text-green-500">+18%</span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Average Rating</p>
                  <div className="flex items-center">
                    <p className="text-2xl font-bold">4.8</p>
                    <div className="ml-2 flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star} 
                          className={`h-4 w-4 ${star <= 4 ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} 
                        />
                      ))}
                    </div>
                  </div>
                </div>
                <div className="rounded-full bg-primary/10 p-2">
                  <Star className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm text-muted-foreground">
                <span>Based on 87 reviews</span>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="bookings">Bookings</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="reviews">Reviews</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Revenue Chart */}
              <Card className="lg:col-span-4">
                <CardHeader>
                  <CardTitle>Revenue Overview</CardTitle>
                  <CardDescription>
                    Your earnings and bookings for the selected period
                  </CardDescription>
                </CardHeader>
                <CardContent className="pl-2">
                  <Overview />
                </CardContent>
              </Card>

              {/* Recent Activity */}
              <Card className="lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Activity</CardTitle>
                  <CardDescription>
                    Your latest notifications and updates
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      {
                        type: "booking",
                        title: "New Booking Request",
                        description: "Wedding photoshoot on June 15, 2025",
                        time: "2 hours ago",
                        icon: Calendar
                      },
                      {
                        type: "message",
                        title: "New Message",
                        description: "Sarah Johnson sent you a message",
                        time: "5 hours ago",
                        icon: MessageSquare
                      },
                      {
                        type: "review",
                        title: "New Review",
                        description: "Michael Chen gave you a 5-star review",
                        time: "Yesterday",
                        icon: Star
                      },
                      {
                        type: "payment",
                        title: "Payment Received",
                        description: "$350 for Family Portrait Session",
                        time: "Yesterday",
                        icon: DollarSign
                      },
                      {
                        type: "booking",
                        title: "Booking Confirmed",
                        description: "Corporate event on May 28, 2025",
                        time: "2 days ago",
                        icon: Calendar
                      }
                    ].map((activity, index) => (
                      <div key={index} className="flex items-start space-x-4">
                        <div className={`rounded-full p-2 ${
                          activity.type === "booking" ? "bg-blue-100 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400" :
                          activity.type === "message" ? "bg-violet-100 text-violet-600 dark:bg-violet-900/20 dark:text-violet-400" :
                          activity.type === "review" ? "bg-amber-100 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400" :
                          "bg-green-100 text-green-600 dark:bg-green-900/20 dark:text-green-400"
                        }`}>
                          <activity.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <p className="text-sm font-medium leading-none">{activity.title}</p>
                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <Button variant="ghost" size="sm">
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full">
                    View All Activity
                  </Button>
                </CardFooter>
              </Card>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              {/* Upcoming Sessions */}
              <Card className="lg:col-span-4">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Upcoming Sessions</CardTitle>
                    <CardDescription>
                      Your scheduled photography sessions
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View Calendar
                  </Button>
                </CardHeader>
                <CardContent>
                  <UpcomingSessions />
                </CardContent>
              </Card>

              {/* Recent Reviews */}
              <Card className="lg:col-span-3">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Recent Reviews</CardTitle>
                    <CardDescription>
                      What your clients are saying
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm">
                    View All
                  </Button>
                </CardHeader>
                <CardContent>
                  <RecentReviews />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Bookings</CardTitle>
                <CardDescription>
                  Manage your upcoming and past photography sessions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <RecentBookings />
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline">Export CSV</Button>
                <Button>View All Bookings</Button>
              </CardFooter>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>
                  Detailed insights about your photography business
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div>
                  <h4 className="mb-4 text-sm font-medium">Popular Services</h4>
                  <div className="space-y-3">
                    {[
                      { name: "Wedding Photography", percentage: 45 },
                      { name: "Family Portraits", percentage: 30 },
                      { name: "Corporate Events", percentage: 15 },
                      { name: "Product Photography", percentage: 10 }
                    ].map((service, index) => (
                      <div key={index} className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>{service.name}</span>
                          <span className="font-medium">{service.percentage}%</span>
                        </div>
                        <Progress value={service.percentage} />
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="mb-4 text-sm font-medium">Client Demographics</h4>
                  <div className="grid grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Age Groups</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>18-24</span>
                            <span>15%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>25-34</span>
                            <span>40%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>35-44</span>
                            <span>30%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>45+</span>
                            <span>15%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="p-4">
                        <CardTitle className="text-sm">Booking Sources</CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 pt-0">
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Direct</span>
                            <span>25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Platform</span>
                            <span>60%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Referrals</span>
                            <span>15%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Client Reviews</CardTitle>
                <CardDescription>
                  All reviews and ratings from your clients
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-8">
                  {[
                    {
                      name: "Sarah Johnson",
                      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_2_l3vjqr.jpg",
                      date: "May 15, 2025",
                      rating: 5,
                      review: "Alex was amazing! He captured our wedding day perfectly and made everyone feel comfortable. The photos are stunning and we couldn't be happier with the results."
                    },
                    {
                      name: "Michael Chen",
                      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_4_ihp3wx.jpg",
                      date: "May 10, 2025",
                      rating: 5,
                      review: "Professional, punctual, and delivered high-quality images for our corporate event. Will definitely book again for future events."
                    },
                    {
                      name: "Emily Rodriguez",
                      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_1_x6d27i.jpg",
                      date: "May 5, 2025",
                      rating: 4,
                      review: "Great family portrait session! Alex was patient with our kids and captured some beautiful moments. The only reason for 4 stars instead of 5 is that it took a bit longer than expected to receive the final images."
                    },
                    {
                      name: "David Thompson",
                      avatar: "https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743596969/avt_3_hlunc3.jpg",
                      date: "April 28, 2025",
                      rating: 5,
                      review: "Our engagement photos turned out amazing! Alex found the perfect locations and made us feel comfortable throughout the shoot. Highly recommend!"
                    }
                  ].map((review, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-4">
                          <Avatar>
                            <AvatarImage src={review.avatar} alt={review.name} />
                            <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-medium">{review.name}</p>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star 
                                  key={star} 
                                  className={`h-4 w-4 ${star <= review.rating ? "fill-amber-400 text-amber-400" : "fill-muted text-muted"}`} 
                                />
                              ))}
                              <span className="ml-2 text-sm text-muted-foreground">{review.date}</span>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Reply to review</DropdownMenuItem>
                            <DropdownMenuItem>Share review</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Report review</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <p className="text-sm text-muted-foreground">{review.review}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  Load More Reviews
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Quick Actions */}
        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Update Availability</h3>
                    <p className="text-sm text-muted-foreground">Manage your calendar and booking slots</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <Users className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Edit Portfolio</h3>
                    <p className="text-sm text-muted-foreground">Update your work samples and showcase</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="rounded-full bg-primary/10 p-2">
                    <DollarSign className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">Manage Pricing</h3>
                    <p className="text-sm text-muted-foreground">Update your packages and service rates</p>
                  </div>
                </div>
                <Button variant="ghost" size="sm">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
