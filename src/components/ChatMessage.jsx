import React, {useState} from "react";
import styled from 'styled-components';
import apiClient from '../services/apiClient';

const ChatMessage = ({ message, isLiked: initialIsLiked, onRemoveLike }) => {
    const [isLiked, setIsLiked] = useState(initialIsLiked);

    const handleHeartClick=async()=> {
        setIsLiked(!isLiked);

        if (!isLiked) {
            try {
                await sendLikeToBackend(message.id);
            } catch (error) {
                console.error('Failed to send like:', error);
                setIsLiked(false);
            }
        } else {
            try {
                await removeLikeFromBackend(message.id);
                onRemoveLike(message.id);
            } catch (error) {
                console.error('Failed to remove like:', error);
                setIsLiked(true);
            }
        }
    };

    return (
        <ChatSet>
            <StyledChatMessage $sender={message.sender}>
                {message.text}
            </StyledChatMessage>
            {message.sender === 'bot' && (
                <HeartIcon
                    src={isLiked ? "/src/assets/red-heart.png" : "/src/assets/gray-heart.png"}
                    alt="like"
                    onClick={handleHeartClick}
                />
            )}
        </ChatSet>
    );
};

export default ChatMessage;

const sendLikeToBackend = async (messageId) => {
    try {
        const response = await apiClient.post('/like', {messageId});
        console.log('Like successfully sent:', response.data);
    } catch (error) {
        console.error('Error sending like:', error);
        throw error;
    }
};

const removeLikeFromBackend = async (messageId) => {
    try {
        await apiClient.delete(`/like/${messageId}`);
        console.log('Like successfully removed');
    } catch (error) {
        console.error('Error removing like:', error);
        throw error;
    }
};

const ChatSet=styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    position: relative;
`

const HeartIcon = styled.img`
    width: 20px;
    height: 20px;
    cursor: pointer;
    margin-left: 10px;
    
    transition: transform 0.2s;

    &:hover {
        transform: scale(1.1);
    }
`;

const StyledChatMessage = styled.div`
    align-self: ${({ $sender }) => ($sender === 'user' ? 'flex-end' : 'flex-start')};
    background-color: ${({ $sender }) => ($sender === 'user' ? '#ffffff' : 'rgba(139, 69, 19, 0.7)')};
    color: ${({ $sender }) => ($sender === 'user' ? '#000' : '#fff')};
    width: auto;
    max-width: 500px;
    padding: 10px;
    margin-bottom: 5px;
    border-radius: ${({ $sender }) => ($sender === 'user' ? '15px 15px 0px 15px' : '15px 15px 15px 0px')};
    border: 1px solid #8b4513;
    word-wrap: break-word;
    box-shadow: 1px 2px 3px -1px rgba(0, 0, 0, 0.4);
`;

