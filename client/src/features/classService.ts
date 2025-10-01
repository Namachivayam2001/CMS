import axios from "axios";
import type { CreateClassResponse, FetchAllClassResponse } from '../app/slices/classSlice';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const API_URL_FETCH_CLASSES = `${API_BASE_URL}/class/fetchAll`;
const API_URL_CREATE_CLASS = `${API_BASE_URL}/class/create`;
const API_URL_UPDATE_CLASS = (id: string) => `${API_BASE_URL}/class/update/${id}`;
const API_URL_DELETE_CLASS = (id: string) => `${API_BASE_URL}/class/delete/${id}`;

const classService = {
    // Fetch all classes
    getClasses: async (token: string): Promise<FetchAllClassResponse> => {
        const response = await axios.get(API_URL_FETCH_CLASSES, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Create a new class
    createClass: async (classData: any, token: string): Promise<CreateClassResponse> => {
        const response = await axios.post(API_URL_CREATE_CLASS, classData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Update existing class
    updateClass: async (id: string, classData: any, token: string): Promise<CreateClassResponse> => {
        const response = await axios.put(API_URL_UPDATE_CLASS(id), classData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    // Delete class
    deleteClass: async (id: string, token: string): Promise<{ success: boolean; message: string }> => {
        const response = await axios.delete(API_URL_DELETE_CLASS(id), {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};

export default classService;
