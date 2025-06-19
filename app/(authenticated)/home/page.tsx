"use client"

import { Suspense, useState } from "react"
import PostFeed from "./post-feed"
import FollowersFeed from "./followers-feed"
import { Skeleton } from "@/components/ui/skeleton"
import { MissingInfoDialog } from "@/components/home/missing-info-dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/services/auth"
import { FileText, Users } from "lucide-react"

export default function HomePage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("posts")

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-background/80">
      <MissingInfoDialog />
      <div className="container max-w-4xl mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="posts" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Bài viết
            </TabsTrigger>
            <TabsTrigger value="followers" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              {user?.role === "photographer" ? "Người theo dõi" : "Nhiếp ảnh gia đang theo dõi"}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-0">
            <Suspense fallback={<FeedSkeleton />}>
              <PostFeed />
            </Suspense>
          </TabsContent>

          <TabsContent value="followers" className="mt-0">
            <Suspense fallback={<FollowersSkeleton />}>
              <FollowersFeed />
            </Suspense>
          </TabsContent>
        </Tabs>
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

function FollowersSkeleton() {
  return (
    <div className="space-y-4">
      {Array(5)
        .fill(0)
        .map((_, i) => (
          <div key={i} className="bg-card rounded-xl p-4 shadow-sm border">
            <div className="flex items-center gap-3">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-3 w-48" />
                <Skeleton className="h-3 w-24" />
              </div>
            </div>
          </div>
        ))}
    </div>
  )
}
