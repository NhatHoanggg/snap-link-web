"use client"

import { useEffect, useState } from "react"
import { getRequests, type RequestResponse } from "@/services/request.service"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { CalendarIcon, Clock, DollarSign, Filter, MapPin, Search, Tag, X } from "lucide-react"
import Link from "next/link"

export default function RequestsPage() {
  const [requests, setRequests] = useState<RequestResponse[]>([])
  const [filteredRequests, setFilteredRequests] = useState<RequestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Filter states
  const [budgetRange, setBudgetRange] = useState<[number, number]>([0, 5000])
  const [selectedCity, setSelectedCity] = useState<string>("all")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  // Get unique cities from requests
  const cities = [...new Set(requests.map((request) => request.city))].sort()

  // Get min and max budget from requests
  const minBudget = requests.length > 0 ? Math.min(...requests.map((request) => Number(request.estimated_budget))) : 0
  const maxBudget = requests.length > 0 ? Math.max(...requests.map((request) => Number(request.estimated_budget))) : 5000

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const data = await getRequests()
        setRequests(data)
        setFilteredRequests(data)

        // Initialize budget range with actual min/max values
        if (data.length > 0) {
          const min = Math.min(...data.map((request: RequestResponse) => Number(request.estimated_budget)))
          const max = Math.max(...data.map((request: RequestResponse) => Number(request.estimated_budget)))
          setBudgetRange([min, max])
        }
      } catch (err) {
        setError("Không thể tải danh sách buổi chụp")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchRequests()
  }, [])

  // Apply filters when filter values change
  useEffect(() => {
    if (requests.length === 0) return

    let result = [...requests]

    // Filter by budget range
    result = result.filter((request) => {
      const budget = Number(request.estimated_budget)
      return budget >= budgetRange[0] && budget <= budgetRange[1]
    })

    // Filter by city
    if (selectedCity && selectedCity !== "all") {
      result = result.filter((request) => request.city.toLowerCase() === selectedCity.toLowerCase())
    }

    // Filter by date
    if (selectedDate) {
      result = result.filter((request) => {
        const requestDate = new Date(request.request_date)
        return (
          requestDate.getFullYear() === selectedDate.getFullYear() &&
          requestDate.getMonth() === selectedDate.getMonth() &&
          requestDate.getDate() === selectedDate.getDate()
        )
      })
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      result = result.filter(
        (request) =>
          request.concept.toLowerCase().includes(term) ||
          request.request_code.toLowerCase().includes(term) ||
          request.shooting_type.toLowerCase().includes(term) ||
          request.location_text.toLowerCase().includes(term)
      )
    }

    setFilteredRequests(result)
  }, [requests, budgetRange, selectedCity, selectedDate, searchTerm])

  const resetFilters = () => {
    if (requests.length > 0) {
      const min = Math.min(...requests.map((request: RequestResponse) => Number(request.estimated_budget)))
      const max = Math.max(...requests.map((request: RequestResponse) => Number(request.estimated_budget)))
      setBudgetRange([min, max])
    } else {
      setBudgetRange([0, 5000])
    }
    setSelectedCity("all")
    setSelectedDate(undefined)
    setSearchTerm("")
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "matched":
        return "bg-green-100 text-green-800 border-green-200"
      case "open":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "closed":
        return "bg-gray-100 text-gray-800 border-gray-200"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "matched":
        return "Đã ghép"
      case "open":
        return "Đang mở"
      case "closed":
        return "Đã đóng"
      default:
        return status
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        <p className="text-muted-foreground">Đang tải danh sách buổi chụp...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-destructive text-lg font-medium">{error}</div>
        <Button onClick={() => window.location.reload()}>Thử lại</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Danh Sách Buổi Chụp</h1>
          <p className="text-muted-foreground mt-1">Tìm kiếm và quản lý các buổi chụp của bạn</p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Tìm kiếm buổi chụp..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2" onClick={() => setSearchTerm("")}>
                <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              </button>
            )}
          </div>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={cn(isFilterOpen && "border-primary text-primary")}
          >
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Filter Section */}
      {isFilterOpen && (
        <div className="bg-card rounded-lg border border-border p-4 mb-6 animate-in fade-in-50 slide-in-from-top-5 duration-300">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-lg">Bộ lọc</h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Đặt lại
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Budget Range Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-muted-foreground" />
                Ngân sách ({budgetRange[0]} VNĐ - {budgetRange[1]} VNĐ)
              </Label>
              <Slider
                defaultValue={[minBudget, maxBudget]}
                min={minBudget}
                max={maxBudget}
                step={100}
                value={budgetRange}
                onValueChange={(value) => setBudgetRange(value as [number, number])}
                className="py-4"
              />
            </div>

            {/* City Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Thành phố
              </Label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger>
                  <SelectValue placeholder="Chọn thành phố" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả thành phố</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Date Filter */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                Ngày chụp
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !selectedDate && "text-muted-foreground",
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {selectedDate ? format(selectedDate, "PPP", { locale: vi }) : "Chọn ngày"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                  {selectedDate && (
                    <div className="p-3 border-t border-border">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedDate(undefined)}
                        className="text-muted-foreground hover:text-foreground"
                      >
                        Xóa ngày
                      </Button>
                    </div>
                  )}
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Hiển thị {filteredRequests.length} trên tổng số {requests.length} buổi chụp
            </p>
          </div>
        </div>
      )}

      {/* Results */}
      {filteredRequests.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="bg-muted rounded-full p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium mb-2">Không tìm thấy buổi chụp nào</h3>
          <p className="text-muted-foreground max-w-md">
            Không có buổi chụp nào phù hợp với bộ lọc của bạn. Hãy thử điều chỉnh lại bộ lọc.
          </p>
          <Button variant="outline" className="mt-4" onClick={resetFilters}>
            Đặt lại bộ lọc
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRequests.map((request) => (
            <Link href={`/requests/${request.request_code}/offer`} key={request.request_id}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer border-border hover:border-primary/20">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <Badge variant="outline" className="flex items-center gap-1.5">
                      <Tag className="h-3 w-3" />#{request.request_code}
                    </Badge>
                    <Badge variant="outline" className={cn(getStatusColor(request.status))}>
                      {getStatusText(request.status)}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pb-2">
                  <h3 className="font-semibold text-lg mb-2 line-clamp-1">{request.concept}</h3>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start gap-2">
                      <CalendarIcon className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">Ngày chụp:</p>
                        <p>{format(new Date(request.request_date), "PPP", { locale: vi })}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">Loại chụp:</p>
                        <p>{request.shooting_type}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">Địa điểm:</p>
                        <p className="line-clamp-1">
                          {request.location_text}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <div>
                        <p className="text-muted-foreground">Thành phố:</p>
                        <p className="line-clamp-1">
                            {request.city}
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
                <CardFooter className="pt-2 border-t">
                  <div className="w-full flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <p className="text-muted-foreground">Ngân sách:</p>
                      <span className="font-semibold text-primary">
                        {request.estimated_budget.toLocaleString("vi-VN", {
                          style: "currency",
                          currency: "VND",
                        })}
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" className="text-xs">
                      Xem chi tiết
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
