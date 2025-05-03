"use client"

import Link from "next/link"
import { ArrowRight, CheckCircle, Filter, MapPin, Search } from "lucide-react"
import { useAuth } from "@/services/auth"
import { useEffect } from "react"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { PhotographerCard } from "@/components/landingpage/photographer-card" 
import { HowItWorks } from "@/components/landingpage/how-it-works"
import { TestimonialSection } from "@/components/landingpage/testimonial-section"
import { Footer } from "@/components/footer"

export default function LandingPage() {
  const { isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/home")
    }
  }, [isAuthenticated, router])

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative flex min-h-[600px] items-center justify-center overflow-hidden bg-gradient-to-r from-slate-900 to-slate-800 text-white">
        <div className="absolute inset-0 overflow-hidden opacity-20">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1452587925148-ce544e77e70d?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D?height=1080&width=1920')] bg-cover bg-center bg-no-repeat"></div>
        </div>
        <div className="container relative z-10 mx-auto px-4 py-16 text-center">
          <h1 className="mb-6 text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
            Find the Perfect Photographer <p className=" tracking-wide underline decoration-yellow-500/30">for Any Occasion</p>
          </h1>
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-200 sm:text-xl">
            Connect with talented photographers in your area.  Book sessions easily and bring your vision to life. 
          </p>

          <div className="mx-auto mb-8 max-w-3xl rounded-lg bg-white/10 p-2 backdrop-blur-sm">
            <div className="flex flex-col gap-2 md:flex-row">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="What type of photography do you need?"
                  className="h-12 border-0 bg-white pl-10 text-black placeholder:text-gray-500"
                />
              </div>
              <div className="relative flex-grow">
                <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Location"
                  className="h-12 border-0 bg-white pl-10 text-black placeholder:text-gray-500"
                />
              </div>
              <Button size="lg" className="h-12 px-8">
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 text-sm">
            <span className="text-gray-300">Popular:</span>
            {["Wedding", "Portrait", "Family", "Event", "Commercial"].map((tag) => (
              <Badge key={tag} variant="secondary" className="bg-white/20 hover:bg-white/30">
                {tag}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Photographers */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 flex flex-col items-center justify-between gap-4 md:flex-row">
            <div>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Featured Photographers</h2>
              <p className="mt-2 text-lg text-muted-foreground">Discover our top-rated photography professionals</p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filters
              </Button>
              <Button variant="outline" size="sm">
                Most Popular
              </Button>
              <Button variant="outline" size="sm">
                Newest
              </Button>
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[
              {
                id: 1,
                name: "Alex Morgan",
                specialty: "Wedding Photography",
                location: "New York, NY",
                rating: 4.9,
                reviews: 127,
                price: "$200-350",
                image: "https://images.unsplash.com/flagged/photo-1578001646127-f97b867353b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEwfHxwaG90b2dyYXBoZXJ8ZW58MHx8MHx8fDI%3D",
                coverImage: "https://images.unsplash.com/flagged/photo-1578001646127-f97b867353b9?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTEwfHxwaG90b2dyYXBoZXJ8ZW58MHx8MHx8fDI%3D",
                tags: ["Wedding", "Portrait", "Event"],
                featured: true,
              },
              {
                id: 2,
                name: "Jessica Chen",
                specialty: "Portrait & Family",
                location: "Los Angeles, CA",
                rating: 4.8,
                reviews: 98,
                price: "$150-250",
                image: "https://images.unsplash.com/photo-1728546679568-5f5d7a3c1ec2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGFzaWFuJTIwcGhvdG9ncmFwaGVyfGVufDB8fDB8fHwy",
                coverImage: "https://images.unsplash.com/photo-1728546679568-5f5d7a3c1ec2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDh8fGFzaWFuJTIwcGhvdG9ncmFwaGVyfGVufDB8fDB8fHwy",
                tags: ["Family", "Portrait", "Maternity"],
                featured: true,
              },
              {
                id: 3,
                name: "Michael Rodriguez",
                specialty: "Commercial & Product",
                location: "Chicago, IL",
                rating: 4.7,
                reviews: 84,
                price: "$300-500",
                image: "https://images.unsplash.com/photo-1464160551369-33c49e545109?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ5fHxhc2lhbiUyMHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                coverImage: "https://images.unsplash.com/photo-1464160551369-33c49e545109?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjQ5fHxhc2lhbiUyMHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                tags: ["Commercial", "Product", "Real Estate"],
                featured: false,
              },
              {
                id: 4,
                name: "Sarah Johnson",
                specialty: "Event Photography",
                location: "Miami, FL",
                rating: 4.9,
                reviews: 112,
                price: "$180-300",
                image: "https://images.unsplash.com/photo-1623783356340-95375aac85ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxwaG90b2dyYXBoZXJ8ZW58MHx8MHx8fDI%3D",
                coverImage: "https://images.unsplash.com/photo-1623783356340-95375aac85ce?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI0fHxwaG90b2dyYXBoZXJ8ZW58MHx8MHx8fDI%3D",
                tags: ["Event", "Corporate", "Concert"],
                featured: true,
              },
              {
                id: 5,
                name: "David Wilson",
                specialty: "Landscape & Travel",
                location: "Denver, CO",
                rating: 4.8,
                reviews: 76,
                price: "$250-400",
                image: "https://images.unsplash.com/photo-1548907566-3f1a7f52f464?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGFzaWFuJTIwcGhvdG9ncmFwaGVyfGVufDB8fDB8fHwy",
                coverImage: "https://images.unsplash.com/photo-1548907566-3f1a7f52f464?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OTB8fGFzaWFuJTIwcGhvdG9ncmFwaGVyfGVufDB8fDB8fHwy",
                tags: ["Landscape", "Travel", "Nature"],
                featured: false,
              },
              {
                id: 6,
                name: "Emily Patel",
                specialty: "Fashion & Editorial",
                location: "Austin, TX",
                rating: 4.9,
                reviews: 93,
                price: "$350-600",
                image: "https://images.unsplash.com/photo-1550879228-c334643b41b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjMxfHxwaG90b2dyYXBoZXJ8ZW58MHx8MHx8fDI%3D",
                coverImage: "https://images.unsplash.com/photo-1550879228-c334643b41b2?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjMxfHxwaG90b2dyYXBoZXJ8ZW58MHx8MHx8fDI%3D",
                tags: ["Fashion", "Editorial", "Portrait"],
                featured: true,
              },
            ].map((photographer) => (
              <PhotographerCard key={photographer.id} photographer={photographer} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Button size="lg" className="gap-2">
              Explore All Photographers
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">How It Works</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Our platform makes it easy to connect photographers with clients
            </p>
          </div>

          <Tabs defaultValue="clients" className="mx-auto max-w-4xl">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="clients">For Clients</TabsTrigger>
              <TabsTrigger value="photographers">For Photographers</TabsTrigger>
            </TabsList>
            <TabsContent value="clients" className="mt-8">
              <HowItWorks
                steps={[
                  {
                    title: "Search",
                    description: "Browse photographers by location, specialty, and price range.",
                    icon: "search",
                  },
                  {
                    title: "Compare",
                    description: "View portfolios, read reviews, and compare pricing.",
                    icon: "list",
                  },
                  {
                    title: "Book",
                    description: "Select your date and time, then book securely through our platform.",
                    icon: "calendar",
                  },
                  {
                    title: "Enjoy",
                    description: "Meet your photographer and receive beautiful photos.",
                    icon: "camera",
                  },
                ]}
              />
            </TabsContent>
            <TabsContent value="photographers" className="mt-8">
              <HowItWorks
                steps={[
                  {
                    title: "Join",
                    description: "Create your professional profile and showcase your portfolio.",
                    icon: "user-plus",
                  },
                  {
                    title: "Set Up",
                    description: "Define your services, pricing, and availability calendar.",
                    icon: "settings",
                  },
                  {
                    title: "Get Booked",
                    description: "Receive booking requests and communicate with clients.",
                    icon: "calendar",
                  },
                  {
                    title: "Grow",
                    description: "Build your reputation with reviews and expand your business.",
                    icon: "trending-up",
                  },
                ]}
              />
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Photography Categories</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Find the right photographer for any occasion
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {[
              {
                name: "Wedding",
                icon: "heart",
                image: "https://images.unsplash.com/photo-1519027156611-f83273d3333a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTZ8fHdlZGRpbmclMjBhc2lhfGVufDB8fDB8fHwy",
                count: 245,
              },
              {
                name: "Portrait",
                icon: "user",
                image: "https://images.unsplash.com/photo-1704731267884-91c2a0f6c20e?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTI1fHxhc2lhJTIwcG9ydHJhaXR8ZW58MHx8MHx8fDI%3D",
                count: 189,
              },
              {
                name: "Family",
                icon: "users",
                image: "https://images.unsplash.com/photo-1655185495345-af05a1086560?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTl8fGFzaWElMjBmYW1pbHl8ZW58MHx8MHx8fDI%3D",
                count: 156,
              },
              {
                name: "Event",
                icon: "calendar",
                image: "https://images.unsplash.com/photo-1709037805294-314fe71b2186?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NjF8fGFzaWElMjBwYXJ0eXxlbnwwfHwwfHx8Mg%3D%3D",
                count: 132,
              },
              {
                name: "Commercial",
                icon: "briefcase",
                image: "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                count: 98,
              },
              {
                name: "Real Estate",
                icon: "home",
                image: "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                count: 87,
              },
              {
                name: "Fashion",
                icon: "scissors",
                image: "https://images.unsplash.com/photo-1541516160071-4bb0c5af65ba?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MTh8fHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D",
                count: 76,
              },
              {
                name: "Food",
                icon: "utensils",
                image: "https://images.unsplash.com/photo-1503764654157-72d979d9af2f?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8YXNpYW4lMjBmb29kfGVufDB8fDB8fHwy",
                count: 64,
              },
            ].map((category, index) => (
              <Link
                key={index}
                href={`/category/${category.name.toLowerCase()}`}
                className="group relative overflow-hidden rounded-lg"
              >
                <div
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundImage: `url(${category.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-black/20" />
                <div className="relative flex h-48 flex-col items-center justify-center p-6 text-white">
                  <h3 className="mb-2 text-xl font-bold">{category.name}</h3>
                  <p className="text-sm text-gray-200">{category.count} photographers</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">What Our Users Say</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Hear from photographers and clients who love our platform
            </p>
          </div>

          <TestimonialSection />
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 rounded-xl bg-primary p-8 text-primary-foreground md:grid-cols-4">
            {[
              { value: "10,000+", label: "Photographers" },
              { value: "50,000+", label: "Happy Clients" },
              { value: "100,000+", label: "Bookings" },
              { value: "500+", label: "Cities" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <p className="text-4xl font-bold">{stat.value}</p>
                <p className="text-lg">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Sections */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-2">
            {/* For Clients */}
            <Card className="overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1448376561459-dbe8868fa34c?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NDB8fGFzaWFuJTIwZ2lybHxlbnwwfHwwfHx8Mg%3D%3D?height=400&width=800')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
              <CardContent className="p-6 pt-8">
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold">Looking for a Photographer?</h3>
                  <p className="text-muted-foreground">
                    Find the perfect professional for your special moments. Browse portfolios, read reviews, and book
                    with confidence.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Access to thousands of vetted photographers</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Secure booking and payment protection</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Read authentic reviews from real clients</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-6">
                <Button size="lg" className="w-full">
                  Find a Photographer
                </Button>
              </CardFooter>
            </Card>

            {/* For Photographers */}
            <Card className="overflow-hidden">
              <div className="relative h-80 overflow-hidden">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: "url('https://images.unsplash.com/photo-1509145844239-0d160c78a06a?w=600&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8ODd8fHBob3RvZ3JhcGhlcnxlbnwwfHwwfHx8Mg%3D%3D')" }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
              </div>
              <CardContent className="p-6 pt-8">
                <div className="mb-6">
                  <h3 className="mb-2 text-2xl font-bold">Are You a Photographer?</h3>
                  <p className="text-muted-foreground">
                    Join our network and grow your business. Get more clients, manage bookings easily, and showcase your
                    portfolio to thousands.
                  </p>
                </div>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Create a professional profile and portfolio</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Manage bookings and availability in one place</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 text-primary" />
                    <p>Get paid securely and on time</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/50 p-6">
                <Button size="lg" variant="outline" className="w-full">
                  Join as a Photographer
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* App Download */}
      <section className="bg-muted py-20">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 md:grid-cols-2">
            <div>
              <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">Take Our Platform With You</h2>
              <p className="mb-6 text-lg text-muted-foreground">
                Download our mobile app to book photographers on the go, manage your appointments, and stay updated with
                your upcoming sessions.
              </p>
              <div className="flex flex-wrap gap-4">
                <Button className="gap-2" size="lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <path d="M12 19H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v5.5"></path>
                    <path d="M16 19h6"></path>
                    <path d="M19 16v6"></path>
                  </svg>
                  App Store
                </Button>
                <Button className="gap-2" size="lg">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-5 w-5"
                  >
                    <polygon points="5 3 19 12 5 21 5 3"></polygon>
                  </svg>
                  Google Play
                </Button>
              </div>
            </div>
            <div className="relative mx-auto h-[500px] w-[250px] md:mx-0">
              <div className="absolute left-0 top-0 h-full w-full rounded-[40px] border-8 border-black bg-black shadow-xl">
                <div className="absolute inset-0 overflow-hidden rounded-[32px]">
                  <img
                    src="https://res.cloudinary.com/dy8p5yjsd/image/upload/v1743844390/z6216454853435_b8e8287d2dc52631f1948c222bb885a6_drwnjj.jpg?height=800&width=400"
                    alt="Mobile app screenshot"
                    className="h-full w-full object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    <Footer/>        
    </div>
  )
}

