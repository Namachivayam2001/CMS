import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import enrollmentService from "../../features/enrollmentService";

export interface Enrollment {
  _id?: string;
  student: string; // Student ObjectId
  course: string; // Course ObjectId
  academicYear: string;
  semester: number;
}

interface EnrollmentState {
  enrollments: Enrollment[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: EnrollmentState = {
  enrollments: [],
  isLoading: false,
  isError: false,
  message: "",
};

export interface CreateEnrollmentResponse {
  success: boolean;
  data: { enrollment: Enrollment };
  message: string;
}

export interface FetchAllEnrollmentResponse {
  success: boolean;
  data: { enrollments: Enrollment[] };
  message: string;
}

// Fetch all enrollments
export const fetchEnrollments = createAsyncThunk<FetchAllEnrollmentResponse, void, { state: RootState; rejectValue: string }>(
  "enrollment/fetchAll",
  async (_, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      return !token ? thunkAPI.rejectWithValue("No token found, Please login") : await enrollmentService.getEnrollments(token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Create enrollment
export const createEnrollment = createAsyncThunk<CreateEnrollmentResponse, Enrollment, { state: RootState; rejectValue: string }>(
  "enrollment/create",
  async (enrollmentData, thunkAPI) => {
    try {
      const state = thunkAPI.getState();
      const token = state.auth.token;
      return !token ? thunkAPI.rejectWithValue("No token found, Please login") : await enrollmentService.createEnrollment(enrollmentData, token);
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || error.toString();
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const enrollmentSlice = createSlice({
  name: "enrollment",
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
      .addCase(fetchEnrollments.pending, (state) => { state.isLoading = true; })
      .addCase(fetchEnrollments.fulfilled, (state, action: PayloadAction<FetchAllEnrollmentResponse>) => {
        state.isLoading = false;
        state.enrollments = action.payload.data.enrollments;
      })
      .addCase(fetchEnrollments.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string || "Failed to fetch enrollments";
      })
      .addCase(createEnrollment.pending, (state) => { state.isLoading = true; })
      .addCase(createEnrollment.fulfilled, (state, action: PayloadAction<CreateEnrollmentResponse>) => {
        state.isLoading = false;
        state.enrollments.push(action.payload.data.enrollment);
      })
      .addCase(createEnrollment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload as string || "Failed to create enrollment";
      });
  },
});

export const { reset } = enrollmentSlice.actions;
export default enrollmentSlice.reducer;
