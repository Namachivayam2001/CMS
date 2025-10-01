import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import attendanceService from "../../features/attendanceService";
import type { FetchAttendanceResponse, CreateAttendanceResponse } from "../../features/attendanceService";

export interface AttendanceRecord {
  student: string;
  status: "present" | "absent" | "late";
}

export interface Attendance {
  _id?: string;
  course: string;
  date: string;
  records: AttendanceRecord[];
}

interface AttendanceState {
  attendances: Attendance[];
  isLoading: boolean;
  isError: boolean;
  message: string;
}

const initialState: AttendanceState = {
  attendances: [],
  isLoading: false,
  isError: false,
  message: "",
};

// Fetch all attendances
export const fetchAttendances = createAsyncThunk<
  FetchAttendanceResponse,
  void,
  { state: RootState; rejectValue: string }
>("attendance/fetchAll", async (_, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    if (!token) return thunkAPI.rejectWithValue("No token found, please login");
    return await attendanceService.getAttendances(token);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Create attendance
export const createAttendance = createAsyncThunk<
  CreateAttendanceResponse,
  Attendance,
  { state: RootState; rejectValue: string }
>("attendance/create", async (attendanceData, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    if (!token) return thunkAPI.rejectWithValue("No token found, please login");
    return await attendanceService.createAttendance(attendanceData, token);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

// Update attendance
export const updateAttendance = createAsyncThunk<
  CreateAttendanceResponse,
  { id: string; data: Attendance },
  { state: RootState; rejectValue: string }
>("attendance/update", async ({ id, data }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.token;
    if (!token) return thunkAPI.rejectWithValue("No token found, please login");
    return await attendanceService.updateAttendance(id, data, token);
  } catch (error: any) {
    const message = error.response?.data?.message || error.message || error.toString();
    return thunkAPI.rejectWithValue(message);
  }
});

export const attendanceSlice = createSlice({
  name: "attendance",
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
      // fetch
      .addCase(fetchAttendances.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(fetchAttendances.fulfilled, (state, action: PayloadAction<FetchAttendanceResponse>) => {
        state.isLoading = false;
        state.attendances = action.payload.data.attendances;
      })
      .addCase(fetchAttendances.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to fetch attendances";
      })

      // create
      .addCase(createAttendance.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(createAttendance.fulfilled, (state, action: PayloadAction<CreateAttendanceResponse>) => {
        state.isLoading = false;
        state.attendances.push(action.payload.data.attendance);
      })
      .addCase(createAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to create attendance";
      })

      // update
      .addCase(updateAttendance.pending, (state) => {
        state.isLoading = true;
        state.isError = false;
        state.message = "";
      })
      .addCase(updateAttendance.fulfilled, (state, action: PayloadAction<CreateAttendanceResponse>) => {
        state.isLoading = false;
        const index = state.attendances.findIndex(att => att._id === action.payload.data.attendance._id);
        if (index !== -1) state.attendances[index] = action.payload.data.attendance;
      })
      .addCase(updateAttendance.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload || "Failed to update attendance";
      });
  },
});

export const { reset } = attendanceSlice.actions;
export default attendanceSlice.reducer;
