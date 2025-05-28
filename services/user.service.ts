import axiosInstance from './axios';
import { isAxiosError } from 'axios';

export interface UserProfile {
  user_id: number;
  full_name: string;
  email: string;
  phone_number: string;
  avatar: string;
  background_image: string | null;
  is_active: boolean;
  slug: string;
  role: 'customer' | 'photographer' | 'admin';
  photographer_id: number | null;
  bio: string | null;
  province: string | null;
  district: string | null;
  ward: string | null;
  address_detail: string | null;
  tags: string[] | null;
  price_per_hour: number | null;
  experience_years: number | null;
  followers_count: number;
  average_rating: number;
  total_reviews: number;
  total_bookings: number;
  social_media_links?: { [key: string]: string };
}

export interface UpdateProfileData {
  full_name?: string;
  phone_number?: string;
  avatar?: string;
  background_image?: string | null;
  bio?: string | null;
  province?: string | null;
  district?: string | null;
  ward?: string | null;
  address_detail?: string | null;
  tags?: string[] | null;
  price_per_hour?: number | null;
  experience_years?: number | null;
}

export interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export interface UserProfileResponse {
  user_id: number;
  email: string;
  full_name: string;
  phone_number: string;
  role: 'customer' | 'photographer' | 'admin';
  created_at: string;
  slug: string;
  avatar: string;
  background_image: string | null;
  is_active: boolean;
  province: string | null;
  district: string | null;
  ward: string | null;
  address_detail: string | null;
}  

export interface MissingInfoResponse {
  has_missing_info: boolean;
  missing_fields: string[];
  message: string;
}

export const userService = {
  async getProfile(): Promise<UserProfile> {
    try {
      const response = await axiosInstance.get<UserProfile>('/profile');
      return response.data;
    } catch (error) {
      console.error('Error in getProfile:', error);
      if (isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          data: error.response?.data,
          headers: error.response?.headers
        });
        if (error.response?.status === 401) {
          throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
        }
        throw new Error(error.response?.data?.message || 'Không thể tải thông tin hồ sơ');
      }
      throw new Error('Đã xảy ra lỗi không xác định');
    }
  },

  async updateProfile(data: UpdateProfileData, role: 'customer' | 'photographer'): Promise<UserProfile> {
    try {
      console.log(data);
      const endpoint = role === 'customer' ? 'customers/profile' : 'photographers/profile';
      const response = await axiosInstance.put<UserProfile>(`/${endpoint}`, data);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to update profile');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  async changePassword(data: ChangePasswordData): Promise<void> {
    try {
      await axiosInstance.put('/change-password', data);
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to change password');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  async getUserById(userId: number): Promise<UserProfileResponse> {
    try {
      const response = await axiosInstance.get<UserProfileResponse>(`/users/${userId}`);
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to fetch user profile');
      }
      throw new Error('An unexpected error occurred');
    }
  },

  async checkMissingInfo(): Promise<MissingInfoResponse> {
    try {
      const response = await axiosInstance.get<MissingInfoResponse>('/users/me/missing-info');
      return response.data;
    } catch (error) {
      if (isAxiosError(error)) {
        throw new Error(error.response?.data?.message || 'Failed to check missing info');
      }
      throw new Error('An unexpected error occurred');
    }
  }
}; 