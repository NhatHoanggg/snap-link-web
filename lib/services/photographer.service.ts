import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface FeaturedPhoto {
  featured_photo_id: number;
  image_url: string;
  title: string;
  description: string;
}

export interface SocialMediaLinks {
  facebook?: string;
  instagram?: string;
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
}

export interface Photographer {
  user_id: number;
  photographer_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  avatar: string;
  background_image: string;
  bio: string;
  location: string | null;
  price_per_hour: number;
  experience_years: number;
  followers_count: number;
  average_rating: number;
  total_reviews: number;
  total_bookings: number;
  is_active: boolean;
  slug: string;
  portfolio: Portfolio | null;
}


export interface PhotographersResponse {
  total: number;
  photographers: Photographer[];
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

export const photographerService = {
  async getPhotographers(filters: PhotographerFilters = {}): Promise<PhotographersResponse> {
    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined) {
          params.append(key, value.toString());
        }
      });

      const response = await axios.get<PhotographersResponse>(
        `${API_URL}/photographers?${params.toString()}`
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch photographers');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  async getPhotographerBySlug(slug: string): Promise<Photographer> {
    try {
      const response = await axios.get<Photographer>(`${API_URL}/photographers/${slug}`);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch photographer');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  async updatePhotographerProfile(
    photographerId: number,
    data: Partial<Photographer>,
    token: string
  ): Promise<Photographer> {
    try {
      const response = await axios.patch<Photographer>(
        `${API_URL}/photographers/${photographerId}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
      }
      throw new Error('An unexpected error occurred');
    }
  },
}; 