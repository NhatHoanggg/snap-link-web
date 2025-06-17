"use client"

import { useState, useEffect, use } from "react"
import { format, isAfter, isValid } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { updateDiscount, getDiscountByCode, type DiscountCreate } from "@/services/discount.service"
import toast from "react-hot-toast"
import { useRouter } from "next/navigation"

interface EditDiscountPageProps {
  params: Promise<{
    code: string
  }>
}

export default function EditDiscountPage({ params }: EditDiscountPageProps) {
  const router = useRouter()
  const { code } = use(params)
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
  const [isLoading, setIsLoading] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)

  useEffect(() => {
    const loadDiscount = async () => {
      try {
        const discount = await getDiscountByCode(code)
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
      } catch (error) {
        console.error("Failed to load discount:", error)
        toast.error("Không thể tải thông tin mã giảm giá")
        router.push("/manage/discounts")
      } finally {
        setIsInitialLoading(false)
      }
    }

    loadDiscount()
  }, [code, router])

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
    if (formErrors[name]) {
      setFormErrors({ ...formErrors, [name]: "" })
    }
  }

  const handleNumberInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const numValue = Number.parseFloat(value)
    if (!isNaN(numValue)) {
      setFormData({ ...formData, [name]: numValue })
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

  const handleDateChange = (name: string, date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, [name]: date.toISOString() })
      if (formErrors[name]) {
        setFormErrors({ ...formErrors, [name]: "" })
      }
    }
  }

  const handleUpdateDiscount = async () => {
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

    setIsLoading(true)
    try {
      // First get the discount to get its ID
      const discount = await getDiscountByCode(code)
      // Then update using the ID
      await updateDiscount(discount.id, formData)
      toast.success("Đã cập nhật mã giảm giá thành công")
      router.push("/manage/discounts")
    } catch (error) {
      console.error("Failed to update discount:", error)
      toast.error("Không thể cập nhật mã giảm giá")
    } finally {
      setIsLoading(false)
    }
  }

  if (isInitialLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-1/3"></div>
            <div className="h-4 bg-muted rounded w-1/2"></div>
            <div className="space-y-4">
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-10 bg-muted rounded"></div>
              <div className="h-32 bg-muted rounded"></div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Chỉnh sửa mã giảm giá</h1>
            <p className="text-muted-foreground mt-1">Cập nhật thông tin mã giảm giá</p>
          </div>
          <Button variant="outline" onClick={() => router.push("/manage/discounts")}>
            Quay lại
          </Button>
        </div>

        <div className="bg-card border rounded-lg p-6 space-y-6">
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
            <Label htmlFor="is_active">Kích hoạt mã giảm giá</Label>
          </div>

          <div className="flex justify-end space-x-4">
            <Button variant="outline" onClick={() => router.push("/manage/discounts")}>
              Hủy
            </Button>
            <Button onClick={handleUpdateDiscount} disabled={isLoading}>
              {isLoading && <RefreshCw className="mr-2 h-4 w-4 animate-spin" />}
              Cập nhật
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
} 