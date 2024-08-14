import {useState} from 'react';
import {login, refreshAccessToken} from '../services/authService';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (email, password) => {
        setLoading(true);
        try {
            await login(email, password);
            setLoading(false);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || '로그인에 실패했습니다.');
            setLoading(false);
            return false;
        }
    };

    const handleTokenRefresh = async () => {
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
            return false;
        }
        
        try {
            const {accessToken} = await refreshAccessToken(refreshToken);
            localStorage.setItem('accessToken', accessToken);
            return true;
        } catch (err) {
            setError(err.response?.data?.message || '토큰 갱신에 실패했습니다.');
            return false;
        }
    };

    return {
        handleLogin,
        handleTokenRefresh,
        loading,
        error,
    };
};
