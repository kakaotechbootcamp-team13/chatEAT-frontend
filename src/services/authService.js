import apiClient from './apiClient';

export const login = async (email, password) => {
    const response = await apiClient.post('/auth/login', {email, password});
    let accessToken = response.headers['authorization'];
    const refreshToken = response.headers['refresh'];

    if (accessToken && accessToken.startsWith('Bearer ')) {
        accessToken = accessToken.split(' ')[1];
    }

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

    const response = await apiClient.patch('/auth/reissue', null, {
        headers: {
            Refresh: `${refreshToken}`,
        },
    });

    return response.data;
};


export const logout = async () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken || !refreshToken) {
        throw new Error('No tokens found');
    }

    try {
        await apiClient.patch(
            '/auth/logout',
            {},
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    Refresh: refreshToken,
                },
            }
        );
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    } catch (error) {
        console.error('Logout failed:', error);
        throw error;
    }
};

export const withdraw = async (password) => {
    return await apiClient.delete('/members/withdraw', {data: {password}});
};

export const withdrawOAuth2 = async (nickname) => {
    return await apiClient.delete('/members/oauth2/withdraw', {data: {nickname}});
};
