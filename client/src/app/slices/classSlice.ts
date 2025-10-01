import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import classService from "../../features/classService";

export interface Class {
    _id: string;
    department: string;
    academicYear: string;
    semester: number;
    section: string;
    classAdvisor?: string;
}

interface ClassState {
    classes: Class[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: ClassState = {
    classes: [],
    isLoading: false,
    isError: false,
    message: "",
};

export interface CreateClassResponse {
    success: boolean
    data: {
        class: Class
    }
    message: string
}

export interface FetchAllClassResponse {
    success: boolean
    data: {
        classes: Class[]
    }
    message: string
}

// Fetch all classes
export const fetchClasses = createAsyncThunk<
    FetchAllClassResponse,
    void,
    { state: RootState; rejectValue: string }
>( "class/fetchAll", async (_, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.token;
        return (!token) 
            ? thunkAPI.rejectWithValue('No token found, Please login') 
            : await classService.getClasses(token);
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
    
}); 

// Create class
export const createClass = createAsyncThunk<
    CreateClassResponse, 
    {
        department: string;
        academicYear: string;
        semester: number;
        section: string;
        classAdvisor?: string;
    }, 
    { state: RootState; rejectValue: string }
>( "class/create", async (classData, thunkAPI) => {
    try{
        const token = thunkAPI.getState().auth.token;
        return (!token) 
            ? thunkAPI.rejectWithValue('No token found, Please login') 
            : await classService.createClass(classData, token);
    } catch (error: any) {
        const message =
            (error.response && error.response.data && error.response.data.message) ||
            error.message ||
            error.toString();
        return thunkAPI.rejectWithValue(message);
    }
});

export const classSlice = createSlice({
    name: "class",
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
            .addCase(fetchClasses.pending, (state) => { state.isLoading = true; })
            .addCase(fetchClasses.fulfilled, (state, action) => {
                state.isLoading = false;
                state.classes = action.payload.data.classes;
            })
            .addCase(fetchClasses.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message || "Failed to fetch classes";
            })
            .addCase(createClass.pending, (state) => { state.isLoading = true; })
            .addCase(createClass.fulfilled, (state, action) => {
                state.isLoading = false;
                state.classes.push(action.payload.data.class);
            })
            .addCase(createClass.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.error.message || "Failed to create class";
            });
    },
});

export const { reset } = classSlice.actions;
export default classSlice.reducer;
