import axios from "axios";
import type { Student } from "../app/slices/studentSlice";
import type { CreateStudentResponse, FetchAllStudentResponse } from "../app/slices/studentSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_URL_FETCH_STUDENTS = `${API_BASE_URL}/student/fetchAll`;
const API_URL_CREATE_STUDENT = `${API_BASE_URL}/student/create`;

const studentService = {
    getStudents: async (token: string): Promise<FetchAllStudentResponse> => {
        const response = await axios.get(API_URL_FETCH_STUDENTS, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data)
        return response.data;
    },

    createStudent: async (studentData: Student, token: string): Promise<CreateStudentResponse> => {
        const response = await axios.post(API_URL_CREATE_STUDENT, studentData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },
};

export default studentService;
export type { Student };
