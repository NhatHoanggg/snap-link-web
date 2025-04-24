"use client"

import Image from "next/image"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { User, Mail, Phone, MapPin, Calendar, Shield, CheckCircle, XCircle, ExternalLink } from "lucide-react"

interface UserDetail {
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

interface UserDetailDialogProps {
  user: UserDetail
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UserDetailDialog({ user, open, onOpenChange }: UserDetailDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl overflow-hidden p-0">
        <div className="relative h-40">
          <Image src={user.background_image || "/placeholder.svg"} alt="Background" fill className="object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        <div className="relative px-6 pb-6">
          <div className="flex flex-col sm:flex-row sm:items-end -mt-12 mb-4 gap-4">
            <Avatar className="h-24 w-24 border-4 border-background">
              <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.full_name} />
              <AvatarFallback>{user.full_name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="space-y-1">
              <DialogTitle className="text-2xl">{user.full_name}</DialogTitle>
              <DialogDescription>
                <Badge
                  variant={
                    user.role === "admin" ? "destructive" : user.role === "photographer" ? "default" : "secondary"
                  }
                >
                  {user.role === "admin"
                    ? "Quản trị viên"
                    : user.role === "photographer"
                      ? "Nhiếp ảnh gia"
                      : "Khách hàng"}
                </Badge>
                {user.is_active ? (
                  <Badge variant="default" className="ml-2 bg-green-100 text-green-800 hover:bg-green-100">
                    <CheckCircle className="mr-1 h-3 w-3" /> Hoạt động
                  </Badge>
                ) : (
                  <Badge variant="outline" className="ml-2 bg-gray-100 text-gray-800 hover:bg-gray-100">
                    <XCircle className="mr-1 h-3 w-3" /> Vô hiệu
                  </Badge>
                )}
              </DialogDescription>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin liên hệ</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.email}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user.phone_number}</span>
                </div>

                {user.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{user.location}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-lg">Thông tin tài khoản</h3>

              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">ID: {user.user_id}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    Ngày tạo: {format(new Date(user.created_at), "dd/MM/yyyy HH:mm", { locale: vi })}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Slug: {user.slug}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Đóng
            </Button>
            <Button variant="outline" asChild>
              <a href={`/admin/users/edit/${user.user_id}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="mr-2 h-4 w-4" />
                Xem đầy đủ
              </a>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
