import axios from 'axios';
import { toast } from 'react-toastify';

// We create an instance of axios with our backend URL.
const api = axios.create({
    baseURL: 'http://localhost:8080',
    withCredentials: true 
});

// Response Interceptor: Handles global error cases like session expiry
api.interceptors.response.use(
    (response) => response, // Pass through successful responses
    (error) => {
        // Check if the error is a 401 Unauthorized (Session Expired)
        if (error.response && error.response.status === 401) {
            // Avoid infinite loops if already on login page
            if (!window.location.pathname.includes('/login') && window.location.pathname !== '/') {
                toast.error("Session Expired: Please login again to continue.");
                
                // We clear local storage and redirect to login
                // Note: We use window.location for a hard redirect which also resets any in-memory state
                setTimeout(() => {
                    window.location.href = '/login';
                }, 1500);
            }
        }
        return Promise.reject(error);
    }
);

export default api;
