import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import periodService from "../../features/periodService";
import type { RootState } from "../store";
import type { FetchPeriodResponse, CreateOrUpdatePeriodResponse } from "../../features/periodService";

export interface Period {
    _id?: string;
    name: string;
    startTime: string;
    endTime: string;
}

interface PeriodState {
    periods: Period[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: PeriodState = {
    periods: [],
    isLoading: false,
    isError: false,
    message: "",
};

// Fetch all
export const fetchPeriods = createAsyncThunk<
    FetchPeriodResponse,
    void,
    { state: RootState; rejectValue: string }
>("period/fetchAll", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        if (!token) return thunkAPI.rejectWithValue("No token found, please login");
        return await periodService.getPeriods(token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Create
export const createPeriod = createAsyncThunk<
    CreateOrUpdatePeriodResponse,
    Period,
    { state: RootState; rejectValue: string }
>("period/create", async (periodData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        if (!token) return thunkAPI.rejectWithValue("No token found, please login");
        return await periodService.createPeriod(periodData, token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

// Update
export const updatePeriod = createAsyncThunk<
    CreateOrUpdatePeriodResponse,
    { id: string; data: Period },
    { state: RootState; rejectValue: string }
>("period/update", async ({ id, data }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        if (!token) return thunkAPI.rejectWithValue("No token found, please login");
        return await periodService.updatePeriod(id, data, token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message;
        return thunkAPI.rejectWithValue(message);
    }
});

export const periodSlice = createSlice({
    name: "period",
    initialState,
    reducers: {
        reset: (state) => {
            state.isError = false;
            state.isLoading = false;
            state.message = "";
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchPeriods.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchPeriods.fulfilled, (state, action: PayloadAction<FetchPeriodResponse>) => {
            state.isLoading = false;
            state.periods = action.payload.data.periods;
        })
        .addCase(fetchPeriods.rejected, (state, action) => {
            console.log("Action: ",action)
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch periods";
        })
        .addCase(createPeriod.fulfilled, (state, action: PayloadAction<CreateOrUpdatePeriodResponse>) => {
            if (action.payload?.data?.period) {
        state.periods.push(action.payload.data.period);
    }
        })
        .addCase(updatePeriod.fulfilled, (state, action: PayloadAction<CreateOrUpdatePeriodResponse>) => {
            const index = state.periods.findIndex(p => p._id === action.payload.data.period._id);
            if (index !== -1) state.periods[index] = action.payload.data.period;
        });
    },
});

export const { reset } = periodSlice.actions;
export default periodSlice.reducer;
