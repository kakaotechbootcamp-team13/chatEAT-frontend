import React, {useEffect, useRef, useState} from 'react';
import { logout } from '../services/authService';
import { getUserInfo } from '../services/authService';
import styled from 'styled-components';
import {Link, useNavigate} from 'react-router-dom';

const Dashboard = () => {
    const [nickname, setNickname] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const isMounted = useRef(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserInfo();
                setNickname(userInfo.nickname);
            } catch (error) {
                console.error('사용자 정보를 가져오는데 실패했습니다.', error);
            }
        };
        fetchUserInfo();
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const handleInputChange = (e) => {
        setChatMessage(e.target.value);
        e.target.style.height = 'auto';
        e.target.style.height = e.target.scrollHeight + 'px';
    };

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/');
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <Container>
            <Sidebar open={sidebarOpen}>
                <UserProfile>
                    <Avatar />
                    <UserName>{nickname}</UserName>
                </UserProfile>
                <SidebarMenu>
                    <SidebarButton>채팅</SidebarButton>
                    <SidebarButton>보관함</SidebarButton>
                    <SidebarButton>좋아요</SidebarButton>
                    <SidebarButton>내 정보</SidebarButton>
                </SidebarMenu>
                <LogoutContainer>
                    <LogoutButton onClick={handleLogout}>로그아웃</LogoutButton>
                </LogoutContainer>
            </Sidebar>
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
                <Main>
                    <Button>카부캠 근처 맛집 랜덤 추천</Button>
                    <Button>오늘의 날씨</Button>
                    <Button>카부캠 근처 교통 정보 안내</Button>
                </Main>
                <ChatInputSection>
                    <ChatInputContainer>
                        <ChatInput
                            placeholder="채팅을 입력하세요..."
                            value={chatMessage}
                            onChange={handleInputChange}
                            rows={1}
                        />
                    </ChatInputContainer>
                    <Disclaimer>ChatEAT는 실수를 할 수 있습니다. 중요한 정보를 확인하세요.</Disclaimer>
                </ChatInputSection>
            </Content>
        </Container>
    );
};

export default Dashboard;

// 스타일링 관련 코드
const Container = styled.div`
    display: flex;
    height: 100vh;
    overflow: hidden;
    background-color: white;
`;

const Sidebar = styled.div`
    width: 250px;
    transition: transform 0.3s ease-in-out;
    transform: ${(props) => (props.open ? 'translateX(0)' : 'translateX(-100%)')};
    background-color: #f4f1ea;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    z-index: 10;
    padding: 16px;
`;

const UserProfile = styled.div`
    text-align: center;
    margin-top: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
`;

const Avatar = styled.div`
    width: 80px;
    height: 80px;
    background-color: #ccc;
    border-radius: 50%;
`;

const UserName = styled.div`
    font-size: 25px;
    color: #472C0B;
    margin-top: 8px;
    font-weight: bold;
`;

const SidebarMenu = styled.div`
    margin-top: 32px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: auto; /* 메뉴를 위로 올리기 위해 자동 마진 추가 */
`;

const SidebarButton = styled.button`
    width: 80%;
    padding: 10px;
    margin: 8px 0;
    font-size: 18px;
    color: #8b4513;
    background-color: transparent;
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.3s ease-in-out;

    &:hover {
        border-color: #8b4513;
    }
`;

const LogoutContainer = styled.div`
    display: flex;
    justify-content: center;
    margin-top: auto;
    margin-bottom: 16px; /* 로그아웃 버튼이 사이드바의 중앙에 오도록 조정 */
`;

const LogoutButton = styled.button`
    width: 80%;
    padding: 10px;
    font-size: 18px;
    color: #8b4513;
    background-color: transparent;
    border: 2px solid transparent;
    border-radius: 10px;
    cursor: pointer;
    transition: border-color 0.3s ease-in-out;

    &:hover {
        border-color: #8b4513;
    }
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
    justify-content: flex-start; /* 왼쪽 정렬 */
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
    gap: 20px; /* 버튼들 사이의 간격을 20px로 설정 */
    transition: transform 0.3s ease-in-out;
    padding: 0 20px;
`;

const Button = styled.button`
    padding: 20px;
    font-size: 18px;
    border: 2px solid #8b4513;
    border-radius: 10px;
    background-color: #fff;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #f0e6d6;
    }
`;

const ChatInputSection = styled.div`
    background-color: #ffffff;
    padding: 16px;
    display: flex;
    flex-direction: column;
    align-items: center; /* 중앙 정렬 */
`;

const ChatInputContainer = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
`;

const ChatInput = styled.textarea`
    width: 100%;
    max-width: 700px;
    padding: 10px;
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

const Disclaimer = styled.p`
    margin-top: 10px;
    font-size: 12px;
    color: #8b4513;
    text-align: center;
`;
