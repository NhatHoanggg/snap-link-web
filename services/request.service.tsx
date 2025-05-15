import axiosInstance from './axios'
import { OfferResponse } from './offer.service'
export interface CreateRequest {
    request_date: string;
    concept: string;
    estimated_budget: number;
    shooting_type: string;
    illustration_url: string;
    location_text: string;
    city: string;
}

export interface RequestResponse {
    request_date: string;
    concept: string;
    estimated_budget: number;
    shooting_type: string;
    illustration_url: string;
    location_text: string;
    city: string;
    request_id: number;
    user_id: number;
    status: string;
    created_at: string;
    request_code: string;
    offers: OfferResponse[];
}

export const createRequest = async (data: CreateRequest) => {
    try {
        const response = await axiosInstance.post('/requests', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}
// http://127.0.0.1:8001/requests?skip=0&limit=100

export const getRequests = async (skip: number = 0, limit: number = 100) => {
    try {
        const response = await axiosInstance.get(`/requests?skip=${skip}&limit=${limit}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRequestById = async (requestId: number) => {
    try {
        const response = await axiosInstance.get(`/requests/${requestId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMyRequests = async () => {
    try {
        const response = await axiosInstance.get(`/requests/me`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getRequestByCode = async (requestCode: string) => {
    try {
        const response = await axiosInstance.get(`/requests/code/${requestCode}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const deleteRequest = async (requestId: number) => {
    try {
        const response = await axiosInstance.delete(`/requests/${requestId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}