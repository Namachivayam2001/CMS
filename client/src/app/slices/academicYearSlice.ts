import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import academicYearService from "../../features/academicYearService";

export interface AcademicYear {
    _id?: string;
    year: string; // e.g., "2024-2025"
    isActive: boolean;
}

interface AcademicYearState {
    academicYears: AcademicYear[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: AcademicYearState = {
    academicYears: [],
    isLoading: false,
    isError: false,
    message: "",
};

export interface CreateAcademicYearResponse {
    success: boolean;
    data: { academicYear: AcademicYear };
    message: string;
}
export interface FetchAllAcademicYearResponse {
    success: boolean;
    data: { years: AcademicYear[] };
    message: string;
}
export interface UpdateAcademicYearResponse {
    success: boolean;
    message: string;
}
export interface DeleteAcademicYearResponse {
    success: boolean;
    message: string;
}

// Fetch all years
export const fetchAcademicYears = createAsyncThunk<
    FetchAllAcademicYearResponse,
    void,
    { state: RootState; rejectValue: string }
>("academicYear/fetchAll", async (_, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        return !token
            ? thunkAPI.rejectWithValue("No token found, Please login")
            : await academicYearService.getAcademicYears(token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create
export const createAcademicYear = createAsyncThunk<
    CreateAcademicYearResponse,
    AcademicYear,
    { state: RootState; rejectValue: string }
>("academicYear/create", async (yearData, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        return !token
            ? thunkAPI.rejectWithValue("No token found, Please login")
            : await academicYearService.createAcademicYear(yearData, token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Update
export const updateAcademicYear = createAsyncThunk<
    UpdateAcademicYearResponse,
    { id: string; yearData: Partial<AcademicYear> },
    { state: RootState; rejectValue: string }
>("academicYear/update", async ({ id, yearData }, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        return !token
            ? thunkAPI.rejectWithValue("No token found, Please login")
            : await academicYearService.updateAcademicYear(id, yearData, token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Delete
export const deleteAcademicYear = createAsyncThunk<
    DeleteAcademicYearResponse,
    string,
    { state: RootState; rejectValue: string }
>("academicYear/delete", async (id, thunkAPI) => {
    try {
        const token = thunkAPI.getState().auth.token;
        return !token
            ? thunkAPI.rejectWithValue("No token found, Please login")
            : await academicYearService.deleteAcademicYear(id, token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const academicYearSlice = createSlice({
    name: "academicYear",
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
        .addCase(fetchAcademicYears.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(
            fetchAcademicYears.fulfilled,
            (state, action: PayloadAction<FetchAllAcademicYearResponse>) => {
                state.isLoading = false;
                state.academicYears = action.payload.data.years;
            }
        )
        .addCase(fetchAcademicYears.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch academic years";
        })
        .addCase(createAcademicYear.fulfilled, (state, action) => {
            state.academicYears.unshift(action.payload.data.academicYear);
        })
        .addCase(updateAcademicYear.fulfilled, (state, action) => {
            state.message = action.payload.message;
        })
        .addCase(deleteAcademicYear.fulfilled, (state, action) => {
            state.message = action.payload.message;
        });
    },
});

export const { reset } = academicYearSlice.actions;
export default academicYearSlice.reducer;
