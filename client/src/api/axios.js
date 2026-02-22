import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "http://127.0.0.1:5002/api",
    withCredentials: true, // Crucial: This ensures cookies are sent with cross-origin requests
});

// Response Interceptor: Handle 401 errors (Token Expiry)
api.interceptors.response.use(
    (response) => {
        // Any status code that lie within the range of 2xx cause this function to trigger
        return response;
    },
    async (error) => {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and we haven't already retried this request
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // Attempt to hit the refresh endpoint. Since we have withCredentials: true, 
                // the refreshToken cookie will be sent automatically.
                await api.post("/auth/refresh");

                // If refresh was successful, retry the original request
                return api(originalRequest);
            } catch (refreshError) {
                // If refresh fails (e.g., refresh token expired or invalid), we must log the user out.
                // We'll throw the error so the calling function (like AuthContext) can handle it.
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export default api;
