import React, {useEffect, useState} from "react";
import styled from 'styled-components';
import Sidebar from "../components/Sidebar.jsx";
import PropTypes from "prop-types";
import useChatScroll from "../hooks/useChatScroll.js";
import apiClient from "../services/apiClient.js";
import ChatMessage from "../components/ChatMessage.jsx";
import {format} from "date-fns";
import {formatMessageWithLineBreaks} from "../services/chatService.js";

const Like = ({sidebarOpen, toggleSidebar}) => {
    const [likedMessages, setLikedMessages] = useState([]);
    const chatBoxRef = useChatScroll(likedMessages);

    useEffect(() => {
        const fetchLikeHistory = async () => {
            try {
                const response = await apiClient.get('/likes');

                const formattedMessages = response.data.map((msg) => {
                    const timestamp = new Date(msg.timestamp);

                    if (isNaN(timestamp)) {
                        return null;
                    }
                    return {
                        id: msg.messageId,
                        text: formatMessageWithLineBreaks(msg.messageText),
                        timestamp: timestamp,
                        sender: 'bot'
                    };
                }).filter(Boolean);

                setLikedMessages(formattedMessages);
            } catch (error) {
                console.error('Failed to fetch user likes:', error);
            }
        };

        fetchLikeHistory();
    }, []);

    const handleRemoveLike = (messageId) => {
        setLikedMessages(likedMessages.filter(msg => msg.id !== messageId));
    };

    return(
        <Container>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar}/>
            <Content className={sidebarOpen ? 'sidebar-open' : ''}>
                <Header>
                    <MenuButton onClick={toggleSidebar}>
                        {sidebarOpen ? '<<' : '☰'}
                    </MenuButton>
                    <Title>좋아요</Title>
                </Header>
                <Main ref={chatBoxRef}>
                        <ChatBox>
                            {likedMessages.map((msg, index) => {
                                const currentFormattedDate = format(msg.timestamp, 'yyyy-MM-dd');
                                const previousFormattedDate = index > 0 ? format(likedMessages[index - 1].timestamp, 'yyyy-MM-dd') : null;

                                if (!currentFormattedDate) {
                                    return null;
                                }

                                const showDate = index === 0 || currentFormattedDate !== previousFormattedDate;
                                const isLiked = true;

                                return (
                                    <Chatting key={msg.id}>
                                        {showDate && <DateLabel>{currentFormattedDate}</DateLabel>}
                                        <ChatMessage message={msg} isLiked={isLiked} onRemoveLike={handleRemoveLike}/>
                                    </Chatting>
                                );
                            })}
                        </ChatBox>
                </Main>
            </Content>
        </Container>
    )
}

Like.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

export default Like;

const Container = styled.div`
    display: flex;
    height: 100vh;
    background-color: white;
`;

const Content = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-left: 0;
    transition: margin-left 0.3s ease-in-out;

    &.sidebar-open {
        margin-left: 250px;
    }
`;

const Header = styled.div`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 16px;
    background-color: #ffffff;
    border-bottom: 1px solid #ddd;
    transition: padding 0.3s ease-in-out;
`;

const MenuButton = styled.button`
    font-size: 24px;
    background: none;
    border: none;
    cursor: pointer;
    transition: opacity 0.3s ease-in-out;
`;

const Title = styled.h1`
    margin-left: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #472C0B;
`;

const Main = styled.div`
    flex: 1;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 20px;
    transition: transform 0.3s ease-in-out;
    padding: 0 20px;
    overflow-y: auto;
`;

const ChatBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 700px;
    height: 100%;
    flex: 1;
    padding: 10px;
`;

const Chatting = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`

const DateLabel = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 14px;
    font-weight: bold;
    color: #8b4513;
    background-color: #f0e6d6;
    padding: 8px 16px;
    margin: 16px 0;
    border-radius: 12px;
    box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

