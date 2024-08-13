import apiClient from './apiClient';

// 이메일 중복 확인
export const checkEmail = async (email) => {
    const response = await apiClient.get(`/members/email-check/${email}`);
    return response.data; // { check: boolean, socialType: string }
};

// 닉네임 중복 확인
export const checkNickname = async (nickname) => {
    const response = await apiClient.get(`/members/nickname-check/${nickname}`);
    return response.data; // { check: boolean }
};

export const join = async ({ email, password, nickname }) => {
    const response = await apiClient.post('/members/join', {
        email,
        password,
        nickname
    });
    return response.data;
};
