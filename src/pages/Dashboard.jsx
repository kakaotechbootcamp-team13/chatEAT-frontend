import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import Sidebar from '../components/Sidebar';

const Dashboard = ({ sidebarOpen, toggleSidebar }) => {
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
                <Main>
                    <Button>카부캠 근처 맛집 랜덤 추천</Button>
                    <Button>오늘의 날씨</Button>
                    <Button>카부캠 근처 교통 정보 안내</Button>
                </Main>
                <ChatInputSection>
                    <ChatInputContainer>
                        <ChatInput
                            placeholder="채팅을 입력하세요..."
                            rows={1}
                        />
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
    align-items: center;
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
