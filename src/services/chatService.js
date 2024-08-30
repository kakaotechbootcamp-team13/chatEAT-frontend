// services/chatService.js
import apiClient from './apiClient';

export const fetchChatMessages = async () => {
    const response = await apiClient.get('/chats');
    return response.data.map((msg) => {
        const timestamp = new Date(msg.timestamp);
        return {
            id: msg.id,
            text: msg.message,
            sender: msg.botResponse ? 'bot' : 'user',
            timestamp,
            userEmail: msg.email,
            isBotResponse: msg.botResponse
        };
    });
};

export const fetchLikedMessages = async () => {
    const response = await apiClient.get('/likes');
    return response.data.map((like) => like.messageId);
};

export const likeMessage = async (messageId) => {
    try {
        const response = await apiClient.post('/like', {messageId});
        return response.data;
    } catch (error) {
        console.error('Error sending like:', error);
        throw error;
    }
};

export const removeLikeFromBackend = async (messageId) => {
    try {
        await apiClient.delete(`/like/${messageId}`);
        console.log('Like successfully removed');
    } catch (error) {
        console.error('Error removing like:', error);
        throw error;
    }
};
