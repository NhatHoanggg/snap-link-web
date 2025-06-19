"use client"

import { useState, useEffect, use } from "react"
import Image from "next/image"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import toast, {Toaster} from "react-hot-toast"
import { Loader2, Heart, MessageCircle, Send, MoreHorizontal, Pencil, Trash2 } from "lucide-react"
import { postsService, type Post, type CommentResponse } from "@/services/posts.service"
import { useRouter } from "next/navigation"
import { useAuth } from "@/services/auth"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function PostDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [comments, setComments] = useState<CommentResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [commentContent, setCommentContent] = useState("")
  const [submittingComment, setSubmittingComment] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { user } = useAuth()
  const [editingCommentId, setEditingCommentId] = useState<number | null>(null)
  const [editingCommentText, setEditingCommentText] = useState("")
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null)

  useEffect(() => {
    fetchPostAndComments()
  }, [resolvedParams.id])

  const fetchPostAndComments = async () => {
    try {
      setLoading(true)
      const [postData, commentsData] = await Promise.all([
        postsService.getPostById(parseInt(resolvedParams.id)),
        postsService.getCommentsByPostId(parseInt(resolvedParams.id))
      ])
      setPost(postData)
      // console.log(postData)
      setComments(commentsData)
      // console.log(commentsData)
    } catch (error) {
      console.error("Error fetching post and comments:", error)
      toast.error("Không thể tải bài viết. Vui lòng thử lại sau.")
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async () => {
    if (!post) return

    try {
      if (isLiked) {
        await postsService.unlikePost(post.post_id)
        setPost(prev => prev ? { ...prev, like_count: prev.like_count - 1 } : null)
        setIsLiked(false)
      } else {
        await postsService.likePost(post.post_id)
        setPost(prev => prev ? { ...prev, like_count: prev.like_count + 1 } : null)
        setIsLiked(true)
      }
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Không thể thực hiện thao tác. Vui lòng thử lại sau.")
    }
  }

  const handleComment = async () => {
    if (!post || !commentContent.trim()) return

    try {
      setSubmittingComment(true)
      await postsService.commentPost(post.post_id, commentContent.trim())
      await fetchPostAndComments() // Refresh comments
      setCommentContent("")
      toast.success("Đã thêm bình luận")
    } catch (error) {
      console.error("Error posting comment:", error)
      toast.error("Không thể thêm bình luận. Vui lòng thử lại sau.")
    } finally {
      setSubmittingComment(false)
    }
  }

  const handleEditComment = (comment: CommentResponse) => {
    setEditingCommentId(comment.comment_id)
    setEditingCommentText(comment.content)
  }

  const handleCancelEdit = () => {
    setEditingCommentId(null)
    setEditingCommentText("")
  }

  const handleUpdateComment = async (commentId: number) => {
    if (!editingCommentText.trim()) return
    try {
      await postsService.updateComment(commentId, editingCommentText)
      setComments(comments.map(c => c.comment_id === commentId ? { ...c, content: editingCommentText } : c))
      toast.success("Cập nhật bình luận thành công.")
      setEditingCommentId(null)
      setEditingCommentText("")
    } catch {
      toast.success("Không thể cập nhật bình luận.")
    }
  }

  const handleDeleteComment = async (commentId: number) => {
    setDeletingCommentId(commentId)
    try {
      await postsService.deleteComment(commentId)
      setComments(comments.filter(c => c.comment_id !== commentId))
      toast.success("Đã xóa bình luận.")
    } catch {
      toast.error("Không thể xóa bình luận. Vui lòng thử lại sau.")
    } finally {
      setDeletingCommentId(null)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-16 flex justify-center">
        <div className="flex flex-col items-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
          <p className="text-lg font-medium">Đang tải bài viết...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold mb-4">Không tìm thấy bài viết</h2>
        <Button onClick={() => router.push("/posts")}>Quay lại danh sách bài viết</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="outline" onClick={() => router.push("/posts")} className="mb-6">
        ← Quay lại
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Post Image */}
        <div className="relative aspect-square rounded-lg overflow-hidden">
          <Image
            src={post.image_url || "/placeholder.svg"}
            alt={post.caption}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />
        </div>

        {/* Post Details */}
        <div className="space-y-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4 mb-4">
                  <p className="text-sm text-muted-foreground">
                    Tạo lúc: {format(new Date(post.created_at), "HH:mm - dd/MM/yyyy", { locale: vi })}
                  </p>
              </div>
              {post.updated_at && (post.updated_at !== post.created_at) && (
                <p className="text-sm text-muted-foreground">
                  Cập nhật: {format(new Date(post.updated_at), "HH:mm - dd/MM/yyyy", { locale: vi })}
                </p>
              )}

              <p className="text-lg mb-4">{post.caption}</p>

              {post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.map((tag, index) => (
                    <span key={index} className="text-sm bg-muted px-3 py-1 rounded-full">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}

              <div className="flex items-center gap-6">
                <Button
                  variant="ghost"
                  size="sm"
                  className={`gap-2 ${isLiked ? "text-red-500" : ""}`}
                  onClick={handleLike}
                >
                  <Heart className={`h-5 w-5 ${isLiked ? "fill-current" : ""}`} />
                  <span>{post.like_count}</span>
                </Button>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MessageCircle className="h-5 w-5" />
                  <span>{post.comment_count}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Comments Section */}
          <Card>
            <CardContent className="p-6">
              <h3 className="font-medium mb-4">Bình luận</h3>
              
              {/* Comment Input */}
              <div className="flex gap-2 mb-6">
                <Textarea
                  placeholder="Viết bình luận của bạn..."
                  value={commentContent}
                  onChange={(e) => setCommentContent(e.target.value)}
                  className="flex-1"
                />
                <Button
                  onClick={handleComment}
                  disabled={!commentContent.trim() || submittingComment}
                >
                  {submittingComment ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>

              {/* Comments List */}
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.comment_id} className="flex gap-4">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      <Image
                        src={comment.user_avatar || "/images/default.jpg"}
                        alt={comment.user_name}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <div>
                          <span className="font-medium">{comment.user_name}</span>
                          <span className="text-sm text-muted-foreground ml-2">
                            {format(new Date(comment.created_at), "HH:mm - dd/MM/yyyy", { locale: vi })}
                          </span>
                        </div>
                        {user?.user_id === comment.user_id && (
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <button className="ml-2 p-1 rounded hover:bg-accent"><MoreHorizontal className="h-4 w-4" /></button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditComment(comment)}>
                                <Pencil className="mr-2 h-4 w-4" /> Sửa
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteComment(comment.comment_id)} variant="destructive">
                                <Trash2 className="mr-2 h-4 w-4" /> Xóa
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        )}
                      </div>
                      {editingCommentId === comment.comment_id ? (
                        <div className="space-y-2 mt-2">
                          <Textarea
                            value={editingCommentText}
                            onChange={e => setEditingCommentText(e.target.value)}
                            className="min-h-[60px]"
                            autoFocus
                          />
                          <div className="flex gap-2 justify-end">
                            <Button size="sm" variant="outline" onClick={handleCancelEdit}>Hủy</Button>
                            <Button size="sm" onClick={() => handleUpdateComment(comment.comment_id)}>
                              <Send className="mr-2 h-4 w-4" /> Lưu
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <p className="mt-1">{comment.content}</p>
                      )}
                      {deletingCommentId === comment.comment_id && (
                        <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                          <Loader2 className="animate-spin h-6 w-6 text-primary" />
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {comments.length === 0 && (
                  <p className="text-center text-muted-foreground py-4">
                    Chưa có bình luận nào. Hãy là người đầu tiên bình luận!
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Toaster position="bottom-right"/>
    </div>
  )
}
