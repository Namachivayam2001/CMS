import axios from 'axios'
import type { LoginResponse} from '../app/slices/authSlice.ts'

// =====================
// API URLs
// =====================
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const API_URL_LOGIN = `${API_BASE_URL}/auth/login`

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
}

export default authService
