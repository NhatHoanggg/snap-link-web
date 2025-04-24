// DashboardCharts.tsx using Recharts
"use client"

import { useState } from "react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts"

export function DashboardCharts() {
  const [revenueTimeframe, setRevenueTimeframe] = useState("week")
  const [bookingTimeframe, setBookingTimeframe] = useState("week")

  const revenueData = {
    week: [
      { name: "T2", Doanh_thu: 4500000 },
      { name: "T3", Doanh_thu: 3800000 },
      { name: "T4", Doanh_thu: 5200000 },
      { name: "T5", Doanh_thu: 4900000 },
      { name: "T6", Doanh_thu: 6300000 },
      { name: "T7", Doanh_thu: 7800000 },
      { name: "CN", Doanh_thu: 5500000 },
    ],
    month: [
      { name: "Tuần 1", Doanh_thu: 18000000 },
      { name: "Tuần 2", Doanh_thu: 22000000 },
      { name: "Tuần 3", Doanh_thu: 19500000 },
      { name: "Tuần 4", Doanh_thu: 24000000 },
    ],
    year: [
      { name: "T1", Doanh_thu: 42000000 },
      { name: "T2", Doanh_thu: 38000000 },
      { name: "T3", Doanh_thu: 45000000 },
      { name: "T4", Doanh_thu: 52000000 },
      { name: "T5", Doanh_thu: 48000000 },
      { name: "T6", Doanh_thu: 55000000 },
      { name: "T7", Doanh_thu: 60000000 },
      { name: "T8", Doanh_thu: 58000000 },
      { name: "T9", Doanh_thu: 63000000 },
      { name: "T10", Doanh_thu: 68000000 },
      { name: "T11", Doanh_thu: 72000000 },
      { name: "T12", Doanh_thu: 85000000 },
    ],
  }

  const bookingsData = {
    week: [
      { name: "T2", Dat_lich: 12 },
      { name: "T3", Dat_lich: 8 },
      { name: "T4", Dat_lich: 15 },
      { name: "T5", Dat_lich: 10 },
      { name: "T6", Dat_lich: 18 },
      { name: "T7", Dat_lich: 25 },
      { name: "CN", Dat_lich: 14 },
    ],
    month: [
      { name: "Tuần 1", Dat_lich: 45 },
      { name: "Tuần 2", Dat_lich: 52 },
      { name: "Tuần 3", Dat_lich: 48 },
      { name: "Tuần 4", Dat_lich: 60 },
    ],
    year: [
      { name: "T1", Dat_lich: 120 },
      { name: "T2", Dat_lich: 105 },
      { name: "T3", Dat_lich: 130 },
      { name: "T4", Dat_lich: 145 },
      { name: "T5", Dat_lich: 135 },
      { name: "T6", Dat_lich: 155 },
      { name: "T7", Dat_lich: 170 },
      { name: "T8", Dat_lich: 165 },
      { name: "T9", Dat_lich: 180 },
      { name: "T10", Dat_lich: 190 },
      { name: "T11", Dat_lich: 205 },
      { name: "T12", Dat_lich: 240 },
    ],
  }

  const userDistributionData = [
    { name: "Khách hàng", value: 1237 },
    { name: "Nhiếp ảnh gia", value: 47 },
    { name: "Quản trị viên", value: 5 },
  ]

  const bookingStatusData = [
    { name: "Hoàn thành", value: 245 },
    { name: "Đang xử lý", value: 65 },
    { name: "Đã hủy", value: 18 },
  ]

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value)

  const pieColors = ["#6366f1", "#f59e0b", "#ef4444"]
  const pieColors2 = ["#10b981", "#3b82f6", "#f43f5e"]

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader className="flex justify-between pb-3">
          <div>
            <CardTitle>Doanh thu</CardTitle>
            <CardDescription>Biểu đồ doanh thu theo thời gian</CardDescription>
          </div>
          <Tabs value={revenueTimeframe} onValueChange={setRevenueTimeframe}>
            <TabsList className="grid grid-cols-3 h-8 text-xs">
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="year">Năm</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={revenueData[revenueTimeframe as keyof typeof revenueData]}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis tickFormatter={formatCurrency} />
              <Tooltip formatter={(value) => formatCurrency(value as number)} />
              <Bar dataKey="Doanh_thu" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex justify-between pb-3">
          <div>
            <CardTitle>Đặt lịch</CardTitle>
            <CardDescription>Số lượng đặt lịch theo thời gian</CardDescription>
          </div>
          <Tabs value={bookingTimeframe} onValueChange={setBookingTimeframe}>
            <TabsList className="grid grid-cols-3 h-8 text-xs">
              <TabsTrigger value="week">Tuần</TabsTrigger>
              <TabsTrigger value="month">Tháng</TabsTrigger>
              <TabsTrigger value="year">Năm</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={bookingsData[bookingTimeframe as keyof typeof bookingsData]}
              margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="Dat_lich" stroke="#10b981" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Phân bố người dùng</CardTitle>
          <CardDescription>Phân bố người dùng theo vai trò</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={userDistributionData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                label
              >
                {userDistributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Trạng thái đặt lịch</CardTitle>
          <CardDescription>Phân bố đặt lịch theo trạng thái</CardDescription>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={bookingStatusData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#82ca9d"
                label
              >
                {bookingStatusData.map((entry, index) => (
                  <Cell key={`cell2-${index}`} fill={pieColors2[index % pieColors2.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
