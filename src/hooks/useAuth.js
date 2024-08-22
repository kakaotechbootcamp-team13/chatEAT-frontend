import {useState} from 'react';
import {login} from '../services/authService';

export const useAuth = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (email, password) => {
        setLoading(true);
        setError(null);
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

    return {
        handleLogin,
        loading,
        error,
    };
};
