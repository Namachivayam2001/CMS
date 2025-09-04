import axios from "axios";
import type { HOD } from "../app/slices/hodSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_URL_FETCH_HODS = `${API_BASE_URL}/fetch/hods`;
const API_URL_CREATE_HOD = `${API_BASE_URL}/create/hod`;

const hodService = {
  getHODs: async (token: string): Promise<HOD[]> => {
    const response = await axios.get(API_URL_FETCH_HODS, { 
        headers: { 
            Authorization: `Bearer ${token}` 
        } 
    });
    return response.data;
  },

  createHOD: async (hodData: HOD, token: string): Promise<HOD> => {
    const response = await axios.post(API_URL_CREATE_HOD, hodData, { 
        headers: { 
            Authorization: `Bearer ${token}` 
        } 
    });
    return response.data;
  },
};

export default hodService;
export type { HOD };
