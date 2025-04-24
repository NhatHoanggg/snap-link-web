"use client"

import type React from "react"

import { useRouter, usePathname, useSearchParams } from "next/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"

export function UserFilters() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [role, setRole] = useState(searchParams.get("role") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "")
  const [search, setSearch] = useState(searchParams.get("search") || "")

  // Update URL when filters change
  const updateFilters = () => {
    const params = new URLSearchParams()

    if (role) params.set("role", role)
    if (status) params.set("status", status)
    if (search) params.set("search", search)

    router.push(`${pathname}?${params.toString()}`)
  }

  // Handle search input
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    updateFilters()
  }

  // Update URL when select filters change
  useEffect(() => {
    updateFilters()
  }, [role, status])

  // Reset all filters
  const resetFilters = () => {
    setRole("")
    setStatus("")
    setSearch("")
    router.push(pathname)
  }

  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-end">
      <div className="flex-1 space-y-1">
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm theo tên, email, số điện thoại..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-10"
          />
          {search && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
              onClick={() => {
                setSearch("")
                updateFilters()
              }}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Xóa tìm kiếm</span>
            </Button>
          )}
        </form>
      </div>

      <div className="grid grid-cols-2 gap-4 md:flex md:w-auto">
        <div className="space-y-1">
          <Select value={role} onValueChange={setRole}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Vai trò" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả vai trò</SelectItem>
              <SelectItem value="admin">Quản trị viên</SelectItem>
              <SelectItem value="photographer">Nhiếp ảnh gia</SelectItem>
              <SelectItem value="customer">Khách hàng</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1">
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Trạng thái" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tất cả trạng thái</SelectItem>
              <SelectItem value="active">Hoạt động</SelectItem>
              <SelectItem value="inactive">Vô hiệu</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button variant="outline" onClick={resetFilters} className="col-span-2 md:col-span-1">
          <X className="mr-2 h-4 w-4" />
          Xóa bộ lọc
        </Button>
      </div>
    </div>
  )
}
