"use client"

import { useState, useEffect } from "react"
import { format, parseISO, isAfter } from "date-fns"
import { vi } from "date-fns/locale"
import { Copy, Gift, Search, Tag, Clock, CheckCircle, AlertCircle, Percent } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import toast, { Toaster, ToastBar } from "react-hot-toast"
import { useDebounce } from "@/hooks/use-debounce"
import { getSavedDiscounts, type SavedDiscount } from "@/services/discount.service"
import { photographerService, type Photographer } from "@/services/photographer.service"
import Link from "next/link"

// Helper function to get discount status
const getDiscountStatus = (discount: SavedDiscount): "active" | "expired" | "used" => {
  const now = new Date()
  const validTo = new Date(discount.discount.valid_to)

  if (discount.times_used > 0) {
    return "used"
  }

  if (isAfter(now, validTo)) {
    return "expired"
  }

  return "active"
}

// Helper function to get status badge variant
const getStatusBadgeVariant = (status: "active" | "expired" | "used") => {
  switch (status) {
    case "active":
      return "default"
    case "expired":
      return "destructive"
    case "used":
      return "secondary"
    default:
      return "default"
  }
}

// Helper function to translate status
const translateStatus = (status: "active" | "expired" | "used") => {
  switch (status) {
    case "active":
      return "Có thể sử dụng"
    case "expired":
      return "Đã hết hạn"
    case "used":
      return "Đã sử dụng"
    default:
      return status
  }
}

export default function MyDiscountsPage() {
  const [discounts, setDiscounts] = useState<SavedDiscount[]>([])
  const [filteredDiscounts, setFilteredDiscounts] = useState<SavedDiscount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all")
  const [selectedDiscount, setSelectedDiscount] = useState<SavedDiscount | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [photographer, setPhotographer] = useState<Photographer>()

  // Stats calculations
  const activeCount = discounts.filter((d) => getDiscountStatus(d) === "active").length
  const expiredCount = discounts.filter((d) => getDiscountStatus(d) === "expired").length
  const usedCount = discounts.filter((d) => getDiscountStatus(d) === "used").length

  // Load initial data
  useEffect(() => {
    const loadDiscounts = async () => {
      try {
        setLoading(true)
        const response = await getSavedDiscounts()
        setDiscounts(response.user_discounts || [])
        console.log(response)
      } catch (error) {
        console.error("Failed to fetch discounts:", error)
        toast.error("Không thể tải danh sách mã giảm giá")
      } finally {
        setLoading(false)
      }
    }

    loadDiscounts()
  }, [toast])

  // Filter discounts based on search term, status, and type
  useEffect(() => {
    let result = [...discounts]

    // Apply tab filter first
    if (activeTab !== "all") {
      result = result.filter((discount) => getDiscountStatus(discount) === activeTab)
    }

    if (debouncedSearchTerm) {
      result = result.filter(
        (discount) =>
          discount.discount.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          discount.discount.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((discount) => getDiscountStatus(discount) === statusFilter)
    }

    if (typeFilter !== "all") {
      result = result.filter((discount) => discount.discount.discount_type === typeFilter)
    }

    setFilteredDiscounts(result)
  }, [discounts, activeTab, debouncedSearchTerm, statusFilter, typeFilter])

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Đã sao chép mã giảm giá ${code} vào clipboard`)
  }

  const handleViewDetail = async (discount: SavedDiscount) => {
    setSelectedDiscount(discount)
    setIsDetailDialogOpen(true)
    const photographer = await photographerService.getPhotographerById(discount.photographer_id)
    setPhotographer(photographer)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold">Mã giảm giá của tôi</h1>
          <p className="text-muted-foreground mt-1">Quản lý và sử dụng các mã giảm giá của bạn</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Có thể sử dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{activeCount}</div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">Mã giảm giá còn hiệu lực</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Đã hết hạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{expiredCount}</div>
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">Mã giảm giá đã hết hạn</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50 dark:bg-gray-800/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã sử dụng</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{usedCount}</div>
              <p className="text-xs text-gray-600/70 dark:text-gray-400/70 mt-1">Mã giảm giá đã được sử dụng</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Filters */}
        <div className="space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-4 w-full sm:w-auto">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="active" className="text-green-600">
                Có thể sử dụng
              </TabsTrigger>
              <TabsTrigger value="expired" className="text-red-600">
                Đã hết hạn
              </TabsTrigger>
              <TabsTrigger value="used" className="text-gray-600">
                Đã sử dụng
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {/* Filters */}
          <div className="bg-card border rounded-lg p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm theo mã, mô tả hoặc nhiếp ảnh gia..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="active">Có thể sử dụng</SelectItem>
                    <SelectItem value="expired">Đã hết hạn</SelectItem>
                    <SelectItem value="used">Đã sử dụng</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Loại giảm giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả loại</SelectItem>
                    <SelectItem value="fixed">Cố định (VND)</SelectItem>
                    <SelectItem value="percent">Phần trăm (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </div>

        {/* Discounts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden">
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4" />
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="space-y-4">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-8 w-1/2" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Skeleton className="h-10 w-full" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredDiscounts.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
              <Gift className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">Không tìm thấy mã giảm giá nào</h3>
            <p className="text-muted-foreground mt-1">
              {searchTerm || statusFilter !== "all" || typeFilter !== "all" || activeTab !== "all"
                ? "Thử thay đổi bộ lọc để xem kết quả khác"
                : "Bạn chưa có mã giảm giá nào. Hãy khám phá các dịch vụ để nhận mã giảm giá!"}
            </p>
            {(searchTerm || statusFilter !== "all" || typeFilter !== "all" || activeTab !== "all") && (
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setStatusFilter("all")
                  setTypeFilter("all")
                  setActiveTab("all")
                }}
              >
                Xóa bộ lọc
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredDiscounts.map((savedDiscount) => {
              const discount = savedDiscount.discount
              const status = getDiscountStatus(savedDiscount)
              const isActive = status === "active"
              const isExpired = status === "expired"

              return (
                <Card
                  key={savedDiscount.id}
                  className={`overflow-hidden transition-all hover:shadow-md ${
                    isActive ? "border-green-200" : isExpired ? "border-red-200" : "border-gray-200"
                  }`}
                >
                  <CardHeader className="pb-0">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg truncate">
                        Mã giảm giá
                      </CardTitle>
                      <Badge variant={getStatusBadgeVariant(status)}>{translateStatus(status)}</Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium">{discount.code.toUpperCase()}</p>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-2">
                    <div className="space-y-4">
                      <div>
                        <p className="text-sm text-muted-foreground line-clamp-5">{discount.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div
                          className={`p-2 rounded-md ${
                            discount.discount_type === "percent"
                              ? "bg-blue-50 text-blue-700"
                              : "bg-purple-50 text-purple-700"
                          }`}
                        >
                          {discount.discount_type === "percent" ? (
                            <Percent className="h-5 w-5" />
                          ) : (
                            <Tag className="h-5 w-5" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">Giá trị</p>
                          <p className="text-xl font-bold">
                            {discount.discount_type === "fixed"
                              ? `${discount.value.toLocaleString()} VND`
                              : `${discount.value}%`}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Clock className="h-4 w-4" />
                        <span>Hết hạn: {format(parseISO(discount.valid_to), "dd/MM/yyyy", { locale: vi })}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2">
                    <Button variant="outline" className="flex-1" onClick={() => handleViewDetail(savedDiscount)}>
                      Chi tiết
                    </Button>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button className="flex-1" disabled={!isActive} onClick={() => handleCopyCode(discount.code)}>
                            <Copy className="h-4 w-4 mr-2" />
                            Sao chép mã
                          </Button>
                        </TooltipTrigger>
                        {!isActive && (
                          <TooltipContent>
                            <p>{isExpired ? "Mã giảm giá đã hết hạn" : "Mã giảm giá đã được sử dụng"}</p>
                          </TooltipContent>
                        )}
                      </Tooltip>
                    </TooltipProvider>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {/* Discount Detail Dialog */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Chi tiết mã giảm giá</DialogTitle>
            <DialogDescription>Thông tin chi tiết về mã giảm giá</DialogDescription>
          </DialogHeader>
          {selectedDiscount && (
            <ScrollArea className="max-h-[60vh]">
              <div className="space-y-6 p-6">
                {/* Discount Code */}
                <div className="bg-muted p-4 rounded-lg text-center">
                  <p className="text-sm text-muted-foreground mb-1">Mã giảm giá</p>
                  <div className="flex items-center justify-center gap-2">
                    <code className="relative rounded bg-muted px-[0.5rem] py-[0.3rem] font-mono text-lg font-semibold">
                      {selectedDiscount.discount.code.toUpperCase()}
                    </code>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => handleCopyCode(selectedDiscount.discount.code.toUpperCase())}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Status */}
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Trạng thái:</span>
                  <Badge variant={getStatusBadgeVariant(getDiscountStatus(selectedDiscount))}>
                    {translateStatus(getDiscountStatus(selectedDiscount))}
                  </Badge>
                </div>

                {/* Discount Value */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Giá trị giảm giá:</span>
                    <span className="font-bold">
                      {selectedDiscount.discount.discount_type === "fixed"
                        ? `${selectedDiscount.discount.value.toLocaleString()} VND`
                        : `${selectedDiscount.discount.value}%`}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Loại giảm giá:</span>
                    <span>{selectedDiscount.discount.discount_type === "fixed" ? "Cố định (VND)" : "Phần trăm (%)"}</span>
                  </div>
                </div>

                <Separator />

                {/* Validity Period */}
                <div className="space-y-4">
                  {/* Photographer Info */}
                  <div className="flex items-center gap-3 pb-3 border-b">
                    <Avatar className="h-12 w-12">
                      <AvatarImage src={photographer?.avatar_url} />
                      <AvatarFallback>
                        {photographer?.full_name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">
                        <Link href={`/photographers/${photographer?.slug}`}>{photographer?.full_name}</Link>
                      </p>
                      <p className="text-sm text-muted-foreground">Nhiếp ảnh gia</p>
                    </div>
                  </div>

                  {/* Validity Period */}
                  <div>
                    <h4 className="text-sm font-medium mb-2">Thời hạn sử dụng</h4>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ngày bắt đầu:</span>
                        <span>{format(parseISO(selectedDiscount.discount.valid_from), "dd/MM/yyyy", { locale: vi })}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm">Ngày kết thúc:</span>
                        <span>{format(parseISO(selectedDiscount.discount.valid_to), "dd/MM/yyyy", { locale: vi })}</span>
                      </div>
                      {getDiscountStatus(selectedDiscount) === "active" && (
                        <div>
                          <div className="flex items-center justify-between text-sm mb-1">
                            <span>Thời gian còn lại:</span>
                            <span className="text-green-600">
                              {(() => {
                                const now = new Date()
                                const validTo = parseISO(selectedDiscount.discount.valid_to)
                                const diffTime = Math.abs(validTo.getTime() - now.getTime())
                                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
                                return `${diffDays} ngày`
                              })()}
                            </span>
                          </div>
                          <Progress
                            value={(() => {
                              const now = new Date()
                              const validFrom = parseISO(selectedDiscount.discount.valid_from)
                              const validTo = parseISO(selectedDiscount.discount.valid_to)
                              const total = validTo.getTime() - validFrom.getTime()
                              const elapsed = now.getTime() - validFrom.getTime()
                              return Math.min(100, Math.max(0, (elapsed / total) * 100))
                            })()}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Mô tả</h4>
                  <p className="text-sm text-muted-foreground">{selectedDiscount.discount.description}</p>
                </div>

                {/* Usage Info */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Thông tin sử dụng</h4>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      {selectedDiscount.times_used > 0 ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      )}
                      <span>
                        {selectedDiscount.times_used > 0
                          ? `Đã sử dụng ${selectedDiscount.times_used} lần`
                          : "Chưa sử dụng mã giảm giá này"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Terms and Conditions */}
                <div>
                  <h4 className="text-sm font-medium mb-2">Điều khoản và điều kiện</h4>
                  <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
                    <li>Mỗi mã giảm giá chỉ có thể sử dụng một lần</li>
                    <li>Không thể kết hợp với các mã giảm giá khác</li>
                    <li>
                      Mã giảm giá có hiệu lực đến hết ngày{" "}
                      {format(parseISO(selectedDiscount.discount.valid_to), "dd/MM/yyyy", { locale: vi })}
                    </li>
                  </ul>
                </div>
              </div>
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <Toaster position="bottom-right">
        {(t) => (
          <ToastBar toast={t}>
            {({ icon, message }) => (
              <>
                {icon}
                {message}
                {t.type !== "loading" && (
                  <button onClick={() => toast.dismiss(t.id)}>X</button>
                )}
              </>
            )}
          </ToastBar>
        )}
      </Toaster>
    </div>
  )
}
