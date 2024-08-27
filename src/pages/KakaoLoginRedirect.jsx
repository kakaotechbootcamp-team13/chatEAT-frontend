import {useEffect} from 'react';
import {useNavigate} from 'react-router-dom';

const KakaoLoginRedirect = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const queryParams = new URLSearchParams(window.location.search);
        let accessToken = queryParams.get('accessToken');

        if (accessToken && accessToken.startsWith('Bearer ')) {
            accessToken = accessToken.substring(7);
        }

        if (accessToken) localStorage.setItem('accessToken', accessToken);

        navigate("/dashboard");

    }, [navigate]);

    return null;
};

export default KakaoLoginRedirect;
