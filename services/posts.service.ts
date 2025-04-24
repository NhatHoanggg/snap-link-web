// This is a mock service for demonstration purposes
// In a real application, this would connect to your backend API

export interface Post {
    id: string
    image_url: string
    caption: string
    created_at: string
    updated_at: string
  }
  
  // Sample data
  let mockPosts: Post[] = [
    {
      id: "1",
      image_url: "/placeholder.svg?height=400&width=400&text=Beach+Sunset",
      caption: "Beautiful sunset at the beach today. The colors were absolutely breathtaking!",
      created_at: new Date(Date.now() - 86400000 * 2).toISOString(), // 2 days ago
      updated_at: new Date(Date.now() - 86400000 * 2).toISOString(),
    },
    {
      id: "2",
      image_url: "/placeholder.svg?height=400&width=400&text=Mountain+View",
      caption: "Hiking in the mountains this weekend. The view from the top was worth every step!",
      created_at: new Date(Date.now() - 86400000 * 5).toISOString(), // 5 days ago
      updated_at: new Date(Date.now() - 86400000 * 5).toISOString(),
    },
    {
      id: "3",
      image_url: "/placeholder.svg?height=400&width=400&text=City+Lights",
      caption: "City lights at night. There's something magical about a city that never sleeps.",
      created_at: new Date(Date.now() - 86400000 * 7).toISOString(), // 7 days ago
      updated_at: new Date(Date.now() - 86400000 * 7).toISOString(),
    },
    {
      id: "4",
      image_url: "/placeholder.svg?height=400&width=400&text=Coffee+Time",
      caption: "Morning coffee and a good book. Perfect start to the day!",
      created_at: new Date(Date.now() - 86400000 * 10).toISOString(), // 10 days ago
      updated_at: new Date(Date.now() - 86400000 * 10).toISOString(),
    },
  ]
  
  class PostsService {
    async getPosts(): Promise<Post[]> {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))
  
      // Return posts sorted by creation date (newest first)
      return [...mockPosts].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    }
  
    async getPostById(id: string): Promise<Post | null> {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500))
  
      const post = mockPosts.find((p) => p.id === id)
      return post || null
    }
  
    async createPost(postData: { image_url: string; caption: string }): Promise<Post> {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      const newPost: Post = {
        id: `post-${Date.now()}`,
        image_url: postData.image_url,
        caption: postData.caption,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
  
      mockPosts = [newPost, ...mockPosts]
      return newPost
    }
  
    async updatePost(id: string, postData: { image_url: string; caption: string }): Promise<Post> {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))
  
      const postIndex = mockPosts.findIndex((p) => p.id === id)
      if (postIndex === -1) {
        throw new Error("Post not found")
      }
  
      const updatedPost: Post = {
        ...mockPosts[postIndex],
        image_url: postData.image_url,
        caption: postData.caption,
        updated_at: new Date().toISOString(),
      }
  
      mockPosts[postIndex] = updatedPost
      return updatedPost
    }
  
    async deletePost(id: string): Promise<void> {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 800))
  
      const postIndex = mockPosts.findIndex((p) => p.id === id)
      if (postIndex === -1) {
        throw new Error("Post not found")
      }
  
      mockPosts = mockPosts.filter((p) => p.id !== id)
    }
  }
  
  export const postsService = new PostsService()
  