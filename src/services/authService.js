import apiClient from './apiClient';

export const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', {email, password});
    const accessToken = parseBearerToken(response.headers['authorization']);
    const refreshToken = response.headers['refresh'];

    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }

    return response.data;
};

export const refreshAccessToken = async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
        throw new Error('Refresh token not available');
    }

    try {
        const response = await apiClient.patch('/auth/reissue', null, {
            headers: {
                Refresh: refreshToken,
            },
        });

        const newAccessToken = parseBearerToken(response.headers['authorization']);

        if (newAccessToken) {
            localStorage.setItem('accessToken', newAccessToken);
            return true;
        } else {
            console.error("Failed to parse new access token");
            return false;
        }
    } catch (error) {
        console.error("Failed to refresh token:", error);
        throw error;
    }
};

// 로그아웃 함수
export const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
        console.warn('No tokens found for logout');
        return;
    }

    try {
        await apiClient.patch('/auth/logout', {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                Refresh: refreshToken,
            },
        });
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        clearTokens();
    }
};

// 회원 탈퇴 함수
export const withdraw = async (password) => {
    return await apiClient.delete('/members/withdraw', {
        data: {password},
    });
};

// OAuth2 회원 탈퇴 함수
export const withdrawOAuth2 = async (nickname) => {
    return await apiClient.delete('/members/oauth2/withdraw', {
        data: {nickname},
    });
};

// 토큰 파싱 함수
const parseBearerToken = (headerValue) => {
    if (headerValue && headerValue.startsWith('Bearer ')) {
        return headerValue.split(' ')[1];
    }
    return null;
};

// 토큰 제거 함수
const clearTokens = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
};
