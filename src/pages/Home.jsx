import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

const Home = () => {
    const [displayText, setDisplayText] = useState('');
    const welcomeText = "h atEAT에 오신 것을 환영합니다!";

    useEffect(() => {
        let index = 0;
        const interval = setInterval(() => {
            setDisplayText((prev) => prev + welcomeText[index]);
            index++;
            if (index === welcomeText.length -1) clearInterval(interval);
        }, 100);

        return () => clearInterval(interval);
    }, [welcomeText]);

    return (
        <Container>
            <Logo src="/src/assets/logo.png" alt="ChatEAT Logo" />
            <Link to="/">
                <Title>ChatEAT</Title>
            </Link>
            <WelcomeText>C{displayText}</WelcomeText>
            <ButtonContainer>
                <Link to="/login">
                    <Button>로그인</Button>
                </Link>
                <Link to="/register">
                    <Button>회원가입</Button>
                </Link>
            </ButtonContainer>
        </Container>
    );
};

export default Home;

// 스타일링 관련 코드
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
`;

const Logo = styled.img`
    width: 150px;
    height: 150px;
`;

const Title = styled.h1`
    font-family: 'Edu VIC WA NT Beginner', sans-serif;
    color: #472C0B;
    font-weight: 600;
    font-size: 4.5rem;
    margin: 20px 0;
    cursor: pointer;
`;

const WelcomeText = styled.p`
    font-family: 'Goorm Sans', sans-serif;
    font-size: 1.5rem;
    margin-bottom: 40px;
    white-space: nowrap;
    overflow: hidden;
    border-right: 0.15em solid orange;
    animation: blink-caret 0.75s step-end infinite;

    @keyframes blink-caret {
        from, to {
            border-color: transparent;
        }
        50% {
            border-color: orange;
        }
    }
`;

const ButtonContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 15px;
`;

const Button = styled.button`
    font-family: 'Goorm Sans', sans-serif;
    width: 150px;
    height: 50px;
    background-color: #A1664D;
    color: white;
    padding: 10px 20px;
    border: none;
    border-radius: 20px;
    font-size: 1.4rem;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #8b4513;
    }
`;
