import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import studentService from "../../features/studentService";

export interface Student {
    _id?: string;
    name: string;
    rollNumber: string;
    class: string;
    contactDetails: { email: string; phone: string };
    dateOfJoining: string;
}

interface StudentState {
    students: Student[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: StudentState = {
    students: [],
    isLoading: false,
    isError: false,
    message: "",
};

export interface CreateStudentResponse {
    success: boolean
    data: {
        student: Student
    }
    message: string
}

export interface FetchAllStudentResponse {
    success: boolean
    data: {
        students: Student[]
    }
    message: string
}

// Fetch all students
export const fetchStudents = createAsyncThunk<
    FetchAllStudentResponse,
    void,
    { state: RootState; rejectValue: string }
    >("student/fetchAll", async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
        return (!token) 
            ? thunkAPI.rejectWithValue("No token found, Please login") 
            : await studentService.getStudents(token);
    } catch (error: any) {
        const message =
        error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create a student
export const createStudent = createAsyncThunk<
    CreateStudentResponse,
    Student,
    { state: RootState; rejectValue: string }
    >("student/create", async (studentData, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
        return (!token) 
            ? thunkAPI.rejectWithValue("No token found, Please login") 
            : await studentService.createStudent(studentData, token);
    } catch (error: any) {
        const message =
        error.response?.data?.message || error.message || error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const studentSlice = createSlice({
    name: "student",
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
        .addCase(fetchStudents.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchStudents.fulfilled, (state, action: PayloadAction<FetchAllStudentResponse>) => {
            state.isLoading = false;
            state.students = action.payload.data.students;
        })
        .addCase(fetchStudents.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || "Failed to fetch students";
        })
        .addCase(createStudent.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createStudent.fulfilled, (state, action: PayloadAction<CreateStudentResponse>) => {
            state.isLoading = false;
            state.students.push(action.payload.data.student);
        })
        .addCase(createStudent.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = (action.payload as string) || "Failed to create student";
        });
    },
});

export const { reset } = studentSlice.actions;
export default studentSlice.reducer;
