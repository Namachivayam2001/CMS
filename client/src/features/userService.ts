import axios from "axios";
import type { FetchAllUserResponse } from "../app/slices/userSlice";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';
const API_URL_FETCH_USERS = `${API_BASE_URL}/user/fetchAll`;
// const API_URL_CREATE_USER = `${API_BASE_URL}/user/create`;

const userService = {
    // Get all users
    getUsers: async (token: string): Promise<FetchAllUserResponse> => {
        const response = await axios.get(API_URL_FETCH_USERS, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }); 
        
        return response.data;
    },

    // Create new user
    // createUser: async (userData: User, token: string): Promise<User> => {
    //     const response = await axios.post(API_URL_CREATE_USER, userData, {
    //         headers: {
    //             Authorization: `Bearer ${token}`,
    //         },
    //     });
    //     return response.data;
    // },
};

export default userService;
