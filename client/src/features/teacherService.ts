import axios from "axios";
import type { Teacher, CreateTeacherResponse, FetchAllTeacherResponse } from "../app/slices/teacherSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_URL_FETCH_TEACHERS = `${API_BASE_URL}/teacher/fetchAll`;
const API_URL_CREATE_TEACHER = `${API_BASE_URL}/teacher/create`;

const teacherService = {
  getTeachers: async (token: string): Promise<FetchAllTeacherResponse> => {
    const response = await axios.get(API_URL_FETCH_TEACHERS, { 
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    });
    return response.data;
  },

  createTeacher: async (teacherData: Teacher, token: string): Promise<CreateTeacherResponse> => {
    const response = await axios.post(API_URL_CREATE_TEACHER, teacherData, { 
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    });
    return response.data;
  },
};

export default teacherService;
export type { Teacher };
