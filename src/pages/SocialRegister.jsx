import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useLocation, useNavigate} from 'react-router-dom';
import {checkNickname, joinOAuth2} from '../services/memberService';

const SocialRegister = () => {
    const [nickname, setNickname] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [localError, setLocalError] = useState('');
    const [isNicknameValid, setIsNicknameValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const location = useLocation();
    const navigate = useNavigate();

    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get('email');
    const role = queryParams.get('role');

    useEffect(() => {
        let accessToken = queryParams.get('accessToken');

        if (accessToken && accessToken.startsWith('Bearer ')) {
            accessToken = accessToken.split(' ')[1];
        }

        if (role !== 'ROLE_GUEST') {
            navigate('/error');
        }

        if (accessToken) localStorage.setItem('accessToken', accessToken);
    }, [role, navigate, queryParams]);

    const handleNicknameBlur = async () => {
        if (nickname.length < 2 || nickname.length > 20) {
            setNicknameError('닉네임은 2자 이상 20자 이하로 입력해주세요.');
            setIsNicknameValid(false);
        } else {
            try {
                const isDuplicate = await checkNickname(nickname);
                if (isDuplicate) {
                    setNicknameError('이미 사용 중인 닉네임입니다.');
                    setIsNicknameValid(false);
                } else {
                    setNicknameError('사용 가능한 닉네임입니다.');
                    setIsNicknameValid(true);
                }
            } catch (error) {
                console.error('닉네임 중복 확인 오류:', error);
                setNicknameError('닉네임 확인 중 오류가 발생했습니다.');
                setIsNicknameValid(false);
            }
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isNicknameValid) {
            return;
        }
        try {
            setIsSubmitting(true);
            await joinOAuth2({email, nickname});
            navigate('/register-success', {state: {email, nickname}});
        } catch (error) {
            setLocalError('회원가입 중 오류가 발생했습니다.');
            console.error('회원가입 오류:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <LogoContainer>
                <Title>ChatEAT 소셜 회원가입</Title>
            </LogoContainer>
            <FormContainer onSubmit={handleSubmit}>
                <FormField>
                    <Label>이메일</Label>
                    <DisabledInput value={email} disabled/>
                </FormField>
                <NicknameFormField>
                    <Label>닉네임</Label>
                    <NicknameHint>다른 유저와 겹치지 않도록 입력해주세요. (2~20자)</NicknameHint>
                    <Input
                        type="text"
                        value={nickname}
                        onChange={(e) => setNickname(e.target.value)}
                        placeholder="닉네임을 입력하세요."
                        onBlur={handleNicknameBlur}
                    />
                    {nicknameError && (
                        <ErrorText isValid={isNicknameValid}>
                            {nicknameError}
                        </ErrorText>
                    )}
                </NicknameFormField>
                <SubmitButton onClick={handleSubmit} disabled={!isNicknameValid || isSubmitting}>
                    {isSubmitting ? '로딩 중...' : '회원가입'}
                </SubmitButton>
                {localError && <ErrorMessage>{localError}</ErrorMessage>}
            </FormContainer>
        </Container>
    );
};

export default SocialRegister;

// 스타일링 관련 코드
const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100vh;
    background-color: white;
`;

const LogoContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 20px;
`;

const Title = styled.h1`
    font-family: 'Edu VIC WA NT Beginner', sans-serif;
    font-size: 36px;
    color: #472C0B;
    margin-top: 10px;
`;

const FormContainer = styled.form`
    width: 400px;
    display: flex;
    flex-direction: column;
`;

const FormField = styled.div`
    margin-bottom: 30px;
`;

const NicknameFormField = styled.div`
    margin-bottom: 25px;
`;

const Label = styled.label`
    font-family: 'Goorm Sans', sans-serif;
    font-size: 16px;
    font-weight: bold;
    color: #333;
    margin-bottom: 10px;
    display: block;
`;

const DisabledInput = styled.input`
    width: 100%;
    padding: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    font-family: 'Goorm Sans', sans-serif;
    background-color: #f5f5f5;
    color: #999;
    box-sizing: border-box;
`;

const Input = styled.input`
    width: 100%;
    padding: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 14px;
    font-family: 'Goorm Sans', sans-serif;
    box-sizing: border-box;
    transition: box-shadow 0.3s ease;

    &:focus {
        box-shadow: 0 0 8px rgba(160, 82, 45, 0.7);
        outline: none;
    }
`;

const NicknameHint = styled.p`
    font-size: 14px;
    color: #888;
    margin-top: 5px;
`;

const ErrorText = styled.p`
    color: ${(props) => (props.isValid ? 'green' : 'red')};
    font-size: 12px;
    margin-top: 5px;
`;

const SubmitButton = styled.button`
    padding: 15px;
    font-size: 20px;
    color: white;
    background-color: #8b4513;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    &:hover:enabled {
        background-color: #A0522D;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 0.9rem;
    margin-top: 10px;
`;
