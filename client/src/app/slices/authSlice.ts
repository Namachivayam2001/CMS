import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import type { PayloadAction } from '@reduxjs/toolkit'
import authService from '../../features/authService'
import type {User} from './userSlice'

export interface LoginResponse {
    success: boolean
    data: { 
        user: User 
        token: string 
    }
    message: string
}

interface AuthState {
    currentUser: User | null
    token: string | null
    isError: boolean
    isLoading: boolean
    isAuthenticated: boolean
    message: string
}

// =====================
// Initial State
// =====================
const currentUser: User | null = localStorage.getItem('user')
    ? JSON.parse(localStorage.getItem('user') as string)
    : null

const token: string | null = localStorage.getItem('token')
    ? JSON.parse(localStorage.getItem('token') as string)
    : null

const initialState: AuthState = {
    currentUser,
    token,
    isError: false,
    isLoading: false,
    isAuthenticated: !!currentUser,
    message: '',
}


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
            state.currentUser = null
            localStorage.removeItem('user')
            localStorage.removeItem('token')
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(login.pending, (state) => {
            state.isLoading = true
        })
        .addCase(login.fulfilled, (state, action: PayloadAction<LoginResponse>) => {
            state.isLoading = false
            state.isAuthenticated = action.payload.success
            state.currentUser = action.payload.data.user
            state.token = action.payload.data.token
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
