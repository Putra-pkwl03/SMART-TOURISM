import axios from 'axios';

export const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/api',
    headers: {
        'Accept': 'application/json',
        // Hapus 'Content-Type': 'application/json' dari sini agar FormData tidak rusak!
    },
});

// Interceptor untuk otomatis menyertakan Bearer Token dari localStorage
apiClient.interceptors.request.use((config) => {
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


// import axios from 'axios';

// export const apiClient = axios.create({
//     baseURL: 'https://smartmandala.com/api',
//     headers: {
//         'Accept': 'application/json',
//         // Hapus 'Content-Type': 'application/json' dari sini agar FormData tidak rusak!
//     },
// });

// // Interceptor untuk otomatis menyertakan Bearer Token dari localStorage
// apiClient.interceptors.request.use((config) => {
//     if (typeof window !== 'undefined') {
//         const token = localStorage.getItem('auth_token') || localStorage.getItem('token');
//         if (token) {
//             config.headers.Authorization = `Bearer ${token}`;
//         }
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });