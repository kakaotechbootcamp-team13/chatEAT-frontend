import React, {useEffect, useRef, useState} from 'react';
import styled from 'styled-components';
import {Link} from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import useChatScroll from '../hooks/useChatScroll.js';
import {handleSend} from '../services/handleSend';
import {fetchChatMessages, fetchLikedMessages} from '../services/chatService';
import ChatMessage from '../components/ChatMessage.jsx';
import {format} from 'date-fns';
import apiClient from "../services/apiClient.js";

const Dashboard = ({sidebarOpen, toggleSidebar}) => {
    const [inputValue, setInputValue] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [likedMessages, setLikedMessages] = useState([]);
    const [buttonVisible, setButtonVisible] = useState(true);
    const chatBoxRef = useChatScroll(chatMessages);
    const shouldScrollRef = useRef(false);
    const [isWaitingForResponse, setIsWaitingForResponse] = useState(false);

    useEffect(() => {
        const fetchChatData = async () => {
            try {
                const [messages, likedMessages] = await Promise.all([
                    fetchChatMessages(),
                    fetchLikedMessages(),
                ]);
                setChatMessages(messages);
                setLikedMessages(likedMessages);
            } catch (error) {
                console.error('Error fetching chat or likes data:', error);
            }
        };

        fetchChatData();
    }, []);

    const handleButtonClick = async (text) => {
        try {
            await handleSend(text, setChatMessages);
            setButtonVisible(false);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleInputSubmit = async () => {
        if (!inputValue.trim()) return;
        setIsWaitingForResponse(true);
        try {
            await handleSend(inputValue, setChatMessages);
            setInputValue('');
            setButtonVisible(false);
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setIsWaitingForResponse(false);
        }
    };

    const handleViewChatClick = () => {
        setButtonVisible(false);
        shouldScrollRef.current = true;
    };

    const handleLikeToggle = async (messageId) => {
        if (!messageId) {
            console.error("messageId is null or undefined.");
            return;
        }

        const isCurrentlyLiked = likedMessages.includes(messageId);

        // 좋아요 상태를 즉시 반영
        setLikedMessages((prev) => {
            if (isCurrentlyLiked) {
                return prev.filter((id) => id !== messageId);
            } else {
                return [...prev, messageId];
            }
        });

        try {
            if (isCurrentlyLiked) {
                await apiClient.delete(`/like/${messageId}`);
            } else {
                await apiClient.post('/like', {messageId});
            }
        } catch (error) {
            console.error('Failed to update like status:', error);
            // 실패 시 좋아요 상태 롤백
            setLikedMessages((prev) => {
                if (isCurrentlyLiked) {
                    return [...prev, messageId];
                } else {
                    return prev.filter((id) => id !== messageId);
                }
            });
        }
    };

    useEffect(() => {
        if (shouldScrollRef.current && chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            shouldScrollRef.current = false;
        }
    }, [buttonVisible, chatMessages]);

    const formatDate = (date) => {
        return date instanceof Date && !isNaN(date)
            ? format(date, 'yyyy-MM-dd')
            : '';
    };

    return (
        <Container>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar}/>
            <Content className={sidebarOpen ? 'sidebar-open' : ''}>
                <Header>
                    <MenuButton onClick={toggleSidebar}>
                        {sidebarOpen ? '<<' : '☰'}
                    </MenuButton>
                    <HeaderContent>
                        <Link to="/">
                            <Logo src="/src/assets/logo.png" alt="ChatEAT Logo"/>
                        </Link>
                        <Link to="/">
                            <Title>ChatEAT</Title>
                        </Link>
                    </HeaderContent>
                </Header>
                <Main ref={chatBoxRef}>
                    {!buttonVisible && (
                        <ChatBox>
                            {chatMessages.map((msg, index) => {
                                const currentFormattedDate = formatDate(msg.timestamp);
                                const previousFormattedDate = index > 0 ? formatDate(chatMessages[index - 1].timestamp) : null;
                                const showDate = index === 0 || currentFormattedDate !== previousFormattedDate;
                                const isLiked = likedMessages.includes(msg.id);

                                return (
                                    <Chatting key={msg.id}>
                                        {showDate && <DateLabel>{currentFormattedDate}</DateLabel>}
                                        <ChatMessage
                                            message={msg}
                                            isLiked={isLiked}
                                            onLikeToggle={msg.isBotResponse ? () => handleLikeToggle(msg.id) : undefined}
                                        />
                                    </Chatting>
                                );
                            })}
                        </ChatBox>
                    )}
                    {buttonVisible && (
                        <>
                            <Button onClick={() => handleButtonClick('카부캠 근처 맛집 랜덤 추천')}>
                                <ButtonImg src={"src/assets/meal.png"} alt="icon"/>
                                카부캠 근처 맛집 랜덤 추천
                            </Button>
                            <Button onClick={() => handleButtonClick('오늘의 날씨')}>
                                <ButtonImg src={"src/assets/weather.png"} alt="icon"/>
                                오늘의 날씨
                            </Button>
                            <Button onClick={() => handleButtonClick('카부캠 근처 교통 정보 안내')}>
                                <ButtonImg src={"src/assets/transportation.png"} alt="icon"/>
                                카부캠 근처 교통 정보 안내
                            </Button>
                        </>
                    )}
                </Main>
                {buttonVisible && (
                    <CenterAlignedContainer>
                        <ViewChatting onClick={handleViewChatClick}>채팅보기</ViewChatting>
                    </CenterAlignedContainer>
                )}
                <ChatInputSection>
                    <ChatInputContainer>
                        <ChatInputWithButton
                            inputValue={inputValue}
                            setInputValue={setInputValue}
                            handleSend={handleInputSubmit}
                            isDisabled={isWaitingForResponse}
                        />
                        {isWaitingForResponse && (
                            <WaitingMessage>응답을 기다리고 있습니다...</WaitingMessage>
                        )}
                    </ChatInputContainer>
                    <Disclaimer>ChatEAT는 실수를 할 수 있습니다. 중요한 정보를 확인하세요.</Disclaimer>
                </ChatInputSection>
            </Content>
        </Container>
    );
};

Dashboard.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

export default Dashboard;

const ChatInputWithButton = ({inputValue, setInputValue, handleSend, isDisabled}) => {
    const handleChange = (e) => {
        setInputValue(e.target.value);
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <ChatInputContainer>
            <ChatInput
                value={inputValue}
                onChange={handleChange}
                onKeyPress={handleKeyPress}
                placeholder="채팅을 입력하세요..."
                rows={1}
                disabled={isDisabled}
            />
            <SendButton $visible={inputValue.length > 0} onClick={handleSend}>
                <ArrowIcon src="/src/assets/arrow.png" alt="send"/>
            </SendButton>
        </ChatInputContainer>
    );
};

// 스타일링 관련 코드
const Container = styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;
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
    background-color: #fff;
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

const HeaderContent = styled.div`
    display: flex;
    align-items: center;
    margin-left: 10px;
`;

const Logo = styled.img`
    height: 40px;
    margin-right: 10px;
`;

const Title = styled.h1`
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

const Button = styled.button`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 200px;
    padding: 20px;
    font-size: 18px;
    border: 2px solid #8b4513;
    border-radius: 10px;
    background-color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;
    word-break: keep-all;

    &:hover {
        background-color: #f0e6d6;
    }
`;

const ButtonImg = styled.img`
    width: 35px;
    height: auto;
    margin-right: 10px;
`;

const CenterAlignedContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 10px;
`;

const ViewChatting = styled.p`
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    word-break: keep-all;
    margin-top: 20px;

    &:hover {
        color: #4e4e4e;
    }
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
`;

const ChatInputSection = styled.div`
    background-color: #ffffff;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const ChatInputContainer = styled.div`
    position: relative;
    width: 100%;
    max-width: 700px;
`;

const ChatInput = styled.textarea`
    width: 100%;
    max-width: 700px;
    padding: 10px 45px 10px 10px;
    font-size: 16px;
    border: 2px solid #8b4513;
    border-radius: 20px;
    resize: none;
    overflow-y: auto;
    min-height: 50px;
    max-height: 100px;
    height: auto;
    line-height: 1.5;
    box-shadow: 1px 2px 3px -1px rgba(0, 0, 0, 0.4);
`;

const SendButton = styled.button`
    position: absolute;
    right: 7px;
    top: 45%;
    transform: translateY(-50%);
    background-color: #8b4513;
    color: white;
    border: none;
    padding: 7px;
    border-radius: 16px;
    cursor: pointer;
    display: ${({$visible}) => ($visible ? 'block' : 'none')};
`;

const ArrowIcon = styled.img`
    width: 20px;
    height: 20px;
`;

const Disclaimer = styled.p`
    margin-top: 10px;
    font-size: 12px;
    color: #8b4513;
    text-align: center;
`;

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

const WaitingMessage = styled.p`
    color: #8b4513;
    font-size: 14px;
    text-align: center;
    margin-top: 10px;
`;
