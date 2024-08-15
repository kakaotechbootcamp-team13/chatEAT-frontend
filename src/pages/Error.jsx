import React from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';

const ErrorPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // 홈으로 이동
    };

    return (
        <Container>
            <ErrorIcon>⚠️</ErrorIcon>
            <ErrorMessage>오류가 발생했습니다.</ErrorMessage>
            <ErrorDescription>문제가 발생하여 페이지를 표시할 수 없습니다. 새로고침하거나 관리자에게 문의해주세요.</ErrorDescription>
            <ButtonContainer>
                <Button onClick={handleGoHome}>홈으로 이동</Button>
            </ButtonContainer>
        </Container>
    );
};

export default ErrorPage;

// 스타일링 관련 코드
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: #f9f9f9;
    padding: 20px;
    text-align: center;
`;

const ErrorIcon = styled.div`
    font-size: 50px;
    margin-bottom: 20px;
`;

const ErrorMessage = styled.h1`
    font-size: 2.5rem;
    color: #d9534f;
    margin-bottom: 10px;
`;

const ErrorDescription = styled.p`
    font-size: 1.2rem;
    color: #555;
    margin-bottom: 30px;
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

