import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent, CardHeader } from "@/components/ui/card"

export function RecentActivitiesSkeleton() {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <Skeleton className="h-6 w-40 mb-2" />
            <Skeleton className="h-4 w-60" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>
        <Skeleton className="h-8 w-full mt-2" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {Array(5)
            .fill(0)
            .map((_, i) => (
              <div key={i} className="flex items-start space-x-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            ))}
        </div>
      </CardContent>
    </Card>
  )
}
