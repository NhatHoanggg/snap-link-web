"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Post as PostComponent } from "./post"
import { postsService, PostResponse } from "@/services/posts.service"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

export default function PostFeed() {
  const [posts, setPosts] = useState<PostResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [skip, setSkip] = useState(0)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchPosts = async (skipCount: number) => {
    try {
      const data = await postsService.getAllPosts(skipCount, 20)

      if (data.length === 0) {
        setHasMore(false)
        return
      }

      if (skipCount === 0) {
        setPosts(data)
      } else {
        setPosts((prev) => [...prev, ...data])
      }
    } catch (err) {
      setError("Failed to load posts. Please try again later.")
      console.error(err)
    } finally {
      setLoading(false)
      setLoadingMore(false)
    }
  }

  useEffect(() => {
    fetchPosts(0)
  }, [])

  const loadMorePosts = () => {
    setLoadingMore(true)
    setSkip((prev) => prev + 20)
    fetchPosts(skip + 20)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Đang tải bài viết...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => fetchPosts(0)}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.post_id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <PostComponent post={post} />
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <div className="flex justify-center pt-4">
          <Button onClick={loadMorePosts} disabled={loadingMore} variant="outline" className="min-w-[150px]">
            {loadingMore ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Xem thêm"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
