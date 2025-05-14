import axiosInstance from './axios'

export interface CreateRequest {
    request_date: string;
    concept: string;
    estimated_budget: number;
    shooting_type: string;
    illustration_url: string;
    location_text: string;
    city: string;
}

export const createRequest = async (data: CreateRequest) => {
    try {
        const response = await axiosInstance.post('/requests', data);
        return response.data;
    } catch (error) {
        throw error;
    }
}




