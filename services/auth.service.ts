import axiosInstance from './axios';
import { isAxiosError } from 'axios';

// const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

// interface LoginCredentials {
//   email: string;
//   password: string;
// }

interface User {
  email: string;
  full_name: string;
  phone_number: string;
  user_id: number;
  role: string;
  created_at: string;
  slug: string;
  avatar: string;
  is_active: boolean;
}

export interface LoginResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
  user: {
    user_id: number;
    email: string;
    full_name: string;
    role: string;
    avatar?: string;
  };
}

interface RefreshTokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
  expires_in: number;
}

interface CustomerRegisterData {
  email: string;
  full_name: string;
  password: string;
  confirm_password: string;
  phone_number: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
}

interface PhotographerRegisterData {
  email: string;
  full_name: string;
  phone_number: string;
  password: string;
  confirm_password: string;
  province: string;
  district: string;
  ward: string;
  address_detail: string;
  tags: string[];
  price_per_hour: number;
  experience_years: number;
}

interface RegisterResponse {
  message: string;
  user: User;
}

export interface ResetPasswordForm{
  email: string;
  otp: string;
  new_password: string;
  confirm_password: string;
}

export async function login(credentials: { email: string; password: string }): Promise<LoginResponse> {
  // console.log("credentials", credentials);
  
  const response = await axiosInstance.post<LoginResponse>('/login', credentials);
  return response.data;
}

export async function loginWithGoogle(idToken: string, role: string | null): Promise<LoginResponse> {
  console.log("idToken -->", idToken);
  const response = await axiosInstance.post<LoginResponse>('/auth/google', { google_token: idToken, role: role });
  return response.data;
}

export async function refreshToken(refresh_token: string): Promise<RefreshTokenResponse> {
  const response = await axiosInstance.post<RefreshTokenResponse>('/refresh-token', { refresh_token });
  return response.data;
}

export async function logout(token: string): Promise<void> {
  await axiosInstance.post('/logout', null, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export const registerCustomer = async (data: CustomerRegisterData): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(`/register/customer`, data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const registerPhotographer = async (data: PhotographerRegisterData): Promise<RegisterResponse> => {
  try {
    console.log("data -->", data);
    const response = await axiosInstance.post<RegisterResponse>(`/register/photographer`, data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('An unexpected error occurred');
  }
}; 

export async function verifyEmail(email: string, otp: string): Promise<void> {
  try {
    await axiosInstance.post('/verify-email', { email, otp });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to verify email');
    }
    throw new Error('An unexpected error occurred');
  }
}

export async function forgotPassword(email: string): Promise<void> {
  try {
    await axiosInstance.post('/forgot-password', {email});
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to forgot password');
    }
    throw new Error('An unexpected error occurred');
  }
}

export async function verifyResetOTP(email: string, otp: string): Promise<void> {
  try {
    await axiosInstance.post('/verify-reset-otp',  { email, otp });
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
    throw new Error('An unexpected error occurred');
  }
}

export async function resetPassword(formData: ResetPasswordForm): Promise<void> {
  try {
    await axiosInstance.post('/reset-password',  formData);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to verify OTP');
    }
    throw new Error('An unexpected error occurred');
  }
}


export const registerCustomerWithGoogle = async (data: CustomerRegisterData): Promise<RegisterResponse> => {
  try {
    const response = await axiosInstance.post<RegisterResponse>(`/v1/register/customer`, data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const registerPhotographerWithGoogle = async (data: PhotographerRegisterData): Promise<RegisterResponse> => {
  try {
    console.log("data -->", data);
    const response = await axiosInstance.post<RegisterResponse>(`/v1/register/photographer`, data);
    return response.data;
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('An unexpected error occurred');
  }
}; 