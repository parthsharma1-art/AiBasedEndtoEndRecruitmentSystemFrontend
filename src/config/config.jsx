const CONFIG = {

    BACKEND_URL:  "http://localhost:8081/api",
    FRONTEND_URL: import.meta.env.VITE_FRONTEND_URL || "http://localhost:3000",
    BASE_URL: "http://localhost:8081",

    API: {
        GET_ALL_JOBS: "/public/jobs", // Adjust if your backend endpoint is different
        LOGIN: "/auth/login",
        REGISTER: "/auth/register"
    }
};

export const getApiUrl = (endpoint) => `${CONFIG.BACKEND_URL}${endpoint}`;

export default CONFIG;
