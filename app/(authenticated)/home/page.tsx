import { Suspense } from "react"
import PostFeed from "./post-feed"
import { Skeleton } from "@/components/ui/skeleton"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">For you</h1>
        </header>

        <Suspense fallback={<FeedSkeleton />}>
          <PostFeed />
        </Suspense>
      </div>
    </div>
  )
}

function FeedSkeleton() {
  return (
    <div className="space-y-8">
      {Array(3)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-4">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="flex gap-4 mt-6">
              <Skeleton className="h-8 w-20" />
              <Skeleton className="h-8 w-24" />
            </div>
          </div>
        ))}
    </div>
  )
}
