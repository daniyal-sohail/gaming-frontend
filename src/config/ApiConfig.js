import axios from "axios";

// Create an Axios instance
const API = axios.create({
    baseURL: "http://localhost:8000/api/v1/",
    withCredentials: true, // This ensures cookies are sent with requests
    headers: {
        "Content-Type": "application/json",
    },
});

// Store reference to clearSession function
let clearSessionRef = null;

// Function to set the clearSession reference
export const setClearSession = (clearSession) => {
    clearSessionRef = clearSession;
};

// Flag to prevent multiple simultaneous refresh attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });
    failedQueue = [];
};

// Response interceptor to handle token refresh
API.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // If error is 401 and we haven't tried to refresh yet
        if (error.response?.status === 401 && !originalRequest._retry) {
            if (isRefreshing) {
                // If already refreshing, queue this request
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                    .then(() => API(originalRequest))
                    .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                // Call refresh token endpoint
                await API.post("/auth/refresh-token");

                processQueue(null);
                isRefreshing = false;

                // Retry the original request
                return API(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                isRefreshing = false;

                // Clear user session when token refresh fails
                if (clearSessionRef) {
                    clearSessionRef();
                }

                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default API;