import axiosInstance from './axios'

export interface CreatePostRequest {
    image_url: string
    caption: string
    tags: string[]
}

export interface UpdatePostRequest {
    image_url: string
    caption: string
    tags: string[]
}

export interface Post {
    post_id: number
    photographer_id: number
    image_url: string
    caption: string
    created_at: string
    updated_at: string
    like_count: number
    comment_count: number
    tags: string[]
}


export const postsService = {
    async getPosts(): Promise<Post[]> {
        try {
            const response = await axiosInstance.get(`/photographers/me/posts`)
            return response.data
        } catch (error) {
            console.error('Error fetching posts:', error)
            throw error
        }
    },

    async getPostById(postId: number): Promise<Post> {
        try {
            const response = await axiosInstance.get(`/photographers/me/posts/${postId}`)
            return response.data
        } catch (error) {
            console.error(`Error fetching post ${postId}:`, error)
            throw error
        }
    },

    async createPost(data: CreatePostRequest): Promise<Post> {
        try {
            const response = await axiosInstance.post(`/posts`, data)
            return response.data
        } catch (error) {
            console.error('Error creating post:', error)
            throw error
        }
    },

    async updatePost(postId: number, data: UpdatePostRequest): Promise<Post> {
        try {
            const response = await axiosInstance.put(`/posts/${postId}`, data)
            return response.data
        } catch (error) {
            console.error(`Error updating post ${postId}:`, error)
            throw error
        }
    },

    async deletePost(postId: number): Promise<void> {
        try {
            await axiosInstance.delete(`/photographers/me/posts/${postId}`)
        } catch (error) {
            console.error(`Error deleting post ${postId}:`, error)
            throw error
        }
    }
}
  