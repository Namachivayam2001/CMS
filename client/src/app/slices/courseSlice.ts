import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import courseService from '../../features/courseService';
import type { RootState } from '../store';
 
export interface Course {
    _id: string;
    name: string;
    code: string;
    credits: number;
    class: string;
    teacher: string;
}

interface CourseState {
    courses: Course[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: CourseState = {
    courses: [],
    isLoading: false,
    isError: false,
    message: '',
};

export interface CreateCourseResponse {
    success: boolean;
    data: { course: Course };
    message: string;
}

export interface FetchAllCourseResponse {
    success: boolean;
    data: { courses: Course[] };
    message: string;
}

// Fetch all courses
export const fetchCourses = createAsyncThunk<
    FetchAllCourseResponse,
    void,
    { state: RootState; rejectValue: string }
>('course/fetchAll', async (_, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
        return !token
            ? thunkAPI.rejectWithValue('No token found, Please login')
            : await courseService.getCourses(token);
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

// Create course
export const createCourse = createAsyncThunk<
    CreateCourseResponse,
    {
        name: string;
        code: string;
        class: string;
        teacher: string;
        credits: number;
    },
    { state: RootState; rejectValue: string }
>('course/create', async (courseData, thunkAPI) => {
    try {
        const state = thunkAPI.getState();
        const token = state.auth.token;
        return !token
            ? thunkAPI.rejectWithValue('No token found, Please login')
            : await courseService.createCourse(courseData, token);
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const courseSlice = createSlice({
    name: 'course',
    initialState,
    reducers: {
        reset: (state) => {
            state.isLoading = false;
            state.isError = false;
            state.message = '';
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchCourses.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<FetchAllCourseResponse>) => {
                state.isLoading = false;
                state.courses = action.payload.data.courses;
            }
        )
        .addCase(fetchCourses.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string || 'Failed to fetch courses';
        })
        .addCase(createCourse.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createCourse.fulfilled, (state, action: PayloadAction<CreateCourseResponse>) => {
            state.isLoading = false;
            state.courses.push(action.payload.data.course);
        })
        .addCase(createCourse.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload as string || 'Failed to create course';
        });
    },
});

export const { reset } = courseSlice.actions;
export default courseSlice.reducer;
