import React, {useState} from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';
import useChatScroll from "../hooks/useChatScroll.js";

const Dashboard = ({ sidebarOpen, toggleSidebar }) => {
    const [inputValue, setInputValue] = useState('');
    const [chatMessages, setChatMessages] = useState([]);
    const [buttonVisible, setButtonVisible] = useState(true);
    const chatBoxRef = useChatScroll(chatMessages);

    const handleSend = (message) => {
        if (message.trim()) {
            setChatMessages([...chatMessages, message]);
            setInputValue('');
            setButtonVisible(false);
        }
    };

    const handleButtonClick = (text) => {
        handleSend(text);
    };

    const handleInputSubmit = () => {
        handleSend(inputValue);
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
                            {chatMessages.map((msg, index) => (
                                <ChatMessage key={index}>{msg}</ChatMessage>
                            ))}
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
            <SendButton visible={inputValue.length > 0 ? 'block' : undefined} onClick={handleSend}>
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
    //overflow: hidden;
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

const ChatBox = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 700px;
    height: 100%;
    flex: 1;
    //overflow-y: auto;
    padding: 10px;
`;

const ChatMessage = styled.div`
    align-self: flex-end;
    width: auto;
    max-width: 500px;
    background-color: #ffffff;
    padding: 10px;
    margin-bottom: 10px;
    border-radius: 15px 15px 0px 15px;
    border: 1px solid #8b4513;
    word-wrap: break-word;
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
    display: ${({ visible }) => (visible ? 'block' : 'none')};
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
