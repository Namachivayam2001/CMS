import axios from 'axios';
import type { CreateCourseResponse, FetchAllCourseResponse } from '../app/slices/courseSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_URL_FETCH_COURSES = `${API_BASE_URL}/course/fetchAll`;
const API_URL_CREATE_COURSE = `${API_BASE_URL}/course/create`;

const courseService = {
    createCourse: async (
        courseData: {
            name: string;
            code: string;
            department: string;
            teacher: string;
            semester: number;
            credits: number;
        },
        token: string
    ): Promise<CreateCourseResponse> => {
        const response = await axios.post(API_URL_CREATE_COURSE, courseData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    getCourses: async (token: string): Promise<FetchAllCourseResponse> => {
        const response = await axios.get(API_URL_FETCH_COURSES, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};

export default courseService;
