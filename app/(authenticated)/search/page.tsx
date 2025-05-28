"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Search, MapPin, Loader2, LayoutGrid, List, X, ChevronLeft, ChevronRight, Users } from "lucide-react"
import { photographerService, SimplifiedPhotographerFilters, type SimplifiedPhotographerProfile } from "@/services/photographer.service"
import { getTags, type Tag } from "@/services/tags.service"
import { useDebounce } from "@/hooks/use-debounce"
import { formatCurrency } from "@/lib/utils"

// Filter component
const FilterSection = ({
  onFilterChange,
  filters,
  availableTags,
  viewMode,
  onViewModeChange,
}: {
  onFilterChange: (filters: SimplifiedPhotographerFilters) => void
  filters: SimplifiedPhotographerFilters
  availableTags: Tag[]
  viewMode: "grid" | "list"
  onViewModeChange: (mode: "grid" | "list") => void
}) => {
  return (
    <div className="space-y-4 p-4 bg-muted/50 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Khoảng giá</label>
          <div className="space-y-2">
            <Slider
              defaultValue={[filters.min_price || 0, filters.max_price || 1000000]}
              max={1000000}
              step={100000}
              onValueChange={(value) => onFilterChange({ ...filters, min_price: value[0], max_price: value[1] })}
            />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatCurrency(filters.min_price || 0)}</span>
              <span>{formatCurrency(filters.max_price || 1000000)}</span>
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Kinh nghiệm tối thiểu</label>
          <Select
            value={filters.min_experience?.toString()}
            onValueChange={(value) => onFilterChange({ ...filters, min_experience: parseInt(value) })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Chọn số năm kinh nghiệm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">Tất cả</SelectItem>
              <SelectItem value="1">1+ năm</SelectItem>
              <SelectItem value="2">2+ năm</SelectItem>
              <SelectItem value="3">3+ năm</SelectItem>
              <SelectItem value="5">5+ năm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Sắp xếp theo</label>
          <Select
            value={filters.sort_by}
            onValueChange={(value) => onFilterChange({ ...filters, sort_by: value as SimplifiedPhotographerFilters['sort_by'] })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sắp xếp" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="rating">Đánh giá cao nhất</SelectItem>
              <SelectItem value="price_low">Giá: Thấp đến cao</SelectItem>
              <SelectItem value="price_high">Giá: Cao đến thấp</SelectItem>
              <SelectItem value="experience">Kinh nghiệm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Chế độ xem</label>
          <div className="flex gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              type="button"
              onClick={() => onViewModeChange("grid")}
            >
              <LayoutGrid className="h-4 w-4 mr-2" />
              Lưới
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              type="button"
              onClick={() => onViewModeChange("list")}
            >
              <List className="h-4 w-4 mr-2" />
              Danh sách
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Tags</label>
        <div className="flex flex-wrap gap-2">
          {availableTags.map((tag) => (
            <Badge
              key={tag.name}
              variant={filters.tags?.includes(tag.name) ? "default" : "outline"}
              className="cursor-pointer"
              onClick={() => {
                const newTags = filters.tags?.includes(tag.name)
                  ? filters.tags.filter(t => t !== tag.name)
                  : [...(filters.tags || []), tag.name];
                onFilterChange({ ...filters, tags: newTags });
              }}
            >
              {tag.name}
              {filters.tags?.includes(tag.name) && (
                <X className="h-3 w-3 ml-1" />
              )}
            </Badge>
          ))}
        </div>
      </div>
    </div>
  )
}

// PhotographersList component
const PhotographersList = ({
  photographers,
  viewMode,
  loading,
}: {
  photographers: SimplifiedPhotographerProfile[]
  viewMode: string
  loading: boolean
}) => {
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

  const formatLocation = (photographer: SimplifiedPhotographerProfile) => {
    const parts = [
      photographer.ward,
      photographer.district,
      photographer.province
    ].filter(Boolean);
    return parts.length > 0 ? parts.join(', ') : "Chưa cập nhật";
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[200px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary mb-4" />
        <p className="text-base font-medium">Đang tải ...</p>
      </div>
    )
  }

  if (photographers.length === 0) {
    return (
      <div className="text-center py-12">
        <h3 className="text-lg font-medium mb-2">Không tìm thấy nhiếp ảnh gia</h3>
        <p className="text-muted-foreground">Hãy điều chỉnh tìm kiếm hoặc bộ lọc</p>
      </div>
    )
  }

  const renderGridView = () => (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
    >
      {photographers.map((photographer) => (
        <motion.div
          key={photographer.slug}
          variants={item}
        >
          <Link href={`/photographers/${photographer.slug}`} className="block h-full">
            <Card className="overflow-hidden h-full transition-all duration-300 shadow-md hover:shadow-2xl hover:scale-105 hover:shadow-primary hover:z-50">
              <div className="relative h-48">
                <Image
                  src={photographer.avatar || "/placeholder.svg"}
                  alt={photographer.full_name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              </div>
              <CardContent className="p-4">
                <h3 className="font-bold text-lg mb-2">{photographer.full_name}</h3>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{photographer.province}, {photographer.district}, {photographer.ward}</span>
                </div>
                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span className="truncate">📌{photographer.address_detail}</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <span className="truncate">Đánh giá: {photographer.average_rating} ⭐</span>
                </div>

                <div className="flex items-center text-sm text-muted-foreground mb-2">
                  <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">{photographer.total_bookings} lượt đặt </span>
                </div>
                
                <Badge variant="outline" className="bg-primary/10 text-primary">
                  {formatCurrency(photographer.price_per_hour)}/giờ
                </Badge>
              </CardContent>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )

  const renderListView = () => (
    <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
      {photographers.map((photographer) => (
        <motion.div
          key={photographer.slug}
          variants={item}
        >
          <Link href={`/photographers/${photographer.slug}`} className="block">
            <Card className="overflow-hidden transition-all shadow-md hover:shadow-2xl hover:scale-105 hover:shadow-primary">
              <div className="flex flex-col sm:flex-row">
                <div className="relative w-full sm:w-48 h-48">
                  <Image
                    src={photographer.avatar || "/placeholder.svg"}
                    alt={photographer.full_name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 192px"
                  />
                </div>
                <CardContent className="flex-1 p-4">
                  <h3 className="font-bold text-lg mb-2">{photographer.full_name}</h3>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <MapPin className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span>{formatLocation(photographer)}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span className="truncate">📌{photographer.address_detail}</span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <Users className="h-3 w-3 mr-1 flex-shrink-0" />
                    <span className="truncate">{photographer.total_bookings} lượt đặt </span>
                  </div>
                  <div className="flex items-center text-sm text-muted-foreground mb-2">
                    <span className="truncate">Đánh giá: {photographer.average_rating} ⭐</span>
                  </div>
                  <Badge variant="outline" className="bg-primary/10 text-primary">
                    {formatCurrency(photographer.price_per_hour)}/giờ
                  </Badge>
                </CardContent>
              </div>
            </Card>
          </Link>
        </motion.div>
      ))}
    </motion.div>
  )

  return viewMode === "grid" ? renderGridView() : renderListView()
}

export default function PhotographersDirectory() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [photographers, setPhotographers] = useState<SimplifiedPhotographerProfile[]>([])
  const [totalPhotographers, setTotalPhotographers] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState(searchParams.get("search") || "")
  const [availableTags, setAvailableTags] = useState<Tag[]>([])
  const [viewMode, setViewMode] = useState<"grid" | "list">(searchParams.get("view") as "grid" | "list" || "grid")
  const [currentPage, setCurrentPage] = useState(parseInt(searchParams.get("page") || "1"))
  const debouncedSearchQuery = useDebounce(searchQuery, 500)
  const [filters, setFilters] = useState<SimplifiedPhotographerFilters>({
    min_price: parseInt(searchParams.get("min_price") || "0"),
    max_price: parseInt(searchParams.get("max_price") || "1000000"),
    min_experience: parseInt(searchParams.get("min_experience") || "0"),
    sort_by: (searchParams.get("sort_by") as SimplifiedPhotographerFilters['sort_by']) || "rating",
    tags: searchParams.get("tags")?.split(",") || []
  })

  const ITEMS_PER_PAGE = 12

  // Update URL params when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (debouncedSearchQuery) params.set("search", debouncedSearchQuery)
    if (filters.min_price) params.set("min_price", filters.min_price.toString())
    if (filters.max_price) params.set("max_price", filters.max_price.toString())
    if (filters.min_experience) params.set("min_experience", filters.min_experience.toString())
    if (filters.sort_by) params.set("sort_by", filters.sort_by)
    if (filters.tags?.length) params.set("tags", filters.tags.join(","))
    if (currentPage > 1) params.set("page", currentPage.toString())
    if (viewMode !== "grid") params.set("view", viewMode)

    router.push(`/search?${params.toString()}`)
  }, [debouncedSearchQuery, filters, currentPage, viewMode, router])

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const response = await getTags("photographer");
        setAvailableTags(response);
      } catch (err) {
        console.error("Error fetching tags:", err);
      }
    };

    fetchTags();
  }, []);

  useEffect(() => {
    const fetchPhotographers = async () => {
      try {
        setLoading(true)
        setError(null)
        const response = await photographerService.getSimplifiedPhotographers({
          skip: (currentPage - 1) * ITEMS_PER_PAGE,
          limit: ITEMS_PER_PAGE,
          search: debouncedSearchQuery,
          min_price: filters.min_price,
          max_price: filters.max_price,
          min_experience: filters.min_experience,
          tags: filters.tags,
          sort_by: filters.sort_by
        })
        setPhotographers(response.photographers)
        setTotalPhotographers(response.total)
      } catch (err) {
        setError("Failed to load photographers. Please try again later.")
        console.error("Error fetching photographers:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchPhotographers()
  }, [debouncedSearchQuery, filters, currentPage])

  const totalPages = Math.ceil(totalPhotographers / ITEMS_PER_PAGE)

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-4 bg-destructive/10 text-destructive rounded-lg"
        >
          {error}
        </motion.div>
      )}

      <div className="mb-8">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, vị trí hoặc chuyên môn..."
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <FilterSection 
        onFilterChange={setFilters} 
        filters={filters} 
        availableTags={availableTags}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
      />

      <div className="mt-8 min-h-[300px]">
        <PhotographersList
          photographers={photographers}
          viewMode={viewMode}
          loading={loading}
        />
      </div>

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={currentPage === page ? "default" : "outline"}
              size="icon"
              onClick={() => handlePageChange(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            variant="outline"
            size="icon"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}