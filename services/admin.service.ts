interface User {
  email: string
  full_name: string
  phone_number: string
  location: string | null
  user_id: number
  role: string
  created_at: string
  slug: string
  avatar: string
  background_image: string
  is_active: boolean
}

interface UsersResponse {
  total: number
  users: User[]
}

const API_URL = 'http://127.0.0.1:8001'

// Hàm helper để lấy token từ localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('token')
  }
  return null
}

// Hàm helper để tạo headers với token
const getHeaders = () => {
  const token = getAuthToken()
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` }),
  }
}

export const AdminService = {
  // Lấy danh sách người dùng
  async getUsers(params: {
    page: number
    limit: number
    role?: string
    status?: string
    search?: string
  }): Promise<UsersResponse> {
    try {
      const queryParams = new URLSearchParams({
        page: params.page.toString(),
        limit: params.limit.toString(),
        ...(params.role && { role: params.role }),
        ...(params.status && { status: params.status }),
        ...(params.search && { search: params.search }),
      })

      const response = await fetch(`${API_URL}/admin/users?${queryParams}`, {
        headers: getHeaders(),
      })
      if (!response.ok) {
        throw new Error('Failed to fetch users')
      }
      return await response.json()
    } catch (error) {
      console.error('Error fetching users:', error)
      throw error
    }
  },

  // Xóa người dùng
  async deleteUser(userId: number): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getHeaders(),
      })
      if (!response.ok) {
        throw new Error('Failed to delete user')
      }
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  },

  // Xóa nhiều người dùng
  async deleteUsers(userIds: number[]): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/admin/users/bulk-delete`, {
        method: 'DELETE',
        headers: getHeaders(),
        body: JSON.stringify({ user_ids: userIds }),
      })
      if (!response.ok) {
        throw new Error('Failed to delete users')
      }
    } catch (error) {
      console.error('Error deleting users:', error)
      throw error
    }
  },

  // Cập nhật trạng thái người dùng
  async updateUserStatus(userId: number, isActive: boolean): Promise<void> {
    try {
      const response = await fetch(`${API_URL}/admin/users/${userId}/status`, {
        method: 'PATCH',
        headers: getHeaders(),
        body: JSON.stringify({ is_active: isActive }),
      })
      if (!response.ok) {
        throw new Error('Failed to update user status')
      }
    } catch (error) {
      console.error('Error updating user status:', error)
      throw error
    }
  },

  // Xuất dữ liệu người dùng
  async exportUsers(): Promise<Blob> {
    try {
      const response = await fetch(`${API_URL}/admin/users/export`, {
        headers: getHeaders(),
      })
      if (!response.ok) {
        throw new Error('Failed to export users')
      }
      return await response.blob()
    } catch (error) {
      console.error('Error exporting users:', error)
      throw error
    }
  }
} 