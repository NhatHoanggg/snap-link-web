import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8001"

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

interface CustomerRegisterData {
  email: string;
  full_name: string;
  password: string;
  confirm_password: string;
  phone_number: string;
}

interface PhotographerRegisterData {
  email: string;
  full_name: string;
  phone_number: string;
  password: string;
  bio: string;
  location: string;
  price_per_hour: number;
  confirm_password: string;
}

interface RegisterResponse {
  message: string;
  user: User;
}

export async function login(credentials: { email: string; password: string }): Promise<LoginResponse> {
  const response = await fetch(`${API_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.detail || "Login failed")
  }

  return response.json()
}

export async function logout(token: string): Promise<void> {
  const response = await fetch(`${API_URL}/logout`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  if (!response.ok) {
    throw new Error("Logout failed")
  }
}

export const registerCustomer = async (data: CustomerRegisterData): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register/customer`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const registerPhotographer = async (data: PhotographerRegisterData): Promise<RegisterResponse> => {
  try {
    const response = await axios.post<RegisterResponse>(`${API_URL}/register/photographer`, data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
    throw new Error('An unexpected error occurred');
  }
}; 