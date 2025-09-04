import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import teacherService from "../../features/teacherService";

export interface Teacher {
    _id?: string;
    name: string;
    employeeId: string;
    department: string; // Department ObjectId
    contactDetails: { email: string; phone: string };
    dateOfJoining: string;
}

interface TeacherState {
    teachers: Teacher[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: TeacherState = {
    teachers: [],
    isLoading: false,
    isError: false,
    message: "",
};

// Fetch all teachers
export const fetchTeachers = createAsyncThunk<
    Teacher[],
    void,
    { state: RootState; rejectValue: string }
    >("teachers/fetchAll", async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.user ? state.auth.user.token : null;
        return (!token) 
            ? thunkAPI.rejectWithValue("No token found, Please login") 
            : await teacherService.getTeachers(token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create teacher
export const createTeacher = createAsyncThunk<
    Teacher,
    Teacher,
    { state: RootState; rejectValue: string }
    >("teacher/create", async (teacherData, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.user ? state.auth.user.token : null;
        return (!token) 
            ? thunkAPI.rejectWithValue("No token found, Please login") 
            : await teacherService.createTeacher(teacherData, token);
    } catch (error: any) {
        const message = error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const teacherSlice = createSlice({
    name: "teacher",
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
        .addCase(fetchTeachers.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchTeachers.fulfilled, (state, action: PayloadAction<Teacher[]>) => {
            state.isLoading = false;
            state.teachers = action.payload;
        })
        .addCase(fetchTeachers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch teachers";
        })
        .addCase(createTeacher.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createTeacher.fulfilled, (state, action: PayloadAction<Teacher>) => {
            state.isLoading = false;
            state.teachers.push(action.payload);
        })
        .addCase(createTeacher.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to create teacher";
        });
    },
});

export const { reset } = teacherSlice.actions;
export default teacherSlice.reducer;
