import { Suspense } from "react"
import { UsersTable } from "@/components/admin/users-table"
import { UsersTableSkeleton } from "@/components/admin/users-table-skeleton"
import { UserStats } from "@/components/admin/user-stats"
import { UserFilters } from "@/components/admin/user-filters"

export default function UsersPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Quản Lý Người Dùng</h1>
          <p className="text-muted-foreground mt-1">Xem và quản lý tất cả người dùng trong hệ thống.</p>
        </div>
      </div>

      <Suspense fallback={<UserStats isLoading />}>
        <UserStats />
      </Suspense>

      <div className="mt-8">
        <UserFilters />
      </div>

      <div className="mt-6">
        <Suspense fallback={<UsersTableSkeleton />}>
          <UsersTable />
        </Suspense>
      </div>
    </div>
  )
}
