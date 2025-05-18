"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, ImageIcon, Pencil, Trash2 } from "lucide-react"
import { postsService, type Post, type CreatePostRequest } from "@/services/posts.service"
import { useRouter } from "next/navigation"

export default function PostsManagement() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false)
  const [editPostDialogOpen, setEditPostDialogOpen] = useState(false)
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState<CreatePostRequest>({
    image_url: "",
    caption: "",
    tags: []
  })
  const [activeTab, setActiveTab] = useState("grid")

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await postsService.getPosts()
      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Error fetching posts:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tải bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleCreatePost = async () => {
    try {
      if (!formData.image_url || !formData.caption) {
        toast({
          title: "Validation Error",
          description: "Image URL and caption are required.",
          variant: "destructive",
        })
        return
      }

      const newPost = await postsService.createPost(formData)
      setPosts((prevPosts) => [newPost, ...prevPosts])
      setNewPostDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: "Đã tạo bài viết thành công",
      })
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tạo bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const handleUpdatePost = async () => {
    try {
      if (!currentPost || !formData.image_url || !formData.caption) {
        toast({
          title: "Validation Error",
          description: "Image URL and caption are required.",
          variant: "destructive",
        })
        return
      }

      const updatedPost = await postsService.updatePost(currentPost.post_id, formData)
      setPosts((prevPosts) => prevPosts.map((post) => (post.post_id === updatedPost.post_id ? updatedPost : post)))
      setEditPostDialogOpen(false)
      resetForm()
      toast({
        title: "Thành công",
        description: "Đã cập nhật bài viết thành công",
      })
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async () => {
    try {
      if (!currentPost) return

      await postsService.deletePost(currentPost.post_id)
      setPosts((prevPosts) => prevPosts.filter((post) => post.post_id !== currentPost.post_id))
      setDeleteConfirmDialogOpen(false)
      setCurrentPost(null)
      toast({
        title: "Thành công",
        description: "Đã xóa bài viết thành công",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa bài viết. Vui lòng thử lại sau.",
        variant: "destructive",
      })
    }
  }

  const openDeleteDialog = (post: Post) => {
    setCurrentPost(post)
    setDeleteConfirmDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      image_url: "",
      caption: "",
      tags: []
    })
    setCurrentPost(null)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tags = e.target.value.split(',').map(tag => tag.trim()).filter(tag => tag)
    setFormData(prev => ({
      ...prev,
      tags
    }))
  }

  // Animation variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quản lý bài viết</h1>
          <p className="text-muted-foreground mt-1">Tạo và quản lý bài viết của bạn</p>
        </div>
        <Button onClick={() => router.push("/posts/create")} className="gap-2">
          <Plus className="h-4 w-4" />
          Tạo bài viết mới
        </Button>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "bài viết" : "bài viết"}
        </p>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-auto">
          <TabsList className="grid w-[180px] grid-cols-2">
            <TabsTrigger value="grid">Grid View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        {posts.length === 0 ? (
          <div className="text-center py-16 bg-muted/30 rounded-lg">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground/50 mb-4" />
            <h3 className="text-lg font-medium mb-2">Chưa có bài viết nào</h3>
            <p className="text-muted-foreground mb-6">Tạo bài viết đầu tiên của bạn</p>
            <Button onClick={() => router.push("/posts/create")} className="gap-2">
              <Plus className="h-4 w-4" />
              Tạo bài viết
            </Button>
          </div>
        ) : (
          <>
            <TabsContent value="grid" className="mt-0">
              <motion.div
                variants={container}
                initial="hidden"
                animate="show"
                className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
              >
                {posts.map((post) => (
                  <motion.div key={post.post_id} variants={item}>
                    <Card className="overflow-hidden h-full">
                      <div className="relative aspect-square">
                        <Image
                          src={post.image_url || "/placeholder.svg"}
                          alt={post.caption}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <CardContent className="p-4">
                        <p className="text-sm line-clamp-3">{post.caption}</p>
                        {post.tags.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-1">
                            {post.tags.map((tag, index) => (
                              <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        <div className="mt-2 space-y-1">
                          <div className="text-xs text-muted-foreground">
                            Tạo lúc: {format(new Date(post.created_at), "HH:mm - dd/MM/yyyy", { locale: vi })}
                          </div>
                          {post.updated_at && post.updated_at !== post.created_at && (
                            <div className="text-xs text-muted-foreground">
                              Cập nhật: {format(new Date(post.updated_at), "HH:mm - dd/MM/yyyy", { locale: vi })}
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => router.push(`/posts/edit/${post.post_id}`)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Chỉnh sửa
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDeleteDialog(post)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Xóa
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>

            <TabsContent value="list" className="mt-0">
              <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
                {posts.map((post) => (
                  <motion.div key={post.post_id} variants={item}>
                    <Card>
                      <div className="flex flex-col sm:flex-row">
                        <div className="relative w-full sm:w-48 h-48">
                          <Image
                            src={post.image_url || "/placeholder.svg"}
                            alt={post.caption}
                            fill
                            className="object-cover"
                            sizes="(max-width: 768px) 100vw, 192px"
                          />
                        </div>
                        <div className="flex flex-col flex-1 p-4">
                          <div className="flex-1">
                            <p>{post.caption}</p>
                            {post.tags.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-1">
                                {post.tags.map((tag, index) => (
                                  <span key={index} className="text-xs bg-muted px-2 py-1 rounded-full">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            )}
                            <div className="mt-2 space-y-1">
                              <div className="text-xs text-muted-foreground">
                                Tạo lúc: {format(new Date(post.created_at), "HH:mm - dd/MM/yyyy", { locale: vi })}
                              </div>
                              {post.updated_at && post.updated_at !== post.created_at && (
                                <div className="text-xs text-muted-foreground">
                                  Cập nhật: {format(new Date(post.updated_at), "HH:mm - dd/MM/yyyy", { locale: vi })}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => router.push(`/posts/edit/${post.post_id}`)}>
                              <Pencil className="h-4 w-4 mr-1" />
                              Chỉnh sửa
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                              onClick={() => openDeleteDialog(post)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Xóa
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            </TabsContent>
          </>
        )}
      </Tabs>

      {/* Create Post Dialog */}
      <Dialog open={newPostDialogOpen} onOpenChange={setNewPostDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Tạo bài viết mới</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="image_url" className="text-sm font-medium">
                URL hình ảnh
              </label>
              <Input
                id="image_url"
                name="image_url"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="caption" className="text-sm font-medium">
                Caption
              </label>
              <Textarea
                id="caption"
                name="caption"
                placeholder="Viết một caption cho bài viết của bạn..."
                value={formData.caption}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (phân cách bằng dấu phẩy)
              </label>
              <Input
                id="tags"
                name="tags"
                placeholder="portrait, wedding, nature"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
              />
            </div>
            {formData.image_url && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Preview</p>
                <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                  <Image
                    src={formData.image_url || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=300&width=400&text=Invalid+Image+URL"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNewPostDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreatePost}>Tạo bài viết</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={editPostDialogOpen} onOpenChange={setEditPostDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa bài viết</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit_image_url" className="text-sm font-medium">
                URL hình ảnh
              </label>
              <Input
                id="edit_image_url"
                name="image_url"
                placeholder="https://example.com/image.jpg"
                value={formData.image_url}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit_caption" className="text-sm font-medium">
                Caption
              </label>
              <Textarea
                id="edit_caption"
                name="caption"
                placeholder="Viết một caption cho bài viết của bạn..."
                value={formData.caption}
                onChange={handleInputChange}
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit_tags" className="text-sm font-medium">
                Tags (phân cách bằng dấu phẩy)
              </label>
              <Input
                id="edit_tags"
                name="tags"
                placeholder="portrait, wedding, nature"
                value={formData.tags.join(', ')}
                onChange={handleTagsChange}
              />
            </div>
            {formData.image_url && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Preview</p>
                <div className="relative aspect-video w-full rounded-md overflow-hidden border">
                  <Image
                    src={formData.image_url || "/placeholder.svg"}
                    alt="Preview"
                    fill
                    className="object-cover"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.svg?height=300&width=400&text=Invalid+Image+URL"
                    }}
                  />
                </div>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditPostDialogOpen(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdatePost}>Cập nhật bài viết</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Xóa bài viết</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Bạn có chắc chắn muốn xóa bài viết này? Hành động này không thể hoàn tác.</p>
            {currentPost && (
              <div className="mt-4 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={currentPost.image_url || "/placeholder.svg"}
                    alt="Bài viết cần xóa"
                    fill
                    className="object-cover"
                  />
                </div>
                <p className="text-sm line-clamp-2">{currentPost.caption}</p>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteConfirmDialogOpen(false)}>
              Hủy
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Xóa
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
