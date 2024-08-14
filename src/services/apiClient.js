import axios from 'axios';
import {refreshAccessToken} from './authService.js';
import {useNavigate} from 'react-router-dom';

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
        const navigate = useNavigate();

        const responseData = error.response?.data;
        const status = responseData?.status;
        const message = responseData?.message;

        if ((status === 400 && message === "토큰이 만료되었습니다.") ||
            (status === 401 && message === "Unauthorized") && !originalRequest._retry) {

            originalRequest._retry = true;

            const success = await refreshAccessToken();
            if (success) {
                const newAccessToken = localStorage.getItem('accessToken');
                if (newAccessToken) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    return apiClient(originalRequest);
                }
            }

            // 토큰 재발급이 실패하거나 재발급 후에도 오류가 발생한 경우 (로그아웃 처리)
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            navigate('/');
        }

        return Promise.reject(error);
    }
);

export default apiClient;
