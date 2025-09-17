import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import departmentService from '../../features/departmentService.ts';
import type { RootState } from '../store.ts'; 

export interface Department {
    _id: string;
    name: string;
    code: string;
}

interface DepartmentState {
    departments: Department[];
    isLoading: boolean;
    isError: boolean;
    message: string;
}

const initialState: DepartmentState = {
    departments: [],
    isLoading: false,
    isError: false,
    message: '',
};

export interface CreateDepartmentResponse {
    success: boolean
    data: {
        department: Department
    }
    message: string
}

export interface FetchAllDepartmentResponse {
    success: boolean
    data: {
        departments: Department[]
    }
    message: string
}

// Fetch all departments
export const fetchDepartments = createAsyncThunk<
    FetchAllDepartmentResponse, // return type
    void,         // argument type 
    { state: RootState; rejectValue: string } // thunkAPI type
>('department/fetchAll', async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const token = state.auth.token;
            console.log('print token in departmentSlice fetchDepartments method: ', token)
            return (!token) 
                ? thunkAPI.rejectWithValue('No token found, Please login') 
                : await departmentService.getDepartments(token);
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

// Create a new department
export const createDepartment = createAsyncThunk<
    CreateDepartmentResponse,                        // return type
    { name: string, code: string },                  // argument type
    { state: RootState; rejectValue: string }            // thunkAPI type
>('auth/department/create', async (departmentData, thunkAPI) => {
        try {
            const state = thunkAPI.getState()
            const token = state.auth.token;
            console.log('print token in departmentSlice createDepartment method: ', token)
            return (!token) 
                ? thunkAPI.rejectWithValue('No token found, Please login') 
                : await departmentService.createDepartment(departmentData, token);
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

export const departmentSlice = createSlice({
    name: 'department',
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
            .addCase(fetchDepartments.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<FetchAllDepartmentResponse>) => {
                state.isLoading = false;
                state.departments = action.payload.data.departments;
            })
            .addCase(fetchDepartments.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || 'Failed to fetch departments';
            })
            .addCase(createDepartment.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(createDepartment.fulfilled, (state, action: PayloadAction<CreateDepartmentResponse>) => {
                state.isLoading = false;
                state.departments.push(action.payload.data.department);
            })
            .addCase(createDepartment.rejected, (state, action) => {
                state.isLoading = false;
                state.isError = true;
                state.message = action.payload || 'Failed to create department';
            });
    },
});

export const { reset } = departmentSlice.actions;
export default departmentSlice.reducer;
