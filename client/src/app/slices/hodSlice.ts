import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import hodService from "../../features/hodService";

export interface HOD {
    _id?: string;
    name: string;
    employeeId: string;
    department: string; // Department ObjectId, unique
    contactDetails: { email: string; phone: string };
    dateOfJoining: string;
}

interface HODState {
    hods: HOD[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: HODState = {
    hods: [],
    isLoading: false,
    isError: false,
    message: "",
};

export interface CreateHODResponse {
    success: boolean
    data: {
        hod: HOD
    }
    message: string
}

export interface FetchAllHODResponse {
    success: boolean
    data: {
        hods: HOD[]
    }
    message: string
}

// Fetch all HODs
export const fetchHODs = createAsyncThunk<
    FetchAllHODResponse,
    void,
    { state: RootState; rejectValue: string }
    >("hod/fetchAll", async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
        return !token
            ? thunkAPI.rejectWithValue("No token found, Please login")
            : await hodService.getHODs(token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create HOD
export const createHOD = createAsyncThunk<
    CreateHODResponse,
    HOD,
    { state: RootState; rejectValue: string }
    >("hods/create", async (hodData, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
        return !token
            ? thunkAPI.rejectWithValue("No token found, Please login")
            : await hodService.createHOD(hodData, token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const hodSlice = createSlice({
    name: "hod",
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
        .addCase(fetchHODs.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchHODs.fulfilled, (state, action: PayloadAction<FetchAllHODResponse>) => {
            state.isLoading = false;
            state.hods = action.payload.data.hods;
        })
        .addCase(fetchHODs.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string || "Failed to fetch HODs";
        })
        .addCase(createHOD.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createHOD.fulfilled, (state, action: PayloadAction<CreateHODResponse>) => {
            state.isLoading = false;
            state.hods.push(action.payload.data.hod);
        })
        .addCase(createHOD.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string || "Failed to create HOD";
        });
    },
});

export const { reset } = hodSlice.actions;
export default hodSlice.reducer;
