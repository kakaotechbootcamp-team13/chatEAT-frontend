import axios from 'axios';
import {refreshAccessToken} from './authService.js';

const API_URL = import.meta.env.VITE_BACK_END_URL;

const apiClient = axios.create({
    baseURL: API_URL,
    withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
    const excludedPaths = [
        '/members/join',
        '/auth/login',
        '/members/nickname-check',
        '/members/email-check',
    ];

    const isExcluded = excludedPaths.some(path => config.url.includes(path));

    if (!isExcluded) {
        const accessToken = localStorage.getItem('accessToken');
        if (accessToken) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
    }

    return config;
});

apiClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        if (error.response.status === 400 && error.response.data.message === "토큰이 만료되었습니다." && !originalRequest._retry) {
            originalRequest._retry = true;
            const success = await refreshAccessToken();
            if (success) {
                originalRequest.headers.Authorization = `Bearer ${localStorage.getItem('accessToken')}`;
                return apiClient(originalRequest);
            }
        }
        return Promise.reject(error);
    }
);

export default apiClient;
