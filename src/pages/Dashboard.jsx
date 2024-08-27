import React, {useState, useEffect, useRef} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import useChatScroll from "../hooks/useChatScroll.js";
import { handleSend } from '../services/handleSend';
import apiClient from "../services/apiClient.js";
import ChatMessage from "../components/ChatMessage.jsx";
import { format } from 'date-fns';

const Dashboard = ({ sidebarOpen, toggleSidebar }) => {
    const [inputValue, setInputValue] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [likedMessages, setLikedMessages] = useState([]);
    const [buttonVisible, setButtonVisible] = useState(true);
    const chatBoxRef = useChatScroll(chatMessages);
    const shouldScrollRef = useRef(false);

    useEffect(() => {
        const fetchChatHistory = async () => {
            try {
                const response = await apiClient.get('/chats');

                const formattedMessages = response.data.map((msg) => {
                    const timestamp = new Date(msg.timestamp);

                    if (isNaN(timestamp)) {
                        return null;
                    }
                    return {
                        id: msg.id,
                        text: msg.message,
                        sender: msg.botResponse ? 'bot' : 'user',
                        timestamp: timestamp,
                        userEmail: msg.email
                    };
                }).filter(Boolean);

                setChatMessages(formattedMessages);
            } catch (error) {
                console.error('Error fetching chat history:', error);
            }
        };

        const fetchUserLikes = async() => {
            try{
                const response = await apiClient.get('/likes');

                setLikedMessages(response.data.map(like=>like.messageId));
            } catch (error) {
                console.error('Failed to fetch user likes:', error);
            }
        };

        fetchChatHistory();
        fetchUserLikes();
    }, []);


    const handleButtonClick = (text) => {
        handleSend(text, setChatMessages);
        setButtonVisible(false);
    };

    const handleInputSubmit = () => {
        handleSend(inputValue, setChatMessages);
        setButtonVisible(false);
        setInputValue('');
    };

    const handleViewChatClick = () => {
        setButtonVisible(false);
        shouldScrollRef.current = true;
    };

    const handleRemoveLike = (messageId) => {
        setLikedMessages(likedMessages.filter(msg => msg.id !== messageId));
    };

    useEffect(() => {
        if (shouldScrollRef.current && chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
            shouldScrollRef.current = false;
        }
    }, [buttonVisible]);

    const formatDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) {
            console.error('Invalid date value in formatDate:', date);
            return '';
        }
        return format(date, 'yyyy-MM-dd');
    };

    return (
        <Container>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
            <Content className={sidebarOpen ? 'sidebar-open' : ''}>
                <Header>
                    <MenuButton onClick={toggleSidebar}>
                        {sidebarOpen ? '<<' : '☰'}
                    </MenuButton>
                    <HeaderContent>
                        <Link to="/">
                            <Logo src="/src/assets/logo.png" alt="ChatEAT Logo" />
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

                                if (!currentFormattedDate) {
                                    return null;
                                }

                                const showDate = index === 0 || currentFormattedDate !== previousFormattedDate;
                                const isLiked = likedMessages.includes(msg.id);

                                return (
                                    <Chatting key={index}>
                                        {showDate && <DateLabel>{currentFormattedDate}</DateLabel>}
                                        <ChatMessage message={msg} isLiked={isLiked} onRemoveLike={handleRemoveLike}/>
                                    </Chatting>
                                );
                            })}
                        </ChatBox>
                    )}
                    {buttonVisible && (
                        <>
                            <Button onClick={()=>handleButtonClick('카부캠 근처 맛집 랜덤 추천')}>
                                <ButtonImg src={"src/assets/meal.png"} alt="icon"/>
                                카부캠 근처 맛집 랜덤 추천
                            </Button>
                            <Button onClick={()=>handleButtonClick('오늘의 날씨')}>
                                <ButtonImg src={"src/assets/weather.png"} alt="icon"/>
                                오늘의 날씨
                            </Button>
                            <Button onClick={()=>handleButtonClick('카부캠 근처 교통 정보 안내')}>
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
                            handleSend={handleInputSubmit}/>
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

const ChatInputWithButton=({inputValue, setInputValue, handleSend}) => {
    const handleChange=(e)=>{
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
            />

            <SendButton $visible={inputValue.length > 0 ? 'block' : undefined} onClick={handleSend}>
                <ArrowIcon src="/src/assets/arrow.png" alt="send" />
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
`

const CenterAlignedContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    margin-top: 10px; /* 상단 여백 추가 */
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
`

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
    display: ${({ $visible }) => ($visible ? 'block' : 'none')};
`;

const ArrowIcon = styled.img`
    width: 20px;  // 아이콘 크기 조절
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
