import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001";

export interface UserProfile {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  avatar: string;
  background: string | null;
  is_active: boolean;
  slug: string;
  role: 'customer' | 'photographer' | 'admin';
  photographer_id: number | null;
  bio: string | null;
  location: string | null;
  price_per_hour: number | null;
  followers_count: number;
  average_rating: number;
  total_reviews: number;
  total_bookings: number;
}

export interface UpdateProfileData {
  full_name?: string;
  phone_number?: string;
  avatar?: string;
  background?: string | null;
  bio?: string | null;
  location?: string | null;
  price_per_hour?: number | null;
}

export const userService = {
  async getProfile(token: string): Promise<UserProfile> {
    try {
      const response = await axios.get<UserProfile>(`${API_URL}/profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch profile');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  async updateProfile(data: UpdateProfileData, token: string): Promise<UserProfile> {
    try {
      const response = await axios.patch<UserProfile>(`${API_URL}/profile`, data, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
      }
      throw new Error('An unexpected error occurred');
    }
  },
}; 