import axiosInstance from "./axios";

export interface OfferCreate {
    service_id: number;
    custom_price: number;
    message: string;
}

export interface OfferResponse {
    service_id: number;
    custom_price: number;
    message: string;
    request_offer_id: number;
    request_id: number;
    photographer_id: number;
    status: string;
    created_at: string;
}
export interface OfferDetailResponse {
    service_id: number;
    custom_price: number;
    message: string;
    request_offer_id: number;
    request_id: number;
    photographer_id: number;
    status: string;
    created_at: string;
    photographer_name: string;
    photographer_avatar: string;
    photographer_slug: string;
    service_title: string;
    service_price: number;
    service_description: string;
    service_thumbnail_url: string;
}




export const createOffer = async (offer: OfferCreate) => {
    try {
        const response = await axiosInstance.post('/offers', offer);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getMyOffers = async () => {
    try {
        const response = await axiosInstance.get('/requests/me/offers');
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getOfferByRequestId = async (request_id: number) => {
    try {
        const response = await axiosInstance.get(`/requests/${request_id}/offers`);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const getOfferDetail = async (request_offer_id: number) => {
    try {
        const response = await axiosInstance.get(`/requests/offers/${request_offer_id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
}