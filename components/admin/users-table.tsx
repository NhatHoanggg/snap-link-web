"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Pagination } from "@/components/admin/pagination"
import { UserDetailDialog } from "@/components/admin/user-detail-dialog"
import { MoreHorizontal, Pencil, Trash2, UserCog, Eye, CheckCircle, XCircle, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { AdminService } from "@/services/admin.service"

interface User {
  email: string
  full_name: string
  phone_number: string
  location: string | null
  user_id: number
  role: string
  created_at: string
  slug: string
  avatar: string
  background_image: string
  is_active: boolean
}


export function UsersTable() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [users, setUsers] = useState<User[]>([])
  const [selectedUsers, setSelectedUsers] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [totalUsers, setTotalUsers] = useState(0)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [userToDelete, setUserToDelete] = useState<number | null>(null)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [isMultiDeleteDialogOpen, setIsMultiDeleteDialogOpen] = useState(false)

  const itemsPerPage = 10

  // Get filter values from URL
  const role = searchParams.get("role") || ""
  const status = searchParams.get("status") || ""
  const search = searchParams.get("search") || ""

  useEffect(() => {
    fetchUsers()
  }, [currentPage, role, status, search])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const data = await AdminService.getUsers({
        page: currentPage,
        limit: itemsPerPage,
        role,
        status,
        search,
      })
      setUsers(data.users)
      setTotalUsers(data.total)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải danh sách người dùng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleSelectAllUsers = (checked: boolean) => {
    if (checked) {
      setSelectedUsers(users.map((user) => user.user_id))
    } else {
      setSelectedUsers([])
    }
  }

  const handleSelectUser = (userId: number, checked: boolean) => {
    if (checked) {
      setSelectedUsers([...selectedUsers, userId])
    } else {
      setSelectedUsers(selectedUsers.filter((id) => id !== userId))
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  const handleDeleteUser = (userId: number) => {
    setUserToDelete(userId)
    setIsDeleteDialogOpen(true)
  }

  const confirmDeleteUser = async () => {
    if (!userToDelete) return

    try {
      await AdminService.deleteUser(userToDelete)
      setUsers(users.filter((user) => user.user_id !== userToDelete))
      toast({
        title: "Thành công",
        description: "Đã xóa người dùng thành công.",
      })
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa người dùng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsDeleteDialogOpen(false)
      setUserToDelete(null)
    }
  }

  const handleViewUserDetails = (user: User) => {
    setSelectedUser(user)
    setIsDetailDialogOpen(true)
  }

  const handleToggleUserStatus = async (userId: number, currentStatus: boolean) => {
    try {
      await AdminService.updateUserStatus(userId, !currentStatus)
      setUsers(users.map((user) => (user.user_id === userId ? { ...user, is_active: !currentStatus } : user)))
      toast({
        title: "Thành công",
        description: `Đã ${!currentStatus ? "kích hoạt" : "vô hiệu hóa"} người dùng.`,
      })
    } catch (error) {
      console.error("Error updating user status:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái người dùng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteSelectedUsers = () => {
    if (selectedUsers.length === 0) return
    setIsMultiDeleteDialogOpen(true)
  }

  const confirmDeleteSelectedUsers = async () => {
    try {
      await AdminService.deleteUsers(selectedUsers)
      setUsers(users.filter((user) => !selectedUsers.includes(user.user_id)))
      setSelectedUsers([])
      toast({
        title: "Thành công",
        description: `Đã xóa ${selectedUsers.length} người dùng.`,
      })
    } catch (error) {
      console.error("Error deleting users:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa người dùng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setIsMultiDeleteDialogOpen(false)
    }
  }

  const handleExportUsers = async () => {
    try {
      const blob = await AdminService.exportUsers()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'users.csv'
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)
      toast({
        title: "Thành công",
        description: "Đã xuất dữ liệu người dùng.",
      })
    } catch (error) {
      console.error("Error exporting users:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xuất dữ liệu người dùng. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "admin":
        return "destructive"
      case "photographer":
        return "default"
      case "customer":
        return "secondary"
      default:
        return "outline"
    }
  }

  return (
    <>
      <div className="rounded-md border">
        <div className="flex items-center justify-between p-4">
          <div className="flex flex-1 items-center space-x-2">
            <h2 className="text-xl font-semibold">Danh sách người dùng</h2>
            <Badge variant="outline">{totalUsers}</Badge>
          </div>
          <div className="flex items-center space-x-2">
            {selectedUsers.length > 0 && (
              <Button variant="destructive" size="sm" onClick={handleDeleteSelectedUsers}>
                <Trash2 className="mr-2 h-4 w-4" />
                Xóa ({selectedUsers.length})
              </Button>
            )}
            <Button variant="outline" size="sm" onClick={handleExportUsers}>
              <Download className="mr-2 h-4 w-4" />
              Xuất dữ liệu
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedUsers.length === users.length && users.length > 0}
                  onCheckedChange={handleSelectAllUsers}
                  aria-label="Select all"
                />
              </TableHead>
              <TableHead className="w-[250px]">Người dùng</TableHead>
              <TableHead className="hidden md:table-cell">Email</TableHead>
              <TableHead className="hidden md:table-cell">Số điện thoại</TableHead>
              <TableHead className="hidden lg:table-cell">Vai trò</TableHead>
              <TableHead className="hidden lg:table-cell">Ngày tạo</TableHead>
              <TableHead className="hidden lg:table-cell">Trạng thái</TableHead>
              <TableHead className="w-[100px]">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              Array(5)
                .fill(0)
                .map((_, index) => (
                  <TableRow key={index}>
                    <TableCell colSpan={8} className="h-16 text-center">
                      <div className="flex items-center justify-center">
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
                        <span className="ml-2">Đang tải...</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
            ) : users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="h-24 text-center">
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.user_id}>
                  <TableCell>
                    <Checkbox
                      checked={selectedUsers.includes(user.user_id)}
                      onCheckedChange={(checked) => handleSelectUser(user.user_id, !!checked)}
                      aria-label={`Select ${user.full_name}`}
                    />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.full_name} />
                        <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.full_name}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{user.email}</div>
                        <div className="text-sm text-muted-foreground md:hidden">{user.phone_number}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">{user.email}</TableCell>
                  <TableCell className="hidden md:table-cell">{user.phone_number}</TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role === "admin"
                        ? "Quản trị viên"
                        : user.role === "photographer"
                          ? "Nhiếp ảnh gia"
                          : "Khách hàng"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {format(new Date(user.created_at), "dd/MM/yyyy", { locale: vi })}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    {user.is_active ? (
                      <Badge variant="default" className="bg-green-100 text-green-800 hover:bg-green-100">
                        <CheckCircle className="mr-1 h-3 w-3" /> Hoạt động
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-100 text-gray-800 hover:bg-gray-100">
                        <XCircle className="mr-1 h-3 w-3" /> Vô hiệu
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Mở menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => handleViewUserDetails(user)}>
                          <Eye className="mr-2 h-4 w-4" /> Xem chi tiết
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/users/edit/${user.user_id}`)}>
                          <Pencil className="mr-2 h-4 w-4" /> Chỉnh sửa
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleToggleUserStatus(user.user_id, user.is_active)}>
                          {user.is_active ? (
                            <>
                              <XCircle className="mr-2 h-4 w-4" /> Vô hiệu hóa
                            </>
                          ) : (
                            <>
                              <CheckCircle className="mr-2 h-4 w-4" /> Kích hoạt
                            </>
                          )}
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/users/permissions/${user.user_id}`)}>
                          <UserCog className="mr-2 h-4 w-4" /> Phân quyền
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={() => handleDeleteUser(user.user_id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Xóa người dùng
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="p-4 border-t">
          <Pagination
            currentPage={currentPage}
            totalItems={totalUsers}
            pageSize={itemsPerPage}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Delete User Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa người dùng này? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDeleteUser} className="bg-destructive text-destructive-foreground">
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Multiple Users Dialog */}
      <AlertDialog open={isMultiDeleteDialogOpen} onOpenChange={setIsMultiDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa nhiều người dùng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa {selectedUsers.length} người dùng đã chọn? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDeleteSelectedUsers}
              className="bg-destructive text-destructive-foreground"
            >
              Xóa {selectedUsers.length} người dùng
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Detail Dialog */}
      {selectedUser && (
        <UserDetailDialog user={selectedUser} open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen} />
      )}
    </>
  )
}
