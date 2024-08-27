import apiClient from './apiClient';

export const checkEmail = async (email) => {
    const response = await apiClient.get(`/members/email-check/${email}`);
    return response.data; // { check: boolean, socialType: string }
};

export const checkNickname = async (nickname) => {
    const response = await apiClient.get(`/members/nickname-check/${nickname}`);
    return response.data; // { check: boolean }
};

export const join = async ({email, password, nickname}) => {
    const response = await apiClient.post('/members/join', {
        email,
        password,
        nickname
    });
    return response.data;
};

export const updateNickname = async (newNickname) => {
    try {
        const response = await apiClient.patch('/members/update', {newNickname});
        return response.data;
    } catch (error) {
        console.error('닉네임 수정 오류:', error);
        throw error;
    }
};

export const joinOAuth2 = async ({email, nickname}) => {
    const response = await apiClient.patch('/members/oauth2/join', {email, nickname});
    return response.data;
};


export const updatePassword = async (beforePassword, newPassword) => {
    try {
        const response = await apiClient.patch('/members/update-password', {beforePassword, newPassword});
        return response.data;
    } catch (error) {
        throw new Error('비밀번호 업데이트 중 오류 발생');
    }
};

export const getUserInfo = async () => {
    const response = await apiClient.get('/members/myInfo');
    return response.data;
};
