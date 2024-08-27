import apiClient from './apiClient';

export const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', {email, password});
    const accessToken = parseBearerToken(response.headers['authorization']);

    if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
    }

    return response.data;
};

export const refreshAccessToken = async () => {
    try {
        const response = await apiClient.patch('/auth/reissue');

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

export const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');

    if (!accessToken) {
        console.warn('No access token found for logout');
        return;
    }

    try {
        await apiClient.patch('/auth/logout', {}, {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    } catch (error) {
        console.error('Logout failed:', error);
    } finally {
        clearTokens();
    }
};

export const withdraw = async (password) => {
    return await apiClient.delete('/members/withdraw', {
        data: {password},
    });
};

export const withdrawOAuth2 = async (nickname) => {
    return await apiClient.delete('/members/oauth2/withdraw', {
        data: {nickname},
    });
};

const parseBearerToken = (headerValue) => {
    if (headerValue && headerValue.startsWith('Bearer ')) {
        return headerValue.split(' ')[1];
    }
    return null;
};

const clearTokens = () => {
    localStorage.removeItem('accessToken');
};
