import type React from "react"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Lịch hẹn của tôi | SnapLink",
  description: "Quản lý tất cả các buổi chụp ảnh đã đặt lịch",
}

export default function BookingsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <main className="min-h-screen bg-background">{children}</main>
}