import React from 'react';
import styled from 'styled-components';
import {useNavigate} from "react-router-dom";

const RoleError = () => {

    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/');
    };

    return (
        <Container>
            <ErrorIcon>⚠️</ErrorIcon>
            <Title>접근 권한이 없습니다</Title>
            <Message>관리자만 접근 가능한 페이지입니다.</Message>
            <ButtonContainer>
                <Button onClick={handleGoHome}>홈으로 이동</Button>
            </ButtonContainer>
        </Container>
    );
};

export default RoleError;

// 스타일링 관련 코드
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: white;
`;

const ErrorIcon = styled.div`
    font-size: 50px;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    font-size: 36px;
    color: #a52a2a;
`;

const Message = styled.p`
    font-size: 18px;
    color: #333;
    margin-top: 20px;
`;

const ButtonContainer = styled.div`
    display: flex;
    gap: 20px;
`;

const Button = styled.button`
    padding: 10px 20px;
    font-size: 1rem;
    color: white;
    background-color: #a0522d;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #6f3710;
    }
`;
