import apiClient from "./apiClient.js";
import {formatMessageWithLineBreaks} from "./chatService.js";

export const handleSend = async (message, setChatMessages) => {
    if (message.trim()) {
        const userMessage = {
            text: message,
            sender: 'user',
            timestamp: new Date(),
        };

        setChatMessages((prevMessages) => [...prevMessages, userMessage]);

        try {
            const response = await apiClient.post('/chat', {message});
            const botMessage = {
                text: formatMessageWithLineBreaks(response.data.message),
                sender: 'bot',
                timestamp: new Date(),
            };

            setChatMessages((prevMessages) => [...prevMessages, botMessage]);
        } catch (error) {
            console.error('Error:', error);

            const errorMessage = {
                text: 'Error in getting response from server',
                sender: 'bot',
                timestamp: new Date(),
            };

            setChatMessages((prevMessages) => [...prevMessages, errorMessage]);
        }
    }
};
