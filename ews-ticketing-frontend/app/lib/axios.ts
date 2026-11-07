import axios from 'axios';
import { getApiUrl } from './backend-url';
import {
    expireAuthSession,
    getAuthToken,
    resetSessionExpirationHandling,
} from './auth-session';

export const apiClient = axios.create({
    baseURL: getApiUrl(),
    headers: {
        'Accept': 'application/json',
        // Hapus 'Content-Type': 'application/json' dari sini agar FormData tidak rusak!
    },
});

// Interceptor untuk otomatis menyertakan Bearer Token dari localStorage
apiClient.interceptors.request.use((config) => {
    config.baseURL = getApiUrl();
    if (typeof window !== 'undefined') {
        const token = getAuthToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

apiClient.interceptors.response.use(
    (response) => response,
    (error: unknown) => {
        if (axios.isAxiosError(error) && error.response?.status === 401) {
            expireAuthSession();
        }

        return Promise.reject(error);
    }
);

resetSessionExpirationHandling();
