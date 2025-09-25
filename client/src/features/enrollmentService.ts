import axios from "axios";
import type { Enrollment, CreateEnrollmentResponse, FetchAllEnrollmentResponse } from "../app/slices/enrollmentSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_URL_FETCH_ENROLLMENTS = `${API_BASE_URL}/enrollment/fetchAll`;
const API_URL_CREATE_ENROLLMENT = `${API_BASE_URL}/enrollment/create`;

const enrollmentService = {
  getEnrollments: async (token: string): Promise<FetchAllEnrollmentResponse> => {
    const response = await axios.get(API_URL_FETCH_ENROLLMENTS, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },

  createEnrollment: async (enrollmentData: Enrollment, token: string): Promise<CreateEnrollmentResponse> => {
    const response = await axios.post(API_URL_CREATE_ENROLLMENT, enrollmentData, { headers: { Authorization: `Bearer ${token}` } });
    return response.data;
  },
};

export default enrollmentService;
