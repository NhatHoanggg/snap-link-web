"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, ImageIcon, Pencil, Trash2 } from "lucide-react"
import { postsService, type Post } from "@/lib/services/posts.service"

export default function PostsManagement() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [newPostDialogOpen, setNewPostDialogOpen] = useState(false)
  const [editPostDialogOpen, setEditPostDialogOpen] = useState(false)
  const [deleteConfirmDialogOpen, setDeleteConfirmDialogOpen] = useState(false)
  const [currentPost, setCurrentPost] = useState<Post | null>(null)
  const [formData, setFormData] = useState({
    image_url: "",
    caption: "",
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
        title: "Error",
        description: "Failed to load posts. Please try again.",
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
        title: "Success",
        description: "Post created successfully!",
      })
    } catch (error) {
      console.error("Error creating post:", error)
      toast({
        title: "Error",
        description: "Failed to create post. Please try again.",
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

      const updatedPost = await postsService.updatePost(currentPost.id, formData)
      setPosts((prevPosts) => prevPosts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
      setEditPostDialogOpen(false)
      resetForm()
      toast({
        title: "Success",
        description: "Post updated successfully!",
      })
    } catch (error) {
      console.error("Error updating post:", error)
      toast({
        title: "Error",
        description: "Failed to update post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeletePost = async () => {
    try {
      if (!currentPost) return

      await postsService.deletePost(currentPost.id)
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== currentPost.id))
      setDeleteConfirmDialogOpen(false)
      setCurrentPost(null)
      toast({
        title: "Success",
        description: "Post deleted successfully!",
      })
    } catch (error) {
      console.error("Error deleting post:", error)
      toast({
        title: "Error",
        description: "Failed to delete post. Please try again.",
        variant: "destructive",
      })
    }
  }

  const openEditDialog = (post: Post) => {
    setCurrentPost(post)
    setFormData({
      image_url: post.image_url,
      caption: post.caption,
    })
    setEditPostDialogOpen(true)
  }

  const openDeleteDialog = (post: Post) => {
    setCurrentPost(post)
    setDeleteConfirmDialogOpen(true)
  }

  const resetForm = () => {
    setFormData({
      image_url: "",
      caption: "",
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
          <p className="text-lg font-medium">Loading posts...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Posts Management</h1>
          <p className="text-muted-foreground mt-1">Create and manage your posts</p>
        </div>
        <Button onClick={() => setNewPostDialogOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Post
        </Button>
      </div>

      <div className="mb-6 flex justify-between items-center">
        <p className="text-sm text-muted-foreground">
          {posts.length} {posts.length === 1 ? "post" : "posts"}
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
            <h3 className="text-lg font-medium mb-2">No posts yet</h3>
            <p className="text-muted-foreground mb-6">Create your first post to get started</p>
            <Button onClick={() => setNewPostDialogOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Create Post
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
                  <motion.div key={post.id} variants={item}>
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
                      </CardContent>
                      <CardFooter className="p-4 pt-0 flex justify-between">
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-destructive"
                          onClick={() => openDeleteDialog(post)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Delete
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
                  <motion.div key={post.id} variants={item}>
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
                          </div>
                          <div className="flex justify-end gap-2 mt-4">
                            <Button variant="outline" size="sm" onClick={() => openEditDialog(post)}>
                              <Pencil className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="text-destructive"
                              onClick={() => openDeleteDialog(post)}
                            >
                              <Trash2 className="h-4 w-4 mr-1" />
                              Delete
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
            <DialogTitle>Create New Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="image_url" className="text-sm font-medium">
                Image URL
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
                placeholder="Write a caption for your post..."
                value={formData.caption}
                onChange={handleInputChange}
                rows={4}
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
              Cancel
            </Button>
            <Button onClick={handleCreatePost}>Create Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={editPostDialogOpen} onOpenChange={setEditPostDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <label htmlFor="edit_image_url" className="text-sm font-medium">
                Image URL
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
                placeholder="Write a caption for your post..."
                value={formData.caption}
                onChange={handleInputChange}
                rows={4}
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
              Cancel
            </Button>
            <Button onClick={handleUpdatePost}>Update Post</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteConfirmDialogOpen} onOpenChange={setDeleteConfirmDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            {currentPost && (
              <div className="mt-4 flex items-center gap-4">
                <div className="relative w-16 h-16 rounded overflow-hidden flex-shrink-0">
                  <Image
                    src={currentPost.image_url || "/placeholder.svg"}
                    alt="Post to delete"
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
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
