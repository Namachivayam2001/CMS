import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL_FETCH_DEPARTMENTS = `${API_BASE_URL}/fetch/departments`;
const API_URL_CREATE_DEPARTMENT = `${API_BASE_URL}/create/department`;

const departmentService = {
    createDepartment: async (departmentData: { name: string }, token: string) => {
        const response = await axios.post(API_URL_CREATE_DEPARTMENT, departmentData, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data;
    },

    getDepartments: async (token: string) => {
        const response = await axios.get(API_URL_FETCH_DEPARTMENTS, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return response.data; // Array of departments
    },
};

export default departmentService;
