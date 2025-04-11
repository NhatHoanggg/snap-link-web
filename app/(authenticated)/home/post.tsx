"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Send, Loader2 } from "lucide-react"

interface PostProps {
  post: {
    userId: number
    id: number
    title: string
    body: string
  }
}

interface User {
  id: number
  name: string
  username: string
  email: string
}

interface Comment {
  postId: number
  id: number
  name: string
  email: string
  body: string
}

export function Post({ post }: PostProps) {
  const [user, setUser] = useState<User | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(Math.floor(Math.random() * 50))
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(`https://jsonplaceholder.typicode.com/users/${post.userId}`)
        if (!response.ok) throw new Error("Failed to fetch user")
        const data = await response.json()
        setUser(data)
      } catch (error) {
        console.error("Error fetching user:", error)
      }
    }

    fetchUser()
  }, [post.userId])

  const fetchComments = async () => {
    if (comments.length > 0) return

    setLoadingComments(true)
    try {
      const response = await fetch(`https://jsonplaceholder.typicode.com/posts/${post.id}/comments`)
      if (!response.ok) throw new Error("Failed to fetch comments")
      const data = await response.json()
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
    } finally {
      setLoadingComments(false)
    }
  }

  const toggleComments = () => {
    if (!showComments && comments.length === 0) {
      fetchComments()
    }
    setShowComments(!showComments)
  }

  const toggleLike = () => {
    if (liked) {
      setLikeCount(likeCount - 1)
    } else {
      setLikeCount(likeCount + 1)
    }
    setLiked(!liked)
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim()) return

    setSubmittingComment(true)

    try {
      const response = await fetch("https://jsonplaceholder.typicode.com/comments", {
        method: "POST",
        body: JSON.stringify({
          postId: post.id,
          name: "Current User",
          email: "user@example.com",
          body: commentText,
        }),
        headers: {
          "Content-type": "application/json; charset=UTF-8",
        },
      })

      if (!response.ok) throw new Error("Failed to post comment")

       await response.json()

      // JSONPlaceholder doesn't actually save the comment, so we'll add it to our local state
      setComments([
        {
          postId: post.id,
          id: Date.now(), // Use timestamp as temporary ID
          name: "Current User",
          email: "user@example.com",
          body: commentText,
        },
        ...comments,
      ])

      setCommentText("")
    } catch (error) {
      console.error("Error posting comment:", error)
    } finally {
      setSubmittingComment(false)
    }
  }

  // Generate a random date in the past week for the post
  const randomDate = new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000))
  const timeAgo = formatDistanceToNow(randomDate, { addSuffix: true })

  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Avatar className="h-10 w-10 border">
            <AvatarImage src={`https://i.pravatar.cc/150?u=${post.userId}`} alt={user?.name || "User"} />
            <AvatarFallback>{user ? getInitials(user.name) : "U"}</AvatarFallback>
          </Avatar>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium leading-none">{user?.name || "Loading..."}</p>
                <p className="text-sm text-muted-foreground">@{user?.username || "user"}</p>
              </div>
              <p className="text-xs text-muted-foreground">{timeAgo}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <h3 className="font-semibold text-lg capitalize mb-2">{post.title}</h3>
        <p className="text-muted-foreground">{post.body}</p>

        {/* Random image for visual interest */}
        <div className="mt-4 rounded-md overflow-hidden">
          <Image
            src={`https://picsum.photos/seed/${post.id}/800/400`}
            alt="Post image"
            width={800}
            height={400}
            className="w-full h-auto object-cover transition-transform hover:scale-105"
          />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <div className="flex items-center justify-between w-full pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-primary"
              onClick={toggleLike}
            >
              <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              <span>{likeCount}</span>
            </Button>
            <Button variant="ghost" size="sm" className="gap-1 text-muted-foreground" onClick={toggleComments}>
              <MessageCircle className="h-5 w-5" />
              <span>{comments.length}</span>
            </Button>
          </div>
          <Badge variant="outline" className="text-xs">
            #{post.id}
          </Badge>
        </div>

        <AnimatePresence>
          {showComments && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="w-full"
            >
              <Separator className="mb-4" />

              <form onSubmit={handleSubmitComment} className="mb-4">
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>ME</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Write a comment..."
                      className="min-h-[80px] resize-none"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                    />
                    <div className="flex justify-end">
                      <Button type="submit" size="sm" disabled={!commentText.trim() || submittingComment}>
                        {submittingComment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Posting...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Post
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </form>

              {loadingComments ? (
                <div className="flex justify-center py-4">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : (
                <div className="space-y-4">
                  {comments.map((comment) => (
                    <motion.div
                      key={comment.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={`https://i.pravatar.cc/150?u=${comment.email}`} alt={comment.name} />
                        <AvatarFallback>{getInitials(comment.name)}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <p className="font-medium text-sm">{comment.name}</p>
                            <Badge variant="outline" className="text-[10px] h-4">
                              {comment.email.split("@")[0]}
                            </Badge>
                          </div>
                          <p className="text-sm">{comment.body}</p>
                        </div>
                        <div className="flex gap-4 mt-1 ml-2">
                          <button className="text-xs text-muted-foreground hover:text-foreground">Like</button>
                          <button className="text-xs text-muted-foreground hover:text-foreground">Reply</button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </CardFooter>
    </Card>
  )
}
