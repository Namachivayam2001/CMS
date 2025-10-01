import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import userService from "../../features/userService";

export interface User {
    _id: string;
    name: string;
    username: string;
    role: "Admin" | "HOD" | "Teacher" | "Student";
    refId: string;
    lastLogin: string;
}

interface UserState {
    users: User[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: UserState = {
    users: [],
    isLoading: false,
    isError: false,
    message: "",
};

export interface FetchAllUserResponse {
    success: boolean
    data: {
        users: User[]
    }
    message: string
}

// Fetch all users
export const fetchUsers = createAsyncThunk<
    FetchAllUserResponse,
    void,
    { state: RootState; rejectValue: string }
>("user/fetchAll", async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
        return !token
            ? thunkAPI.rejectWithValue("No token found, Please login")
            : await userService.getUsers(token);
    } catch (error: any) {
        const message =
        error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create a new user
// export const createUser = createAsyncThunk<
//     User,
//     User,
//     { state: RootState; rejectValue: string }
// >("user/create", async (userData, thunkAPI) => {
//     try {
//         const state = thunkAPI.getState();
//         const token = state.auth.token;
//         return !token
//             ? thunkAPI.rejectWithValue("No token found, Please login")
//             : await userService.createUser(userData, token);
//     } catch (error: any) {
//         const message = error.response?.data?.message || error.message || error.toString();
//         return thunkAPI.rejectWithValue(message);
//     }
// });

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
        // Fetch Users
        .addCase(fetchUsers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(
            fetchUsers.fulfilled,
            (state, action: PayloadAction<FetchAllUserResponse>) => {
                state.isLoading = false;
                state.users = action.payload.data.users;
            }
        )
        .addCase(fetchUsers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch users";
        })
        // Create User
    //     .addCase(createUser.pending, (state) => {
    //         state.isLoading = true;
    //     })
    //     .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
    //         state.isLoading = false;
    //         state.users.push(action.payload);
    //     })
    //     .addCase(createUser.rejected, (state, action) => {
    //         state.isLoading = false;
    //         state.isError = true;
    //         state.message = action.payload || "Failed to create user";
    //     });
    },
});

export const { reset } = userSlice.actions;
export default userSlice.reducer;
