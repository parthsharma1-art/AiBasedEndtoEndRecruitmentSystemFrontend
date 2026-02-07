
const CONFIG = {
    BACKEND_URL: "http://localhost:8081/api",   // Spring Boot backend
    FRONTEND_URL: "http://localhost:3000",  // React frontend

    API: {
        GET_ALL_JOBS: "/api/profile/jobs/jobs",
        
        LOGIN: "/api/auth/login",
        REGISTER: "/api/auth/register"
    }
};

export default CONFIG;
