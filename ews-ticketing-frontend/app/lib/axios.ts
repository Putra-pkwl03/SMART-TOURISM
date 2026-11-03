import axios from 'axios';
import { getApiUrl } from './backend-url';

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
        const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
