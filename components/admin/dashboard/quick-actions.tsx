"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { PlusCircle, UserPlus, Calendar, Mail, Settings, Download } from "lucide-react"

export function QuickActions() {
  const [isEmailDialogOpen, setIsEmailDialogOpen] = useState(false)
  const [emailSubject, setEmailSubject] = useState("")
  const [emailContent, setEmailContent] = useState("")
  const [isSending, setIsSending] = useState(false)

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSending(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    toast({
      title: "Email đã được gửi",
      description: "Email đã được gửi thành công đến tất cả người dùng.",
    })

    setIsSending(false)
    setIsEmailDialogOpen(false)
    setEmailSubject("")
    setEmailContent("")
  }

  return (
    <div className="flex items-center gap-2 mt-4 md:mt-0">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Thao tác nhanh
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Thao tác nhanh</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/users/new">
              <UserPlus className="mr-2 h-4 w-4" />
              <span>Thêm người dùng mới</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link href="/admin/bookings/new">
              <Calendar className="mr-2 h-4 w-4" />
              <span>Tạo đặt lịch mới</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsEmailDialogOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            <span>Gửi email thông báo</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href="/admin/settings">
              <Settings className="mr-2 h-4 w-4" />
              <span>Cài đặt hệ thống</span>
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Download className="mr-2 h-4 w-4" />
            <span>Xuất báo cáo</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isEmailDialogOpen} onOpenChange={setIsEmailDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <form onSubmit={handleSendEmail}>
            <DialogHeader>
              <DialogTitle>Gửi email thông báo</DialogTitle>
              <DialogDescription>Gửi email thông báo đến tất cả người dùng trong hệ thống.</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="subject">Tiêu đề</Label>
                <Input
                  id="subject"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  placeholder="Nhập tiêu đề email"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="content">Nội dung</Label>
                <Textarea
                  id="content"
                  value={emailContent}
                  onChange={(e) => setEmailContent(e.target.value)}
                  placeholder="Nhập nội dung email"
                  rows={5}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEmailDialogOpen(false)}>
                Hủy
              </Button>
              <Button type="submit" disabled={isSending}>
                {isSending ? "Đang gửi..." : "Gửi email"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
