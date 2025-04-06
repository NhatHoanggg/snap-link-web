import axios from 'axios';

const API_BASE_URL = 'http://127.0.0.1:8001';

interface LoginCredentials {
  email: string;
  password: string;
}

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

interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  user: User;
}

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  try {
    const response = await axios.post<LoginResponse>(`${API_BASE_URL}/login`, credentials);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login failed');
    }
    throw new Error('An unexpected error occurred');
  }
}; 