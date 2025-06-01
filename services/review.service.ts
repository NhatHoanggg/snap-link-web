import axiosInstance from "./axios";

export interface ReviewCreate{
    rating: number;
    comment: string;
    booking_id: number;
}

export interface ReviewResponse{
    rating: number;
    comment: string;
    review_id: number;
    booking_id: number;
    customer_id: number;
    photographer_id: number;
    created_at: string;
    customer_name: string | null;
    customer_avatar: string | null;
}

export interface ReviewEdit{
    rating: number;
    comment: string;
}

export interface ReviewStatusResponse{
    has_reviewed: boolean;
    review: ReviewResponse | null;
}

export interface PhotographerReviews{
    total: number;
    reviews: ReviewResponse[];
}

export const createReview = async (review: ReviewCreate) => {
    try {
        const response = await axiosInstance.post<ReviewResponse>('/reviews', review);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getReviewsByPhotographerId = async (photographer_id: number) => {
    try {
        const response = await axiosInstance.get<PhotographerReviews>(`/photographers/${photographer_id}/reviews`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const editReview = async (review_id: number, review: ReviewEdit) => {
    try {
        const response = await axiosInstance.put<ReviewResponse>(`/reviews/${review_id}`, review);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteReview = async (review_id: number) => {
    try {
        const response = await axiosInstance.delete<ReviewResponse>(`/reviews/${review_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const isReviewed = async (booking_id: number) => {
    try {
        const response = await axiosInstance.get<ReviewStatusResponse>(`/reviews/${booking_id}/review-status`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

