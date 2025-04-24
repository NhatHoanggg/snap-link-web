import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function DashboardChartsSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      {Array(4)
        .fill(0)
        .map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-3">
              <div>
                <Skeleton className="h-6 w-24 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-8 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-[300px] w-full rounded-md" />
            </CardContent>
          </Card>
        ))}
    </div>
  )
}
