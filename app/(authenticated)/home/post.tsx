"use client"

import type React from "react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Heart, MessageCircle, Send, Loader2 } from "lucide-react"
import { PostResponse, CommentResponse, postsService } from "@/services/posts.service"
import toast, { Toaster } from 'react-hot-toast';
import { useAuth } from "@/services/auth";


interface PostProps {
  post: PostResponse
}

export function Post({ post }: PostProps) {
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [showComments, setShowComments] = useState(false)
  const [liked, setLiked] = useState(post.is_liked)
  const [likeCount, setLikeCount] = useState(post.like_count)
  const [commentText, setCommentText] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)
  const [liking, setLiking] = useState(false)
  const { user } = useAuth()

  const fetchComments = async () => {
    if (comments.length > 0) return

    setLoadingComments(true)
    try {
      const data = await postsService.getCommentsByPostId(post.post_id)
      setComments(data)
    } catch (error) {
      console.error("Error fetching comments:", error)
      toast.error("Không thể tải bình luận. Vui lòng thử lại sau.")

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

  const toggleLike = async () => {
    if (liking) return
    setLiking(true)
    try {
      if (liked) {
        await postsService.unlikePost(post.post_id)
        setLikeCount(likeCount - 1)
      } else {
        await postsService.likePost(post.post_id)
        setLikeCount(likeCount + 1)
      }
      setLiked(!liked)
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại sau.")
      // Revert the optimistic update
      setLiked(liked)
      setLikeCount(likeCount)
    } finally {
      setLiking(false)
    }
  }

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!commentText.trim() || submittingComment) return

    setSubmittingComment(true)
    try {
      await postsService.commentPost(post.post_id, commentText)
      
      // Add the new comment to the list
      const newComment: CommentResponse = {
        comment_id: Date.now(), 
        post_id: post.post_id,
        user_id: user?.user_id || 1, 
        content: commentText,
        created_at: new Date().toISOString(),
        user_name: user?.full_name || "",
        user_avatar: user?.avatar || "", 
        user_slug: user?.slug || "" 
      }
      
      setComments([newComment, ...comments])
      setCommentText("")
      
      toast.success("Bình luận của bạn đã được đăng.")

    } catch (error) {
      console.error("Error posting comment:", error)
      toast.error("Không thể đăng bình luận. Vui lòng thử lại sau.")

    } finally {
      setSubmittingComment(false)
    }
  }

  const formattedTime = format(new Date(post.created_at), "HH:mm - dd/MM/yyyy", { locale: vi })

  return (
    <Card className="overflow-hidden">
      <Toaster position="bottom-right" />

      <CardHeader className="pb-3">
        <div className="flex items-start gap-4">
          <Link href={`/photographer/${post.photographer_slug}`}>
            <Avatar className="h-10 w-10 border cursor-pointer">
              <AvatarImage src={post.photographer_avatar} alt={post.photographer_name} />
              <AvatarFallback>{post.photographer_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
            </Avatar>
          </Link>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <Link href={`/photographer/${post.photographer_slug}`} className="hover:underline">
                  <p className="font-medium leading-none">{post.photographer_name}</p>
                </Link>
                <p className="text-sm text-muted-foreground">@{post.photographer_slug}</p>
              </div>
              <p className="text-xs text-muted-foreground">{formattedTime}</p>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-4">
        <p className="text-muted-foreground mb-4">{post.caption}</p>

        <div className="mt-4 rounded-md overflow-hidden">
          <Image
            src={post.image_url}
            alt="Post image"
            width={800}
            height={400}
            className="w-full h-auto object-cover transition-transform hover:scale-105"
          />
        </div>

        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                #{tag}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <div className="flex items-center justify-between w-full pb-4">
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="gap-1 text-muted-foreground hover:text-primary"
              onClick={toggleLike}
              disabled={liking}
            >
              {liking ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <Heart className={`h-5 w-5 ${liked ? "fill-red-500 text-red-500" : ""}`} />
              )}
              <span>{likeCount}</span>
            </Button>
            <Button 
              variant="ghost" 
              size="sm" 
              className="gap-1 text-muted-foreground" 
              onClick={toggleComments}
            >
              <MessageCircle className="h-5 w-5" />
              <span>{post.comment_count}</span>
            </Button>
          </div>
          <Badge variant="outline" className="text-xs">
            #{post.post_id}
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
                    <AvatarFallback>{user?.full_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                    <AvatarImage src={user?.avatar || ""} alt={user?.full_name || ""} />
                  </Avatar>
                  <div className="flex-1 space-y-2">
                    <Textarea
                      placeholder="Viết bình luận..."
                      className="min-h-[80px] resize-none"
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      disabled={submittingComment}
                    />
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        size="sm" 
                        disabled={!commentText.trim() || submittingComment}
                      >
                        {submittingComment ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Đang đăng...
                          </>
                        ) : (
                          <>
                            <Send className="mr-2 h-4 w-4" />
                            Đăng
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
                      key={comment.comment_id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex gap-3"
                    >
                      <Link href={`/photographer/${comment.user_slug}`}>
                        <Avatar className="h-8 w-8 cursor-pointer">
                          <AvatarImage src={comment.user_avatar} alt={comment.user_name} />
                          <AvatarFallback>{comment.user_name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1">
                        <div className="bg-muted/50 rounded-lg p-3">
                          <div className="flex justify-between items-start mb-1">
                            <Link 
                              href={`/photographer/${comment.user_slug}`}
                              className="font-medium text-sm hover:underline"
                            >
                              {comment.user_name}
                            </Link>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(comment.created_at), "HH:mm - dd/MM/yyyy", { locale: vi })}
                            </span>
                          </div>
                          <p className="text-sm">{comment.content}</p>
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
