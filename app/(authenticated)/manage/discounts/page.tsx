"use client"

import type React from "react"

import { useState, useEffect, useCallback, useMemo } from "react"
import { format, isAfter, isBefore, isValid } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, Check, Copy, Edit, Filter, Gift, Plus, RefreshCw, Search, Trash2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
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
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Skeleton } from "@/components/ui/skeleton"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose,
} from "@/components/ui/sheet"
import { getMyDiscount, createDiscountPhotographer, updateDiscount, deleteDiscount, type Discount, type DiscountCreate } from "@/services/discount.service"
import toast, { Toaster, ToastBar } from "react-hot-toast"
import { useDebounce } from "@/hooks/use-debounce"

// Helper function to get discount status
const getDiscountStatus = (discount: Discount): "active" | "expired" | "upcoming" | "inactive" => {
  const now = new Date()
  const validFrom = new Date(discount.valid_from)
  const validTo = new Date(discount.valid_to)

  if (!discount.is_active) {
    return "inactive"
  }

  if (isBefore(now, validFrom)) {
    return "upcoming"
  }

  if (isAfter(now, validTo)) {
    return "expired"
  }

  return "active"
}

// Helper function to translate status
const translateStatus = (status: "active" | "expired" | "upcoming" | "inactive") => {
  switch (status) {
    case "active":
      return "Đang hoạt động"
    case "expired":
      return "Đã hết hạn"
    case "upcoming":
      return "Sắp diễn ra"
    case "inactive":
      return "Không hoạt động"
    default:
      return status
  }
}

// Helper function to format discount value
const formatDiscountValue = (discount: Discount) => {
  if (discount.discount_type === "fixed") {
    return `${discount.value.toLocaleString()} VND`
  } else {
    return `${discount.value}%`
  }
}

export default function DiscountsPage() {
  const [discounts, setDiscounts] = useState<Discount[]>([])
  const [filteredDiscounts, setFilteredDiscounts] = useState<Discount[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const debouncedSearchTerm = useDebounce(searchTerm, 300)
  const [statusFilter, setStatusFilter] = useState("all")
  const [typeFilter, setTypeFilter] = useState("all")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [selectedDiscount, setSelectedDiscount] = useState<Discount | null>(null)
  const [formData, setFormData] = useState<DiscountCreate>({
    code: "",
    description: "",
    discount_type: "fixed",
    value: 0,
    max_uses: 100,
    valid_from: new Date().toISOString(),
    valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
    is_active: true,
  })
  const [formErrors, setFormErrors] = useState<Record<string, string>>({})
  const [activeTab, setActiveTab] = useState("all")
  const [actionLoading, setActionLoading] = useState<{
    create: boolean;
    update: boolean;
    delete: boolean;
    toggle: boolean;
  }>({
    create: false,
    update: false,
    delete: false,
    toggle: false,
  })

  // Memoize stats calculations
  const stats = useMemo(() => ({
    activeCount: discounts.filter((d) => getDiscountStatus(d) === "active").length,
    upcomingCount: discounts.filter((d) => getDiscountStatus(d) === "upcoming").length,
    expiredCount: discounts.filter((d) => getDiscountStatus(d) === "expired").length,
    inactiveCount: discounts.filter((d) => getDiscountStatus(d) === "inactive").length,
  }), [discounts])

  // Memoize filtered discounts
  const memoizedFilteredDiscounts = useMemo(() => {
    let result = discounts

    // Apply tab filter first
    if (activeTab !== "all") {
      result = result.filter((discount) => getDiscountStatus(discount) === activeTab)
    }

    if (debouncedSearchTerm) {
      result = result.filter(
        (discount) =>
          discount.code.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          discount.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== "all") {
      result = result.filter((discount) => getDiscountStatus(discount) === statusFilter)
    }

    if (typeFilter !== "all") {
      result = result.filter((discount) => discount.discount_type === typeFilter)
    }

    return result
  }, [discounts, activeTab, debouncedSearchTerm, statusFilter, typeFilter])
  useEffect(() => {
    setFilteredDiscounts(memoizedFilteredDiscounts)
  }, [memoizedFilteredDiscounts])

  const updateDiscountInList = useCallback((updatedDiscount: Discount) => {
    setDiscounts(prev => prev.map(d => d.id === updatedDiscount.id ? updatedDiscount : d))
  }, [])

  const removeDiscountFromList = useCallback((id: number) => {
    setDiscounts(prev => prev.filter(d => d.id !== id))
  }, [])

  const addDiscountToList = useCallback((newDiscount: Discount) => {
    setDiscounts(prev => [...prev, newDiscount])
  }, [])

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setLoading(true)
        const response = await getMyDiscount()
        setDiscounts(response.discounts)
      } catch (error) {
        console.error("Failed to load initial data:", error)
        toast.error("Không thể tải danh sách mã giảm giá")
      } finally {
        setLoading(false)
      }
    }

    loadInitialData()
  }, [])

  const handleCreateDiscount = async () => {
    // Validate form
    const errors: Record<string, string> = {}
    if (!formData.code) errors.code = "Mã giảm giá không được để trống"
    if (formData.value <= 0) errors.value = "Giá trị giảm giá phải lớn hơn 0"
    if (formData.max_uses <= 0) errors.max_uses = "Số lần sử dụng tối đa phải lớn hơn 0"

    const validFrom = new Date(formData.valid_from)
    const validTo = new Date(formData.valid_to)

    if (!isValid(validFrom)) errors.valid_from = "Ngày bắt đầu không hợp lệ"
    if (!isValid(validTo)) errors.valid_to = "Ngày kết thúc không hợp lệ"
    if (isValid(validFrom) && isValid(validTo) && isAfter(validFrom, validTo)) {
      errors.valid_to = "Ngày kết thúc phải sau ngày bắt đầu"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setActionLoading(prev => ({ ...prev, create: true }))
    try {
      const newDiscount = await createDiscountPhotographer(formData)
      addDiscountToList(newDiscount)
      setIsCreateDialogOpen(false)
      toast.success("Đã tạo mã giảm giá thành công")
      resetForm()
    } catch (error) {
      console.error("Failed to create discount:", error)
      toast.error("Không thể tạo mã giảm giá")
    } finally {
      setActionLoading(prev => ({ ...prev, create: false }))
    }
  }

  const handleUpdateDiscount = async () => {
    if (!selectedDiscount) return

    // Validate form
    const errors: Record<string, string> = {}
    if (!formData.code) errors.code = "Mã giảm giá không được để trống"
    if (formData.value <= 0) errors.value = "Giá trị giảm giá phải lớn hơn 0"
    if (formData.max_uses <= 0) errors.max_uses = "Số lần sử dụng tối đa phải lớn hơn 0"

    const validFrom = new Date(formData.valid_from)
    const validTo = new Date(formData.valid_to)

    if (!isValid(validFrom)) errors.valid_from = "Ngày bắt đầu không hợp lệ"
    if (!isValid(validTo)) errors.valid_to = "Ngày kết thúc không hợp lệ"
    if (isValid(validFrom) && isValid(validTo) && isAfter(validFrom, validTo)) {
      errors.valid_to = "Ngày kết thúc phải sau ngày bắt đầu"
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    setActionLoading(prev => ({ ...prev, update: true }))
    try {
      const updatedDiscount = await updateDiscount(selectedDiscount.id, formData)
      updateDiscountInList(updatedDiscount)
      setIsEditDialogOpen(false)
      toast.success("Đã cập nhật mã giảm giá thành công")
      resetForm()
    } catch (error) {
      console.error("Failed to update discount:", error)
      toast.error("Không thể cập nhật mã giảm giá")
    } finally {
      setActionLoading(prev => ({ ...prev, update: false }))
    }
  }

  const handleDeleteDiscount = async () => {
    if (!selectedDiscount) return

    setActionLoading(prev => ({ ...prev, delete: true }))
    try {
      await deleteDiscount(selectedDiscount.id)
      removeDiscountFromList(selectedDiscount.id)
      setIsDeleteDialogOpen(false)
      toast.success("Đã xóa mã giảm giá thành công")
    } catch (error) {
      console.error("Failed to delete discount:", error)
      toast.error("Không thể xóa mã giảm giá")
    } finally {
      setActionLoading(prev => ({ ...prev, delete: false }))
    }
  }

  const handleToggleActive = async (discount: Discount) => {
    setActionLoading(prev => ({ ...prev, toggle: true }))
    try {
      const updatedDiscount = await updateDiscount(discount.id, {
        is_active: !discount.is_active,
      })
      updateDiscountInList(updatedDiscount)
      toast.success(`Đã ${!discount.is_active ? "kích hoạt" : "vô hiệu hóa"} mã giảm giá thành công`)
    } catch (error) {
      console.error("Failed to toggle discount status:", error)
      toast.error("Không thể cập nhật trạng thái mã giảm giá")
    } finally {
      setActionLoading(prev => ({ ...prev, toggle: false }))
    }
  }

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Đã sao chép mã giảm giá ${code} vào clipboard`)
  }

  const resetForm = () => {
    setFormData({
      code: "",
      description: "",
      discount_type: "fixed",
      value: 0,
      max_uses: 100,
      valid_from: new Date().toISOString(),
      valid_to: new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString(),
      is_active: true,
    })
    setFormErrors({})
    setSelectedDiscount(null)
  }

  const handleEditClick = (discount: Discount) => {
    setSelectedDiscount(discount)
    setFormData({
      code: discount.code,
      description: discount.description,
      discount_type: discount.discount_type,
      value: discount.value,
      max_uses: discount.max_uses,
      valid_from: discount.valid_from,
      valid_to: discount.valid_to,
      is_active: discount.is_active,
    })
    setIsEditDialogOpen(true)
  }

  const handleDeleteClick = (discount: Discount) => {
    setSelectedDiscount(discount)
    setIsDeleteDialogOpen(true)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setFormData({ ...formData, [name]: numValue })
      // Clear error when user types
      if (formErrors[name]) {
        setFormErrors({ ...formErrors, [name]: "" })
      }
    }
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleSwitchChange = (name: string, checked: boolean) => {
    setFormData({ ...formData, [name]: checked })
  }

  // Sửa handleDateChange để luôn nhận đúng kiểu
  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, [name]: date.toISOString() })
      if (formErrors[name]) {
        setFormErrors({ ...formErrors, [name]: "" })
      }
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold">Quản lý mã giảm giá</h1>
            <p className="text-muted-foreground mt-1">Tạo và quản lý các mã giảm giá cho dịch vụ của bạn</p>
          </div>
          <Button onClick={() => setIsCreateDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tạo mã giảm giá
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-green-50 dark:bg-green-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-green-600 dark:text-green-400">Đang hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600 dark:text-green-400">{stats.activeCount}</div>
              <p className="text-xs text-green-600/70 dark:text-green-400/70 mt-1">Mã giảm giá đang hoạt động</p>
            </CardContent>
          </Card>
          <Card className="bg-yellow-50 dark:bg-yellow-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Sắp diễn ra</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.upcomingCount}</div>
              <p className="text-xs text-yellow-600/70 dark:text-yellow-400/70 mt-1">Mã giảm giá sắp có hiệu lực</p>
            </CardContent>
          </Card>
          <Card className="bg-red-50 dark:bg-red-950/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-600 dark:text-red-400">Đã hết hạn</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.expiredCount}</div>
              <p className="text-xs text-red-600/70 dark:text-red-400/70 mt-1">Mã giảm giá đã hết hạn</p>
            </CardContent>
          </Card>
          <Card className="bg-gray-50 dark:bg-gray-800/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">Không hoạt động</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">{stats.inactiveCount}</div>
              <p className="text-xs text-gray-600/70 dark:text-gray-400/70 mt-1">Mã giảm giá đã bị vô hiệu hóa</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs and Filters */}
        <div className="space-y-4">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 w-full sm:w-auto">
              <TabsTrigger value="all">Tất cả</TabsTrigger>
              <TabsTrigger value="active" className="text-green-600">
                Đang hoạt động
              </TabsTrigger>
              <TabsTrigger value="upcoming" className="text-yellow-600">
                Sắp diễn ra
              </TabsTrigger>
              <TabsTrigger value="expired" className="text-red-600">
                Đã hết hạn
              </TabsTrigger>
              <TabsTrigger value="inactive" className="text-gray-600">
                Không hoạt động
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
                    placeholder="Tìm kiếm theo mã hoặc mô tả..."
                    className="pl-9"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="w-full sm:w-auto">
                      <Filter className="h-4 w-4 mr-2" />
                      Bộ lọc
                    </Button>
                  </SheetTrigger>
                  <SheetContent>
                    <SheetHeader>
                      <SheetTitle>Bộ lọc mã giảm giá</SheetTitle>
                      <SheetDescription>Lọc danh sách mã giảm giá theo các tiêu chí</SheetDescription>
                    </SheetHeader>
                    <div className="py-4 space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Trạng thái</label>
                        <Select value={statusFilter} onValueChange={setStatusFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả trạng thái</SelectItem>
                            <SelectItem value="active">Đang hoạt động</SelectItem>
                            <SelectItem value="upcoming">Sắp diễn ra</SelectItem>
                            <SelectItem value="expired">Đã hết hạn</SelectItem>
                            <SelectItem value="inactive">Không hoạt động</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Loại giảm giá</label>
                        <Select value={typeFilter} onValueChange={setTypeFilter}>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại giảm giá" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Tất cả loại</SelectItem>
                            <SelectItem value="fixed">Cố định (VND)</SelectItem>
                            <SelectItem value="percent">Phần trăm (%)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <SheetFooter>
                      <SheetClose asChild>
                        <Button
                          variant="outline"
                          onClick={() => {
                            setStatusFilter("all")
                            setTypeFilter("all")
                          }}
                        >
                          Đặt lại
                        </Button>
                      </SheetClose>
                      <SheetClose asChild>
                        <Button>Áp dụng</Button>
                      </SheetClose>
                    </SheetFooter>
                  </SheetContent>
                </Sheet>
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

        {/* Discounts Table */}
        {loading ? (
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <Skeleton className="h-8 w-full" />
                <Skeleton className="h-64 w-full" />
              </div>
            </CardContent>
          </Card>
        ) : filteredDiscounts.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                  <Gift className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium">Không tìm thấy mã giảm giá nào</h3>
                <p className="text-muted-foreground mt-1">
                  {searchTerm || statusFilter !== "all" || typeFilter !== "all" || activeTab !== "all"
                    ? "Thử thay đổi bộ lọc để xem kết quả khác"
                    : "Bạn chưa có mã giảm giá nào. Hãy tạo mã giảm giá đầu tiên!"}
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
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardContent className="p-0 overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Mã giảm giá</TableHead>
                    <TableHead>Mô tả</TableHead>
                    <TableHead>Giá trị</TableHead>
                    <TableHead>Thời hạn</TableHead>
                    <TableHead>Sử dụng</TableHead>
                    <TableHead>Trạng thái</TableHead>
                    <TableHead className="text-right">Thao tác</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDiscounts.map((discount) => {
                    const status = getDiscountStatus(discount)
                    return (
                      <TableRow key={discount.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center gap-2">
                            <span className="font-mono">{discount.code}</span>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-6 w-6"
                              onClick={() => handleCopyCode(discount.code)}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="max-w-[200px] truncate" title={discount.description}>
                            {discount.description || "Không có mô tả"}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              discount.discount_type === "percent"
                                ? "bg-blue-50 text-blue-700 hover:bg-blue-50 border-blue-200"
                                : "bg-purple-50 text-purple-700 hover:bg-purple-50 border-purple-200"
                            }
                          >
                            {formatDiscountValue(discount)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {discount.valid_from ? format(new Date(discount.valid_from), "dd/MM/yyyy") : "Không xác định"} -{" "}
                              {discount.valid_to ? format(new Date(discount.valid_to), "dd/MM/yyyy") : "Không xác định"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {discount.valid_from && discount.valid_to
                                ? `${format(new Date(discount.valid_from), "EEEE", { locale: vi })} - ${format(
                                    new Date(discount.valid_to),
                                    "EEEE",
                                    { locale: vi },
                                  )}`
                                : ""}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>
                              {discount.current_uses} / {discount.max_uses}
                            </div>
                            <div className="w-full bg-muted h-1.5 rounded-full mt-1 overflow-hidden">
                              <div
                                className="bg-primary h-full rounded-full"
                                style={{
                                  width: `${Math.min((discount.current_uses / discount.max_uses) * 100, 100)}%`,
                                }}
                              ></div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge>{translateStatus(status)}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <span className="sr-only">Mở menu</span>
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="h-4 w-4"
                                >
                                  <circle cx="12" cy="12" r="1" />
                                  <circle cx="12" cy="5" r="1" />
                                  <circle cx="12" cy="19" r="1" />
                                </svg>
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                              <DropdownMenuItem onClick={() => handleCopyCode(discount.code)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Sao chép mã
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleEditClick(discount)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem onClick={() => handleToggleActive(discount)}>
                                {actionLoading.toggle ? (
                                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                                ) : (
                                  <>
                                    {discount.is_active ? (
                                      <>
                                        <X className="h-4 w-4 mr-2" />
                                        Vô hiệu hóa
                                      </>
                                    ) : (
                                      <>
                                        <Check className="h-4 w-4 mr-2" />
                                        Kích hoạt
                                      </>
                                    )}
                                  </>
                                )}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteClick(discount)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Create Discount Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Tạo mã giảm giá mới</DialogTitle>
            <DialogDescription>Điền thông tin để tạo mã giảm giá mới cho dịch vụ của bạn</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="code">Mã giảm giá</Label>
                <Input
                  id="code"
                  name="code"
                  placeholder="VD: SUMMER2025"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="uppercase"
                />
                {formErrors.code && <p className="text-sm text-red-500">{formErrors.code}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_type">Loại giảm giá</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) => handleSelectChange("discount_type", value)}
                >
                  <SelectTrigger id="discount_type">
                    <SelectValue placeholder="Chọn loại giảm giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Cố định (VND)</SelectItem>
                    <SelectItem value="percent">Phần trăm (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Mô tả</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Mô tả về mã giảm giá"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="value">Giá trị</Label>
                <div className="relative">
                  <Input
                    id="value"
                    name="value"
                    type="number"
                    placeholder={formData.discount_type === "fixed" ? "VD: 50000" : "VD: 10"}
                    value={formData.value || ""}
                    onChange={handleNumberInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                    {formData.discount_type === "fixed" ? "VND" : "%"}
                  </div>
                </div>
                {formErrors.value && <p className="text-sm text-red-500">{formErrors.value}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_uses">Số lần sử dụng tối đa</Label>
                <Input
                  id="max_uses"
                  name="max_uses"
                  type="number"
                  placeholder="VD: 100"
                  value={formData.max_uses || ""}
                  onChange={handleNumberInputChange}
                />
                {formErrors.max_uses && <p className="text-sm text-red-500">{formErrors.max_uses}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày bắt đầu</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.valid_from ? format(new Date(formData.valid_from), "EEEE, dd MMMM yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.valid_from ? new Date(formData.valid_from) : undefined}
                      onSelect={(date) => handleDateChange("valid_from", date)}
                      initialFocus
                      disabled={(date) => isBefore(date, new Date())}
                      modifiersClassNames={{
                        disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.valid_from && <p className="text-sm text-red-500">{formErrors.valid_from}</p>}
              </div>
              <div className="space-y-2">
                <Label>Ngày kết thúc</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.valid_to ? format(new Date(formData.valid_to), "EEEE, dd MMMM yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.valid_to ? new Date(formData.valid_to) : undefined}
                      onSelect={(date) => handleDateChange("valid_to", date)}
                      initialFocus
                      disabled={(date) => {
                        const validFrom = formData.valid_from ? new Date(formData.valid_from) : new Date();
                        return isBefore(date, validFrom);
                      }}
                      modifiersClassNames={{
                        disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.valid_to && <p className="text-sm text-red-500">{formErrors.valid_to}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
              />
              <Label htmlFor="is_active">Kích hoạt ngay</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsCreateDialogOpen(false)
              }}
              disabled={actionLoading.create}
            >
              Hủy
            </Button>
            <Button onClick={handleCreateDiscount} disabled={actionLoading.create}>
              {actionLoading.create && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Tạo mã giảm giá
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Discount Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa mã giảm giá</DialogTitle>
            <DialogDescription>Cập nhật thông tin mã giảm giá</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-code">Mã giảm giá</Label>
                <Input
                  id="edit-code"
                  name="code"
                  placeholder="VD: SUMMER2025"
                  value={formData.code}
                  onChange={handleInputChange}
                  className="uppercase"
                />
                {formErrors.code && <p className="text-sm text-red-500">{formErrors.code}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-discount_type">Loại giảm giá</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) => handleSelectChange("discount_type", value)}
                >
                  <SelectTrigger id="edit-discount_type">
                    <SelectValue placeholder="Chọn loại giảm giá" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fixed">Cố định (VND)</SelectItem>
                    <SelectItem value="percent">Phần trăm (%)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Mô tả</Label>
              <Textarea
                id="edit-description"
                name="description"
                placeholder="Mô tả về mã giảm giá"
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-value">Giá trị</Label>
                <div className="relative">
                  <Input
                    id="edit-value"
                    name="value"
                    type="number"
                    placeholder={formData.discount_type === "fixed" ? "VD: 50000" : "VD: 10"}
                    value={formData.value || ""}
                    onChange={handleNumberInputChange}
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-muted-foreground">
                    {formData.discount_type === "fixed" ? "VND" : "%"}
                  </div>
                </div>
                {formErrors.value && <p className="text-sm text-red-500">{formErrors.value}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-max_uses">Số lần sử dụng tối đa</Label>
                <Input
                  id="edit-max_uses"
                  name="max_uses"
                  type="number"
                  placeholder="VD: 100"
                  value={formData.max_uses || ""}
                  onChange={handleNumberInputChange}
                />
                {formErrors.max_uses && <p className="text-sm text-red-500">{formErrors.max_uses}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Ngày bắt đầu</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.valid_from ? format(new Date(formData.valid_from), "EEEE, dd MMMM yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.valid_from ? new Date(formData.valid_from) : undefined}
                      onSelect={(date) => handleDateChange("valid_from", date)}
                      initialFocus
                      disabled={(date) => isBefore(date, new Date())}
                      modifiersClassNames={{
                        disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.valid_from && <p className="text-sm text-red-500">{formErrors.valid_from}</p>}
              </div>
              <div className="space-y-2">
                <Label>Ngày kết thúc</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.valid_to ? format(new Date(formData.valid_to), "EEEE, dd MMMM yyyy", { locale: vi }) : "Chọn ngày"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.valid_to ? new Date(formData.valid_to) : undefined}
                      onSelect={(date) => handleDateChange("valid_to", date)}
                      initialFocus
                      disabled={(date) => {
                        const validFrom = formData.valid_from ? new Date(formData.valid_from) : new Date();
                        return isBefore(date, validFrom);
                      }}
                      modifiersClassNames={{
                        disabled: "bg-gray-100 text-gray-400 cursor-not-allowed",
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {formErrors.valid_to && <p className="text-sm text-red-500">{formErrors.valid_to}</p>}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Switch
                id="edit-is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => handleSwitchChange("is_active", checked)}
              />
              <Label htmlFor="edit-is_active">Kích hoạt</Label>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                resetForm()
                setIsEditDialogOpen(false)
              }}
              disabled={actionLoading.update}
            >
              Hủy
            </Button>
            <Button onClick={handleUpdateDiscount} disabled={actionLoading.update}>
              {actionLoading.update && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Discount Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xóa</DialogTitle>
            <DialogDescription>
              Bạn có chắc chắn muốn xóa mã giảm giá <span className="font-semibold">{selectedDiscount?.code}</span>?
              Hành động này không thể hoàn tác.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={actionLoading.delete}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeleteDiscount} disabled={actionLoading.delete}>
              {actionLoading.delete && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Toaster component at the end of the component */}
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
