import React, {useState} from 'react';
import {Link, Navigate, useLocation} from 'react-router-dom';
import styled, {keyframes} from 'styled-components';

const RegisterSuccess = () => {
    const location = useLocation();
    const {email, nickname} = location.state || {};

    const [flipped, setFlipped] = useState(false);

    if (!email || !nickname) {
        return <Navigate to="/" replace/>;
    }

    const handleFlip = () => {
        setFlipped(!flipped);
    };

    return (
        <Container>
            <ThankYouMessage>ChatEAT의 회원이 되어 주셔서 감사합니다.</ThankYouMessage>
            <CardContainer onClick={handleFlip} flipped={flipped}>
                <CardFront flipped={flipped}>
                    <CardText>ChatEAT Membership Card</CardText>
                    <ClickPrompt>클릭하세요</ClickPrompt>
                </CardFront>
                <CardBack flipped={flipped}>
                    <DetailsContainer>
                        <DetailBlock>
                            <Label>이메일</Label>
                            <DetailValue>{email}</DetailValue>
                        </DetailBlock>
                        <DetailBlock>
                            <Label>닉네임</Label>
                            <DetailValue>{nickname}</DetailValue>
                        </DetailBlock>
                    </DetailsContainer>
                </CardBack>
            </CardContainer>
            <LoginButton to="/login">로그인</LoginButton>
        </Container>
    );
};

export default RegisterSuccess;

// 스타일링 관련 코드
const fadeIn = keyframes`
    from {
        opacity: 0;
        transform: translateY(-20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
`;

const blink = keyframes`
    50% {
        opacity: 0;
    }
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    text-align: center;
    background-color: white;
`;

const ThankYouMessage = styled.p`
    font-family: 'Goorm Sans', sans-serif;
    font-size: 1.8rem;
    font-weight: bold;
    color: #472C0B;
    margin-bottom: 30px;
    animation: ${fadeIn} 1s ease-out;
`;

const CardContainer = styled.div`
    width: 350px;
    height: 200px;
    perspective: 1000px;
    cursor: pointer;
    margin-bottom: 30px;
    animation: ${fadeIn} 1s ease-out;
    position: relative;
`;

const CardFront = styled.div`
    width: 100%;
    height: 100%;
    background-color: #932F6D;
    color: white;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    z-index: ${(props) => (props.flipped ? 0 : 1)};
    transform: ${(props) => (props.flipped ? 'rotateY(180deg)' : 'rotateY(0deg)')};
    transition: transform 0.6s ease-in-out;
`;

const CardBack = styled.div`
    width: 100%;
    height: 100%;
    background-color: #b44eb4;
    color: #333;
    border-radius: 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    backface-visibility: hidden;
    position: absolute;
    top: 0;
    left: 0;
    transform: ${(props) => (props.flipped ? 'rotateY(0deg)' : 'rotateY(-180deg)')};
    transition: transform 0.6s ease-in-out;
`;

const CardText = styled.h2`
    font-family: 'Edu VIC WA NT Beginner', sans-serif;
    font-size: 1.5rem;
    margin-bottom: 10px;
`;

const ClickPrompt = styled.p`
    font-family: 'Goorm Sans', sans-serif;
    font-size: 1.1rem;
    animation: ${blink} 1s infinite;
`;

const DetailsContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
`;

const DetailBlock = styled.div`
    background-color: #ffffff;
    width: 100%;
    padding: 20px;
    margin-bottom: 10px;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    display: flex;
    justify-content: space-between;
    align-items: center;
`;

const Label = styled.span`
    font-weight: bold;
    color: #8b4513;
    margin-right: 20px;
`;

const DetailValue = styled.span`
    color: #333;
    font-family: 'Goorm Sans', sans-serif;
`;

const LoginButton = styled(Link)`
    padding: 15px 150px;
    font-size: 1.3rem;
    color: white;
    background-color: #a97852;
    border: none;
    border-radius: 16px;
    text-decoration: none;
    cursor: pointer;
    transition: background-color 0.3s ease, transform 0.3s ease;
    animation: ${fadeIn} 1.4s ease-out;

    &:hover {
        background-color: #98511d;
        transform: scale(1.05);
    }
`;
