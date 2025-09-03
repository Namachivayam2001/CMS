import {createSlice, createAsyncThunk} from '@reduxjs/toolkit'

const user = JSON.parse(localStorage.getItem('user')) || null

const initialState = {
    user: user,
    isSuccess: false,
    isError: false,
    isLoading: false,
    message: '',
}

export const authSlice = createSlice({
    name: 'auth',
    initialState: initialState,
    reducers: {
        reset: (state) => {
            state.isSuccess = false;
            state.isError = false;
            state.isLoading = false;
            state.message = '';
        },
    },
    extraReducers: () => {},
})

export const {reset} = authSlice.actions
export default authSlice.reducer