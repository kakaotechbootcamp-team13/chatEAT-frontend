import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { handleLogin, loading, error } = useAuth();
    const navigate = useNavigate();
    const [localError, setLocalError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!email) {
            setLocalError('이메일을 입력해주세요.');
            return;
        }

        if (!password) {
            setLocalError('비밀번호를 입력해주세요.');
            return;
        }

        const success = await handleLogin(email, password);
        if (success) {
            navigate('/dashboard');
        } else {
            setLocalError('아이디와 비밀번호를 확인해주세요.');
        }
    };

    return (
        <Container>
            <Link to="/">
                <Logo src="/src/assets/logo.png" alt="ChatEAT Logo" />
            </Link>
            <Link to="/">
                <Title>ChatEAT</Title>
            </Link>
            <InputContainer>
                <InputWrapper>
                    <InputField
                        type="email"
                        placeholder="이메일"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setLocalError('');
                        }}
                    />
                    <InputField
                        type="password"
                        placeholder="비밀번호"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setLocalError('');
                        }}
                    />
                </InputWrapper>
                <LoginButton onClick={handleSubmit} disabled={loading}>
                    {loading ? '로딩 중...' : '로그인'}
                </LoginButton>
                {(localError) && <ErrorMessage>{localError}</ErrorMessage>}
            </InputContainer>
            <LinksContainer>
                <StyledLink to="/reset-password">비밀번호 재설정</StyledLink>
                <StyledLink to="/register">회원가입</StyledLink>
            </LinksContainer>
            <KakaoLoginButton>
                <KakaoLoginImage src="/src/assets/kakaologinbutton.png" alt="카카오 로그인" />
            </KakaoLoginButton>
        </Container>
    );
};

export default Login;

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
    width: 130px;
    height: 130px;
`;

const Title = styled.h1`
    font-family: 'Edu VIC WA NT Beginner', sans-serif;
    color: #472C0B;
    font-size: 3rem;
    margin: 20px 0;
    cursor: pointer;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    width: 300px;
    margin-bottom: 20px;
    align-items: center;
`;

const InputWrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
`;

const InputField = styled.input`
    font-size: 1rem;
    height: 50px;
    padding: 10px;
    border: 1px solid rgba(160, 82, 45, 0.58);
    outline: none;
    transition: box-shadow 0.3s ease;

    &:focus {
        box-shadow: 0 0 8px rgba(160, 82, 45, 0.7);
    }

    &:first-child {
        border-top-left-radius: 12px;
        border-top-right-radius: 12px;
    }

    &:last-child {
        border-bottom-left-radius: 12px;
        border-bottom-right-radius: 12px;
        border-top: none;
    }
`;

const LoginButton = styled.button`
    font-family: 'Goorm Sans', sans-serif;
    background-color: #a1664d;
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 10px;
    cursor: pointer;
    font-size: 1.3rem;
    width: 100%;
    margin-top: 15px;
    transition: background-color 0.3s ease;
    &:hover {
        background-color: #8b4513;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 0.9rem;
    margin-top: 10px;
`;

const LinksContainer = styled.div`
    display: flex;
    justify-content: space-between;
    width: 200px;
    margin-bottom: 20px;
`;

const StyledLink = styled(Link)`
    font-size: 16px;
    color: #472C0B;
    text-decoration: none;
`;

const KakaoLoginButton = styled.button`
    width: 300px;
    padding: 0;
    border-radius: 12px;
    background: none;
    border: none;
    cursor: pointer;
`;

const KakaoLoginImage = styled.img`
    width: 100%;
    border-radius: 12px;
`;
