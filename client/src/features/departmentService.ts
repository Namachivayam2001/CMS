import axios from 'axios';
import type { CreateDepartmentResponse, FetchAllDepartmentResponse } from '../app/slices/departmentSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'
const API_URL_FETCH_DEPARTMENTS = `${API_BASE_URL}/department/fetchAll`;
const API_URL_CREATE_DEPARTMENT = `${API_BASE_URL}/department/create`;

const departmentService = {
    createDepartment: async (departmentData: { name: string, code: string }, token: string): Promise<CreateDepartmentResponse> => {
        console.log('API_URL_CREATE_DEPARTMENT: ',API_URL_CREATE_DEPARTMENT)
        const response = await axios.post(API_URL_CREATE_DEPARTMENT, departmentData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log(response.data)
        return response.data;
    }, 

    getDepartments: async (token: string): Promise<FetchAllDepartmentResponse> => {
        const response = await axios.get(API_URL_FETCH_DEPARTMENTS, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Array of departments
    },
};

export default departmentService;
