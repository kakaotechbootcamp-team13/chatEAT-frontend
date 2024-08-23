import apiClient from "./apiClient.js";

export const handleSend = async (message, setChatMessages)  => {
    if (message.trim()) {
        const timestamp = new Date();
        setChatMessages((prevMessages) => [
            ...prevMessages,
            {text: message, sender:'user', timestamp}
        ]);

        try {
            const response = await apiClient.post('/chat', {message});
            const botTimestamp = new Date();
            setChatMessages((prevMessages) => [
                ...prevMessages,
                {text: response.data.message, sender: 'bot', timestamp: botTimestamp},
            ]);
        } catch (error) {
            console.error('Error:', error);

            const errorTimestamp = new Date();
            setChatMessages((prevMessages) => [
                ...prevMessages,
                {text: 'Error in getting response from server', sender: 'bot', timestamp: errorTimestamp},
            ]);
        }
    }
};
