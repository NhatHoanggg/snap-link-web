// import axios from 'axios';
// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";
import {type Service } from './services.service';
import axiosInstance from './axios';

export interface FeaturedPhoto {
  featured_photo_id: number;
  photographer_id: number;
  image_url: string;
  title: string;
  description: string;
  uploaded_at: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
  youtube?: string;
  [key: string]: string | undefined;
}

export interface Portfolio {
  portfolio_id: number;
  avatar_url: string;
  bio: string;
  social_media_links: SocialMediaLinks;
  phone_number: string;
  email: string;
  average_rating: string; // <-- string theo API
  review_count: number;
  featured_photos: FeaturedPhoto[];
  services: Service[];
}

export interface Photographer {
  user_id: number;
  photographer_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  avatar: string;
  background_image: string | null;
  bio: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  price_per_hour: number;
  experience_years: number;
  followers_count: number;
  average_rating: number;
  total_reviews: number;
  total_bookings: number;
  is_active: boolean;
  slug: string;
  avatar_url: string;
  social_media_links: string;
  tags: string[];
  services: Service[];
  featured_photos: FeaturedPhoto[];
  portfolio: Portfolio | null;
}

export interface PhotographersResponse {
  total: number;
  photographers: Photographer[];
}

export interface SimplifiedPhotographerProfile {
  full_name: string;
  slug: string;
  avatar: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  price_per_hour: number;
  experience_years: number;
  average_rating: number;
  tags: string[];
  total_bookings: number;
}

export interface PaymentInfo{
  bank_name: string;
  account_number: string;
}

export interface SimplifiedPhotographersResponse {
  total: number;
  photographers: SimplifiedPhotographerProfile[];
}

export interface PhotographerFilters {
  skip?: number;
  limit?: number;
  search?: string;
  location?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'rating' | 'price' | 'reviews';
  sort_order?: 'asc' | 'desc';
}

export interface SimplifiedPhotographerFilters {
  skip?: number;
  limit?: number;
  search?: string;
  min_price?: number;
  max_price?: number;
  min_experience?: number;
  tags?: string[];
  sort_by?: 'rating' | 'price_low' | 'price_high' | 'experience';
}

export const photographerService = {
  async getPhotographers(filters: PhotographerFilters = {}): Promise<PhotographersResponse> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await axiosInstance.get<PhotographersResponse>(
        `/photographers?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error occurred');
    }
  },


  async getPhotographerBySlug(slug: string): Promise<Photographer> {
    try {
      const response = await axiosInstance.get<Photographer>(`/photographers/slug/${slug}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error occurred');
    }
  },

  async getPhotographerById(id: number): Promise<Photographer>{
    try {
      const response = await axiosInstance.get<Photographer>(`/photographers/${id}`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error occurred');
    }
  },

  async getPhotographerName(id: number): Promise<string>{
    try {
      const response = await axiosInstance.get<Photographer>(`/photographers/${id}`);
      return response.data.full_name;
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error occurred');
    }
  },



  async updatePhotographerProfile(
    photographerId: number,
    data: Partial<Photographer>,
    token: string
  ): Promise<Photographer> {
    try {
      const response = await axiosInstance.patch<Photographer>(
        `/photographers/${photographerId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error occurred');
    }
  },

  async getPhotographersByDate(
    availableDate: string,
    skip: number = 0,
    limit: number = 100
  ): Promise<PhotographersResponse> {
    try {
      const params = new URLSearchParams({
        available_date: availableDate,
        skip: skip.toString(),
        limit: limit.toString(),
      });

      const response = await axiosInstance.get<PhotographersResponse>(
        `/photographers/availability/search?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error occurred');
    }
  },

  async getSimplifiedPhotographers(filters: SimplifiedPhotographerFilters = {}): Promise<SimplifiedPhotographersResponse> {
    try {
      const params = new URLSearchParams();
      
      // Add basic filters
      if (filters.skip !== undefined) params.append('skip', filters.skip.toString());
      if (filters.limit !== undefined) params.append('limit', filters.limit.toString());
      if (filters.search) params.append('search', filters.search);
      if (filters.min_price !== undefined) params.append('min_price', filters.min_price.toString());
      if (filters.max_price !== undefined) params.append('max_price', filters.max_price.toString());
      if (filters.min_experience !== undefined) params.append('min_experience', filters.min_experience.toString());
      
      // Handle tags array
      if (filters.tags && filters.tags.length > 0) {
        filters.tags.forEach(tag => params.append('tags', tag));
      }

      const response = await axiosInstance.get<SimplifiedPhotographersResponse>(
        `/photographers/simplified?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error occurred');
    }
  },

  async getMyPaymentInfo(){
    try {
      const response = await axiosInstance.get(`/photographers/me/payment-info`);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error occurred');
    }
  },

  async updateMyPaymentInfo(paymentInfo: PaymentInfo){
    try {
      const response = await axiosInstance.patch(`/photographers/me/payment-info`, paymentInfo);
      return response.data;
    } catch (error) {
      console.log(error);
      throw new Error('An unexpected error occurred');
    }
  },
};