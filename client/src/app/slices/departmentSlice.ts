import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import departmentService from '../../features/departmentService.ts';
import type { RootState } from '../store.ts'; 

interface Department {
  _id: string;
  name: string;
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

// Fetch all departments
export const fetchDepartments = createAsyncThunk<
    Department[], // return type
    void,         // argument type
    { state: RootState; rejectValue: string } // thunkAPI type
    >(
    'departments/fetchAll',
    async (_, thunkAPI) => {
        try {
            const state = thunkAPI.getState();
            const token = state.auth.user ? state.auth.user.token : null;
            return (!token) ? thunkAPI.rejectWithValue('No token found, Please login') : await departmentService.getDepartments(token);
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
    Department,                        // return type
    { name: string },                  // argument type
    { state: RootState; rejectValue: string }            // thunkAPI type
    >(
    'departments/create',
    async (departmentData, thunkAPI) => {
        try {
            const state = thunkAPI.getState()
            const token = state.auth.user ? state.auth.user.token : null
            return (!token) ? thunkAPI.rejectWithValue('No token found, Please login') : await departmentService.createDepartment(departmentData, token);
        } catch (error: any) {
            const message =
                (error.response && error.response.data && error.response.data.message) ||
                error.message ||
                error.toString();
            return thunkAPI.rejectWithValue(message);
        }
    }
);

const departmentSlice = createSlice({
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
        .addCase(fetchDepartments.fulfilled, (state, action: PayloadAction<Department[]>) => {
            state.isLoading = false;
            state.departments = action.payload;
        })
        .addCase(fetchDepartments.rejected, (state, action) => {
            state.isLoading = false;
            state.isError = true;
            state.message = action.payload || 'Failed to fetch departments';
        })
        .addCase(createDepartment.pending, (state) => {
            state.isLoading = true;
        })
        .addCase(createDepartment.fulfilled, (state, action: PayloadAction<Department>) => {
            state.isLoading = false;
            state.departments.push(action.payload);
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
