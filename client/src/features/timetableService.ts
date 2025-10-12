import axios from "axios";
import type { Timetable } from "../app/slices/timetableSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const API_URL_FETCH_TIMETABLES = `${API_BASE_URL}/timetable/fetchAll`;
const API_URL_CREATE_TIMETABLE = `${API_BASE_URL}/timetable/create`;
const API_URL_FETCH_BY_CLASS = (classId: string) => `${API_BASE_URL}/timetable/class/${classId}`;

export interface FetchTimetableResponse {
  success: boolean;
  data: {
    timetables: Timetable[];
  };
  message: string;
}

export interface CreateTimetableResponse {
  success: boolean;
  data: {
    timetable: Timetable;
  };
  message: string;
}

const timetableService = {
  getTimetables: async (token: string): Promise<FetchTimetableResponse> => {
    const response = await axios.get(API_URL_FETCH_TIMETABLES, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  createTimetable: async (timetableData: Timetable, token: string): Promise<CreateTimetableResponse> => {
    const response = await axios.post(API_URL_CREATE_TIMETABLE, timetableData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },

  getTimetablesByClass: async (classId: string, token: string): Promise<FetchTimetableResponse> => {
    const response = await axios.get(API_URL_FETCH_BY_CLASS(classId), {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};

export default timetableService;
