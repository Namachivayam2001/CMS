import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import authService from '../../features/authService'
import type { RootState } from '../store'

// =====================
// Types
// =====================
export interface User {
    _id: string
    username: string
    role: 'Admin' | 'HOD' | 'Teacher' | 'Student'
    refId: string // MongoDB ObjectId as string
    lastLogin: string // ISO date string
    token?: string // returned after login/registration
}

export interface LoginResponse {
    success: boolean
    data: { 
        user: User 
        token: string 
    }
    message: string
}

interface AuthState {
    user: User | null
    isError: boolean
    isLoading: boolean
    isAuthenticated: boolean
    message: string
}

// =====================
// Initial State
// =====================
const user: User | null = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null

const initialState: AuthState = {
    user,
    isError: false,
    isLoading: false,
    isAuthenticated: !!user,
    message: '',
}

// =====================
// Async Thunks
// =====================
export const register = createAsyncThunk<
    User,                    // return type (backend should return the full user object + token)
    Partial<User>,           // input type (new user data)
    { state: RootState; rejectValue: string }
  >(
    'auth/register',
    async (userData, thunkAPI) => {
        try {
            const state = thunkAPI.getState()
            const token = state.auth.user ? state.auth.user.token : null
            return (!token) 
                ? thunkAPI.rejectWithValue('No token found, Please login') 
                : await authService.register(userData, token)
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString()
            return thunkAPI.rejectWithValue(message)
        }
    }
)

export const login = createAsyncThunk<
    LoginResponse, // Return type
    { username: string; password: string }, // Input credentials
    { rejectValue: string }
    >('auth/login', async (credentials, thunkAPI) => {
    try {
        const response = await authService.login(credentials);
        return response;
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString()
        return thunkAPI.rejectWithValue(message)
    }
})

// =====================
// Slice
// =====================
export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false
            state.isLoading = false
            state.isAuthenticated = false
            state.message = ''
        },
        logout: (state) => {
            state.user = null
            localStorage.removeItem('user')
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(register.pending, (state) => {
            state.isLoading = true
        })
        .addCase(register.fulfilled, (state, action: PayloadAction<User>) => {
            state.isLoading = false
            state.user = action.payload
            state.message = 'User registered successfully'
        })
        .addCase(register.rejected, (state, action) => {
            state.isError = true
            state.isLoading = false
            state.message = action.payload as string
        })
        .addCase(login.pending, (state) => {
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
            state.isLoading = false
            state.isAuthenticated = action.payload.success
            state.user = action.payload.data.user
            state.isError = false
            state.message = 'Login successful'
        })
        .addCase(login.rejected, (state, action) => {
            state.isLoading = false
            state.isError = true
            state.message = action.payload || 'Login failed'
        })
    },
})

export const { reset, logout } = authSlice.actions
export default authSlice.reducer
