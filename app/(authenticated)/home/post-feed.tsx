"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Post } from "./post"
import { Button } from "@/components/ui/button"
import { Loader2 } from "lucide-react"

interface PostData {
  userId: number    
  id: number
  title: string
  body: string
}

export default function PostFeed() {
  const [posts, setPosts] = useState<PostData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)

  const fetchPosts = async (pageNum: number) => {
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_page=${pageNum}&_limit=5`)

      if (!response.ok) {
        throw new Error("Failed to fetch posts")
      }

      const data = await response.json()

      if (data.length === 0) {
        setHasMore(false)
        return
      }

      if (pageNum === 1) {
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
    fetchPosts(1)
  }, [])

  const loadMorePosts = () => {
    setLoadingMore(true)
    setPage((prev) => prev + 1)
    fetchPosts(page + 1)
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading posts...</span>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={() => fetchPosts(1)}>Try Again</Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <AnimatePresence>
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.1 }}
          >
            <Post post={post} />
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
              "Load More"
            )}
          </Button>
        </div>
      )}
    </div>
  )
}
