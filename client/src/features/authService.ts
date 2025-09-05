import axios from 'axios'
import type { LoginResponse, User } from '../app/slices/authSlice.ts'

// =====================
// API URLs
// =====================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const API_URL_LOGIN = `${API_BASE_URL}/auth/login`
const API_URL_REGISTER = `${API_BASE_URL}/auth/register`

// =====================
// Auth Service
// =====================
const authService = {
  // Login: returns User + token
  login: async (credentials: { username: string; password: string }): Promise<LoginResponse> => {
    const response = await axios.post<LoginResponse>(API_URL_LOGIN, credentials)
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data.data.user))
      localStorage.setItem('token', JSON.stringify(response.data.data.token))
    }
    return response.data
  },

  // Register: requires token (Admin/HOD creating a new user)
  register: async (userData: Partial<User>, token: string): Promise<User> => {
    const response = await axios.post<User>(API_URL_REGISTER, userData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    return response.data
  },
}

export default authService
