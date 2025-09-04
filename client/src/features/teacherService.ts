import axios from "axios";
import type { Teacher } from "../app/slices/teacherSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL_FETCH_TEACHERS = `${API_BASE_URL}/fetch/teachers`;
const API_URL_CREATE_TEACHER = `${API_BASE_URL}/create/teacher`;

const teacherService = {
  getTeachers: async (token: string): Promise<Teacher[]> => {
    const response = await axios.get(API_URL_FETCH_TEACHERS, { 
        headers: { 
            Authorization: `Bearer ${token}` 
        }
    });
    return response.data;
  },

  createTeacher: async (teacherData: Teacher, token: string): Promise<Teacher> => {
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
