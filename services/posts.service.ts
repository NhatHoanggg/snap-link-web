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

export interface PostResponse {
    post_id: number
    photographer_id: number
    image_url: string
    caption: string
    created_at: string
    updated_at: string
    like_count: number
    comment_count: number
    tags: string[]
    is_liked: boolean
    photographer_name: string
    photographer_avatar: string
    photographer_slug: string
}

export interface CommentResponse {
    comment_id: number
    post_id: number
    user_id: number
    content: string
    created_at: string
    user_name: string
    user_avatar: string
    user_slug: string
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
    },

    async getLastestPosts(): Promise<PostResponse[]> {
        try {
            const response = await axiosInstance.get(`/posts/latest?skip=0&limit=20`)
            return response.data
        } catch (error) {
            console.error('Error fetching latest posts:', error)
            throw error
        }
    },

    async getAllPosts(skip = 0, limit = 20): Promise<PostResponse[]> {
        try {
            const response = await axiosInstance.get(`/posts/all?skip=${skip}&limit=${limit}`)
            return response.data
        } catch (error) {
            console.error('Error fetching all posts:', error)
            throw error
        }
    },

    async likePost(postId: number): Promise<void> {
        try {
            await axiosInstance.post(`/posts/like`, {
                post_id: postId
            })
        } catch (error) {
            console.error(`Error liking post ${postId}:`, error)
            throw error
        }
    },

    async unlikePost(postId: number): Promise<void> {
        try {
            await axiosInstance.delete(`/posts/${postId}/like`)
        } catch (error) {
            console.error(`Error unliking post ${postId}:`, error)
            throw error
        }
    },

    async commentPost(postId: number, comment: string): Promise<void> {
        try {
            await axiosInstance.post(`/posts/comment`, {
                post_id: postId,
                content: comment
            })
        } catch (error) {
            console.error(`Error commenting post ${postId}:`, error)
            throw error
        }
    },

    async updateComment(commentId: number, comment: string): Promise<void> {
        try {
            await axiosInstance.put(`/comments/${commentId}`, {
                content: comment
            })
        } catch (error) {
            console.error(`Error updating comment ${commentId}:`, error)
            throw error
        }
    },

    
    async deleteComment(commentId: number): Promise<void> {
        try {
            await axiosInstance.delete(`/comments/${commentId}`)
        } catch (error) {
            console.error(`Error delete comment ${commentId}:`, error)
            throw error
        }
    },


    async getCommentsByPostId(postId: number): Promise<CommentResponse[]> {
        try {
            const response = await axiosInstance.get(`/posts/${postId}/comments`)
            return response.data
        } catch (error) {
            console.error(`Error fetching comments for post ${postId}:`, error)
            throw error
        }
    }
    
}

  