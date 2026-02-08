import axios from "axios";
import CONFIG from "../config/config";

const api = axios.create({
    baseURL: CONFIG.BACKEND_URL,
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token) {
        config.headers.Authorization = "Bearer " + token;
    }
    return config;
});

export default api;
