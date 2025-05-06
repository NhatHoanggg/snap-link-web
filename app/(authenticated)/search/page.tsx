"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, MapPin, Star, Calendar, SlidersHorizontal, Users, Clock, Loader2 } from "lucide-react"
import { photographerService, type Photographer } from "@/services/photographer.service"

export default function PhotographersDirectory() {
  const [photographers, setPhotographers] = useState<Photographer[]>([])
  const [filteredPhotographers, setFilteredPhotographers] = useState<Photographer[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [sortBy, setSortBy] = useState("rating")
  const [viewMode, setViewMode] = useState("grid")
  const [priceRange, setPriceRange] = useState("all")
  const [hoveredPhotographer, setHoveredPhotographer] = useState<Photographer | null>(null)
  const [showModal, setShowModal] = useState(false)
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await photographerService.getPhotographers({
          skip: 0,
          limit: 100,
          search: searchQuery,
        })
        setPhotographers(response.photographers)
        setFilteredPhotographers(response.photographers)
      } catch (err) {
        setError("Failed to load photographers. Please try again later.")
        console.error("Error fetching photographers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotographers()
  }, [searchQuery])

  useEffect(() => {
    let result = [...photographers]

    // Apply price range filter
    if (priceRange !== "all") {
      switch (priceRange) {
        case "low":
          result = result.filter((photographer) => photographer.price_per_hour < 450000)
          break
        case "medium":
          result = result.filter(
            (photographer) => photographer.price_per_hour >= 450000 && photographer.price_per_hour < 550000,
          )
          break
        case "high":
          result = result.filter((photographer) => photographer.price_per_hour >= 550000)
          break
      }
    }

    // Apply sorting
    switch (sortBy) {
      case "rating":
        result.sort((a, b) => b.average_rating - a.average_rating)
        break
      case "price_low":
        result.sort((a, b) => a.price_per_hour - b.price_per_hour)
        break
      case "price_high":
        result.sort((a, b) => b.price_per_hour - a.price_per_hour)
        break
      case "bookings":
        result.sort((a, b) => b.total_bookings - a.total_bookings)
        break
      case "experience":
        result.sort((a, b) => (b.experience_years || 0) - (a.experience_years || 0))
        break
      case "name":
        result.sort((a, b) => a.full_name.localeCompare(b.full_name))
        break
    }

    setFilteredPhotographers(result)
  }, [photographers, sortBy, priceRange])

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const formatLocation = (photographer: Photographer) => {
    const parts = [
      photographer.ward,
      photographer.district,
      photographer.province
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : "Chưa cập nhật";
  };

  const handleMouseEnter = (photographer: Photographer) => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
    }

    hoverTimeoutRef.current = setTimeout(() => {
      setHoveredPhotographer(photographer)
      setShowModal(true)
    }, 500) // Show modal after 500ms hover
  }

  const handleMouseLeave = () => {
    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current)
      hoverTimeoutRef.current = null
    }
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-lg font-medium">Loading photographers...</p>
      </div>
    )
  }

  const renderNoPhotographersFound = () => (
    <div className="text-center py-12">
      <Users className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
      <h3 className="text-lg font-medium mb-2">No photographers found</h3>
      <p className="text-muted-foreground">Try adjusting your search or filters</p>
    </div>
  )

  const renderGridView = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {filteredPhotographers.map((photographer) => (
        <motion.div
          key={photographer.photographer_id}
          variants={item}
          className="relative"
          onMouseEnter={() => handleMouseEnter(photographer)}
          onMouseLeave={handleMouseLeave}
        >
          <Link href={`/photographers/${photographer.slug}`} className="block h-full">
            <Card className="overflow-hidden h-full hover:shadow-lg transition-all duration-300">
              <div className="relative h-64">
                <Image
                  src={photographer.avatar || "/placeholder.svg"}
                  alt={photographer.full_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-white font-bold text-lg truncate">{photographer.full_name}</h3>
                  <div className="flex items-center text-white/90 text-sm">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{formatLocation(photographer)}</span>
                  </div>
                </div>
                {photographer.average_rating > 0 && (
                  <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-2 py-1 rounded-md flex items-center">
                    <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                    {photographer.average_rating.toFixed(1)}
                  </div>
                )}
              </div>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-3">
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {formatPrice(photographer.price_per_hour)}/hour
                  </Badge>
                  {photographer.experience_years > 0 && (
                    <div className="flex items-center text-xs text-muted-foreground">
                      <Clock className="h-3 w-3 mr-1" />
                      {photographer.experience_years} năm kinh nghiệm
                    </div>
                  )}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">{photographer.bio}</p>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )

  const renderListView = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {filteredPhotographers.map((photographer) => (
        <motion.div
          key={photographer.photographer_id}
          variants={item}
          onMouseEnter={() => handleMouseEnter(photographer)}
          onMouseLeave={handleMouseLeave}
        >
          <Link href={`/photographers/${photographer.slug}`} className="block">
            <Card className="overflow-hidden transition-all hover:shadow-md">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48">
                  <Image
                    src={photographer.avatar || "/placeholder.svg"}
                    alt={photographer.full_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                  {photographer.average_rating > 0 && (
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-2 py-1 rounded-md flex items-center">
                      <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                      {photographer.average_rating.toFixed(1)}
                    </div>
                  )}
                </div>
                <CardContent className="flex-1 p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h3 className="font-bold text-lg">{photographer.full_name}</h3>
                    <Badge variant="outline" className="bg-primary/10 text-primary mt-1 sm:mt-0 w-fit">
                      {formatPrice(photographer.price_per_hour)}/hour
                    </Badge>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-3">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{formatLocation(photographer)}</span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{photographer.bio}</p>
                  <div className="flex flex-wrap gap-3 text-xs">
                    {photographer.experience_years > 0 && (
                      <div className="flex items-center text-muted-foreground">
                        <Clock className="h-3 w-3 mr-1" />
                        {photographer.experience_years} năm kinh nghiệm
                      </div>
                    )}
                    {photographer.average_rating > 0 && (
                      <div className="flex items-center text-muted-foreground">
                        <Star className="h-3 w-3 mr-1" />
                        {photographer.average_rating.toFixed(1)} rating
                      </div>
                    )}
                  </div>
                </CardContent>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold mb-2">Photographers Directory</h1>
        <p className="text-muted-foreground">
          Find and connect with {photographers.length} talented photographers in Đà Nẵng
        </p>
      </motion.div>

      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Search and Filters */}
      <div className="mb-8 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, location or specialty..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="rating">Highest Rated</SelectItem>
                <SelectItem value="price_low">Price: Low to High</SelectItem>
                <SelectItem value="price_high">Price: High to Low</SelectItem>
                <SelectItem value="bookings">Most Bookings</SelectItem>
                <SelectItem value="experience">Most Experience</SelectItem>
                <SelectItem value="name">Name (A-Z)</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <SlidersHorizontal className="h-4 w-4" />
                  <span className="hidden sm:inline">Filters</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Price Range</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setPriceRange("all")}>
                  <span className={priceRange === "all" ? "font-bold" : ""}>All Prices</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("low")}>
                  <span className={priceRange === "low" ? "font-bold" : ""}>Under 450,000₫</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("medium")}>
                  <span className={priceRange === "medium" ? "font-bold" : ""}>450,000₫ - 550,000₫</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setPriceRange("high")}>
                  <span className={priceRange === "high" ? "font-bold" : ""}>Over 550,000₫</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Showing <span className="font-medium">{filteredPhotographers.length}</span> photographers
          </p>

          <Tabs value={viewMode} onValueChange={setViewMode} className="w-auto">
            <TabsList className="grid w-[160px] grid-cols-2">
              <TabsTrigger value="grid">Grid View</TabsTrigger>
              <TabsTrigger value="list">List View</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </div>

      {viewMode === "grid"
        ? filteredPhotographers.length === 0
          ? renderNoPhotographersFound()
          : renderGridView()
        : filteredPhotographers.length === 0
          ? renderNoPhotographersFound()
          : renderListView()}

      {/* Photographer Detail Modal */}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent
          className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto"
          onPointerDownOutside={() => setShowModal(false)}
        >
          {hoveredPhotographer && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl">{hoveredPhotographer.full_name}</DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                <div>
                  <div className="relative h-80 rounded-lg overflow-hidden">
                    <Image
                      src={hoveredPhotographer.avatar || "/placeholder.svg"}
                      alt={hoveredPhotographer.full_name}
                      fill
                      className="object-cover"
                    />
                    {hoveredPhotographer.average_rating > 0 && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm text-white text-sm font-medium px-2 py-1 rounded-md flex items-center">
                        <Star className="h-3 w-3 mr-1 text-yellow-400 fill-yellow-400" />
                        {hoveredPhotographer.average_rating.toFixed(1)}
                      </div>
                    )}
                  </div>

                  <div className="mt-4 space-y-2">
                    <div className="flex items-center text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{formatLocation(hoveredPhotographer)}</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{hoveredPhotographer.experience_years} năm kinh nghiệm</span>
                    </div>

                    <div className="flex items-center text-sm">
                      <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                      <span>{hoveredPhotographer.total_bookings} bookings</span>
                    </div>

                    <div className="mt-3">
                      <Badge className="bg-primary text-primary-foreground">
                        {formatPrice(hoveredPhotographer.price_per_hour)}/hour
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-2">About</h3>
                    <p className="text-sm text-muted-foreground">{hoveredPhotographer.bio}</p>
                  </div>

                  {/* {hoveredPhotographer.specialties && hoveredPhotographer.specialties.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {hoveredPhotographer.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )} */}

                  {hoveredPhotographer.featured_photos && hoveredPhotographer.featured_photos.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Featured Photos</h3>
                      <div className="grid grid-cols-2 gap-2">
                        {hoveredPhotographer.featured_photos.map((photo) => (
                          <div key={photo.featured_photo_id} className="relative h-32 rounded-md overflow-hidden">
                            <Image
                              src={photo.image_url || "/placeholder.svg"}
                              alt={photo.title}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2">
                              <p className="text-white text-xs truncate">{photo.title}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4">
                    <Button asChild className="w-full">
                      <Link href={`/photographers/${hoveredPhotographer.slug}`}>View Full Profile</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
