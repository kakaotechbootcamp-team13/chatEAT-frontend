import apiClient from "./apiClient.js";

export const handleSend = async (message, setChatMessages)  => {
    if (message.trim()) {
        setChatMessages((prevMessages) => [
            ...prevMessages,
            {text: message, sender:'user'}
        ]);

        try {
            const response = await apiClient.post('/chat', {message});

            setChatMessages((prevMessages) => [
                ...prevMessages,
                {text: response.data.message, sender: 'bot'},
            ]);
        } catch (error) {
            console.error('Error:', error);
            setChatMessages((prevMessages) => [
                ...prevMessages,
                {text: 'Error in getting response from server', sender: 'bot'},
            ]);
        }
    }
};
