import apiClient from './apiClient';

export const getAllMembers = (page = 1, size = 20) => {
    return apiClient.get(`/admin/members?p=${page}&size=${size}`);
};

export const changeUserRole = async (memberId, role) => {
    try {
        const response = await apiClient.patch(`/admin/change-role/${memberId}`, {role});
        return response.data;
    } catch (error) {
        console.error('Failed to change user role:', error);
        throw error;
    }
};

export const deleteMember = async (memberId) => {
    return await apiClient.delete(`/admin/members/${memberId}`);
};

export const blockMember = async (memberId) => {
    return await apiClient.patch('/admin/blockMember', {id: memberId});
};

export const unblockMember = async (memberId) => {
    return await apiClient.patch('/admin/unblockMember', {id: memberId});
};
