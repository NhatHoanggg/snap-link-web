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
