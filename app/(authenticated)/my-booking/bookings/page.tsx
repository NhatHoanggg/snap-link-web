"use client"

import { useEffect, useState } from "react"
import { getMyBookings } from "@/services/booking.service"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Eye, Pencil, Trash2, Search } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

type Booking = {
  booking_id: number
  booking_code: string
  booking_date: string
  concept: string
  illustration_url: string
  shooting_type: string
  custom_location: string | null
  status: string
  total_price: number
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 7

  useEffect(() => {
    getMyBookings()
      .then((data) => {
        console.log(data)
        const sortedData = [...data].sort((a, b) => 
          new Date(b.booking_date).getTime() - new Date(a.booking_date).getTime()
        )
        setBookings(sortedData)
      })
      .finally(() => setLoading(false))
  }, [])

  const filteredBookings = bookings?.filter((booking) => {
    const bookingCode = booking.booking_code?.toLowerCase() || ""
    const concept = booking.concept?.toLowerCase() || ""
    const customLocation = booking.custom_location?.toLowerCase() || ""
    const search = searchTerm?.toLowerCase() || ""

    const matchesSearch = bookingCode.includes(search) || concept.includes(search) || customLocation.includes(search)
    const matchesStatus = statusFilter === "all" || booking.status === statusFilter

    return matchesSearch && matchesStatus
  })

  const totalPages = Math.ceil((filteredBookings?.length || 0) / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedBookings = filteredBookings?.slice(startIndex, startIndex + itemsPerPage)

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "confirmed":
        return "bg-green-100 text-green-800 border-green-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200"
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const handleViewDetails = (bookingCode: string) => {
    window.location.href = `/my-booking/bookings/${bookingCode}`
  }

  const handleEdit = (bookingCode: string) => {
    console.log("Edit booking:", bookingCode)
  }

  const handleDelete = (bookingCode: string) => {
    console.log("Delete booking:", bookingCode)
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <h3 className="text-xl font-medium mb-2">Không có lịch hẹn nào</h3>
      <p className="text-muted-foreground max-w-md mb-6">
        Bạn chưa có lịch hẹn chụp ảnh nào. Hãy đặt lịch để bắt đầu trải nghiệm dịch vụ của chúng tôi.
      </p>
      <Button>Đặt lịch ngay</Button>
    </div>
  )

  const renderSkeletonTable = () => (
    <div className="w-full overflow-auto rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">Mã</TableHead>
            <TableHead>Concept</TableHead>
            <TableHead>Kiểu chụp</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="w-[150px] text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {[...Array(7)].map((_, i) => (
            <TableRow key={i}>
              <TableCell>
                <Skeleton className="h-4 w-16" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-24" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-4 w-28" />
              </TableCell>
              <TableCell>
                <Skeleton className="h-6 w-20 rounded-full" />
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )

  return (
    <div className="container max-w-7xl mx-auto py-8 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-1">Lịch hẹn của tôi</h1>
          <p className="text-muted-foreground">Quản lý tất cả các buổi chụp ảnh của bạn</p>
        </div>
        <Button>Đặt lịch mới</Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Tìm kiếm theo mã hoặc concept..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả trạng thái</SelectItem>
            <SelectItem value="pending">Đang chờ</SelectItem>
            <SelectItem value="confirmed">Đã xác nhận</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="cancelled">Đã hủy</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {loading ? (
        renderSkeletonTable()
      ) : filteredBookings?.length === 0 ? (
        renderEmptyState()
      ) : (
        <>
          <div className="w-full overflow-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">Mã</TableHead>
                  <TableHead>Concept</TableHead>
                  <TableHead>Kiểu chụp</TableHead>
                  <TableHead>Trạng thái</TableHead>
                  <TableHead className="w-[150px] text-right">Thao tác</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedBookings?.map((booking) => (
                  <TableRow key={booking.booking_id} className="group">
                    <TableCell className="font-medium">#{booking.booking_code}</TableCell>
                    <TableCell>{booking.concept}</TableCell>
                    <TableCell>{booking.shooting_type}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`${getStatusColor(booking.status)} capitalize font-medium`}>
                        {booking.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleViewDetails(booking.booking_code)}
                          title="Xem chi tiết"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(booking.booking_code)}
                          title="Chỉnh sửa"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-500 hover:text-red-600 hover:bg-red-50"
                          onClick={() => handleDelete(booking.booking_code)}
                          title="Xóa"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                  
                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationLink
                            onClick={() => setCurrentPage(page)}
                            isActive={currentPage === page}
                          >
                            {page}
                          </PaginationLink>
                        </PaginationItem>
                      )
                    } else if (
                      page === currentPage - 2 ||
                      page === currentPage + 2
                    ) {
                      return (
                        <PaginationItem key={page}>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )
                    }
                    return null
                  })}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </>
      )}
    </div>
  )
}
