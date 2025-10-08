import axios from "axios";
import type { Attendance } from "../app/slices/attendanceSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const API_URL_FETCH_ATTENDANCES = `${API_BASE_URL}/attendances`;
const API_URL_CREATE_ATTENDANCE = `${API_BASE_URL}/attendance/mark`;
const API_URL_UPDATE_ATTENDANCE = (id: string) => `${API_BASE_URL}/attendances/${id}`;

export interface FetchAttendanceResponse { 
  success: boolean;
  data: {
    attendances: Attendance[];
  };
  message: string;
}

export interface CreateAttendanceResponse {
  success: boolean;
  data: {
    attendance: Attendance;
  };
  message: string;
}

const attendanceService = {
  getAttendances: async (token: string): Promise<FetchAttendanceResponse> => {
    const response = await axios.get(API_URL_FETCH_ATTENDANCES, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createAttendance: async (attendanceData: Attendance, token: string): Promise<CreateAttendanceResponse> => {
    console.log("API: ", API_URL_CREATE_ATTENDANCE)
    
    const response = await axios.post(API_URL_CREATE_ATTENDANCE, attendanceData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(response)
    return response.data;
  },

  updateAttendance: async (id: string, attendanceData: Attendance, token: string): Promise<CreateAttendanceResponse> => {
    const response = await axios.put(API_URL_UPDATE_ATTENDANCE(id), attendanceData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default attendanceService;
