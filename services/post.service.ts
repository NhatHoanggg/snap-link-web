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
    like_count: number
    comment_count: number
    tags: string[]
}

