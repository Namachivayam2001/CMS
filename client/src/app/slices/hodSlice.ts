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

// Fetch all HODs
export const fetchHODs = createAsyncThunk<
    HOD[],
    void,
    { state: RootState; rejectValue: string }
    >("hods/fetchAll", async (_, thunkAPI) => {
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
    HOD,
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
        .addCase(fetchHODs.fulfilled, (state, action: PayloadAction<HOD[]>) => {
            state.isLoading = false;
            state.hods = action.payload;
        })
        .addCase(fetchHODs.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch HODs";
        })
        .addCase(createHOD.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createHOD.fulfilled, (state, action: PayloadAction<HOD>) => {
            state.isLoading = false;
            state.hods.push(action.payload);
        })
        .addCase(createHOD.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to create HOD";
        });
    },
});

export const { reset } = hodSlice.actions;
export default hodSlice.reducer;
