import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import timetableService from "../../features/timetableService";
import type { FetchTimetableResponse, CreateTimetableResponse } from "../../features/timetableService";

export interface Timetable {
    _id?: string;
    class: string;
    day: "Monday" | "Tuesday" | "Wednesday" | "Thursday" | "Friday" | "Saturday";
    period: string;
    course: string;
}

interface TimetableState {
    timetables: Timetable[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: TimetableState = {
    timetables: [],
    isLoading: false,
    isError: false,
    message: "",
};

// Fetch all timetables
export const fetchTimetables = createAsyncThunk<
    FetchTimetableResponse,
    void,
    { state: RootState; rejectValue: string }
    >("timetable/fetchAll", async (_, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            if (!token) return thunkAPI.rejectWithValue("No token found, please login");
            return await timetableService.getTimetables(token);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
});

// Create timetable
export const createTimetable = createAsyncThunk<
    CreateTimetableResponse,
    Timetable,
    { state: RootState; rejectValue: string }
    >("timetable/create", async (timetableData, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            if (!token) return thunkAPI.rejectWithValue("No token found, please login");
            return await timetableService.createTimetable(timetableData, token);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
});

// Fetch timetable by class
export const fetchTimetablesByClass = createAsyncThunk<
    FetchTimetableResponse,
    string,
    { state: RootState; rejectValue: string }
    >("timetable/fetchByClass", async (classId, thunkAPI) => {
        try {
            const token = thunkAPI.getState().auth.token;
            if (!token) return thunkAPI.rejectWithValue("No token found, please login");
            return await timetableService.getTimetablesByClass(classId, token);
        } catch (error: any) {
            const message = error.response?.data?.message || error.message || error.toString();
            return thunkAPI.rejectWithValue(message);
        }
});

export const timetableSlice = createSlice({
    name: "timetable",
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
        // Fetch all
        .addCase(fetchTimetables.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.message = "";
        })
        .addCase(fetchTimetables.fulfilled, (state, action: PayloadAction<FetchTimetableResponse>) => {
            state.isLoading = false;
            state.timetables = action.payload.data.timetables;
        })
        .addCase(fetchTimetables.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch timetables";
        })

        // Create timetable
        .addCase(createTimetable.pending, (state) => {
            state.isLoading = true;
            state.isError = false;
            state.message = "";
        })
        .addCase(createTimetable.fulfilled, (state, action: PayloadAction<CreateTimetableResponse>) => {
            state.isLoading = false;
            state.timetables.push(action.payload.data.timetable);
        })
        .addCase(createTimetable.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to create timetable";
        })

        // Fetch by class
        .addCase(fetchTimetablesByClass.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchTimetablesByClass.fulfilled, (state, action: PayloadAction<FetchTimetableResponse>) => {
            state.isLoading = false;
            state.timetables = action.payload.data.timetables;
        })
        .addCase(fetchTimetablesByClass.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch class timetables";
        });
    },
});

export const { reset } = timetableSlice.actions;
export default timetableSlice.reducer;
