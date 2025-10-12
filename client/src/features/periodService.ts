import axios from "axios";
import type { Period } from "../app/slices/periodSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080/api";
const API_URL_FETCH_PERIODS = `${API_BASE_URL}/period/fetchAll`;
const API_URL_CREATE_PERIOD = `${API_BASE_URL}/period/create`;
const API_URL_UPDATE_PERIOD = (id: string) => `${API_BASE_URL}/period/${id}`;

export interface FetchPeriodResponse {
    success: boolean;
    data: { periods: Period[] };
    message: string;
}

export interface CreateOrUpdatePeriodResponse {
    success: boolean;
    data: { period: Period };
    message: string;
}

const periodService = {
    getPeriods: async (token: string): Promise<FetchPeriodResponse> => {
        const response = await axios.get(API_URL_FETCH_PERIODS, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },

    createPeriod: async (periodData: Period, token: string): Promise<CreateOrUpdatePeriodResponse> => {
        const response = await axios.post(API_URL_CREATE_PERIOD, periodData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        console.log(response.data)
        return response.data;
    },

    updatePeriod: async (id: string, periodData: Period, token: string): Promise<CreateOrUpdatePeriodResponse> => {
        const response = await axios.put(API_URL_UPDATE_PERIOD(id), periodData, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    },
};

export default periodService;
