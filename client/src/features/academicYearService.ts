import axios from "axios";
import type {
    AcademicYear,
    CreateAcademicYearResponse,
    FetchAllAcademicYearResponse,
    UpdateAcademicYearResponse,
    DeleteAcademicYearResponse,
} from "../app/slices/academicYearSlice"

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const API_URL_FETCH_YEARS = `${API_BASE_URL}/academicYear/fetchAll`;
const API_URL_CREATE_YEAR = `${API_BASE_URL}/academicYear/create`;
const API_URL_UPDATE_YEAR = (id: string) => `${API_BASE_URL}/academicYear/update/${id}`;
const API_URL_DELETE_YEAR = (id: string) => `${API_BASE_URL}/academicYear/delete/${id}`;

const academicYearService = {
    getAcademicYears: async (token: string): Promise<FetchAllAcademicYearResponse> => {
        const response = await axios.get(API_URL_FETCH_YEARS, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    createAcademicYear: async (
        yearData: AcademicYear,
        token: string
    ): Promise<CreateAcademicYearResponse> => {
        const response = await axios.post(API_URL_CREATE_YEAR, yearData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    updateAcademicYear: async (
        id: string,
        yearData: Partial<AcademicYear>,
        token: string
    ): Promise<UpdateAcademicYearResponse> => {
        const response = await axios.put(API_URL_UPDATE_YEAR(id), yearData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    deleteAcademicYear: async (id: string, token: string): Promise<DeleteAcademicYearResponse> => {
        const response = await axios.delete(API_URL_DELETE_YEAR(id), {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};

export default academicYearService;
