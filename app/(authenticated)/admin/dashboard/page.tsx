import { Suspense } from "react"
import type { Metadata } from "next"
import { DashboardCards } from "@/components/admin/dashboard/dashboard-cards"
import { DashboardCharts } from "@/components/admin/dashboard/dashboard-charts"
import { RecentActivities } from "@/components/admin/dashboard/recent-activities"
import { QuickActions } from "@/components/admin/dashboard/quick-actions"
import { DashboardCardsSkeleton } from "@/components/admin/dashboard/dashboard-cards-skeleton"
import { DashboardChartsSkeleton } from "@/components/admin/dashboard/dashboard-charts-skeleton"
import { RecentActivitiesSkeleton } from "@/components/admin/dashboard/recent-activities-skeleton"

export const metadata: Metadata = {
  title: "Dashboard | Admin",
  description: "Tổng quan hệ thống",
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Tổng quan về hệ thống của bạn.</p>
        </div>
        <QuickActions />
      </div>

      <Suspense fallback={<DashboardCardsSkeleton />}>
        <DashboardCards />
      </Suspense>

      <Suspense fallback={<DashboardChartsSkeleton />}>
        <DashboardCharts />
      </Suspense>

      <Suspense fallback={<RecentActivitiesSkeleton />}>
        <RecentActivities />
      </Suspense>
    </div>
  )
}
