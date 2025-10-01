import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import teacherService from "../../features/teacherService";

export interface Teacher {
    _id?: string;
    name: string;
    employeeId: string;
    department: string;
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

export interface CreateTeacherResponse {
    success: boolean
    data: {
        teacher: Teacher
    }
    message: string
}

export interface FetchAllTeacherResponse {
    success: boolean
    data: {
        teachers: Teacher[]
    }
    message: string
}

// Fetch all teachers
export const fetchTeachers = createAsyncThunk<
    FetchAllTeacherResponse,
    void,
    { state: RootState; rejectValue: string }
    >("teacher/fetchAll", async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
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
    CreateTeacherResponse,
    Teacher,
    { state: RootState; rejectValue: string }
    >("teacher/create", async (teacherData, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
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
        .addCase(fetchTeachers.fulfilled, (state, action: PayloadAction<FetchAllTeacherResponse>) => {
            state.isLoading = false;
            state.teachers = action.payload.data.teachers;
        })
        .addCase(fetchTeachers.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string || "Failed to fetch teachers";
        })
        .addCase(createTeacher.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createTeacher.fulfilled, (state, action: PayloadAction<CreateTeacherResponse>) => {
            state.isLoading = false;
            state.teachers.push(action.payload.data.teacher);
        })
        .addCase(createTeacher.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string || "Failed to create teacher";
        });
    },
});

export const { reset } = teacherSlice.actions;
export default teacherSlice.reducer;
