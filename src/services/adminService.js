import apiClient from './apiClient';

export const getAllMembers = (page = 1, size = 20) => {
    return apiClient.get(`/admin/members?p=${page}&size=${size}`);
};
