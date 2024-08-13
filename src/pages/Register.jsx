import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import {checkEmail, checkNickname, join} from '../services/memberService';

const emailDomains = [
    'naver.com',
    'hanmail.net',
    'daum.net',
    'gmail.com',
    'nate.com',
    '직접 입력'
];

const Register = () => {
    const [emailLocalPart, setEmailLocalPart] = useState('');
    const [emailDomain, setEmailDomain] = useState(emailDomains[0]);
    const [customDomain, setCustomDomain] = useState('');
    const [nickname, setNickname] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailError, setEmailError] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [localError, setLocalError] = useState('');
    const [confirmPasswordError, setConfirmPasswordError] = useState('');
    const [isEmailValid, setIsEmailValid] = useState(false);
    const [isNicknameValid, setIsNicknameValid] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    const email = `${emailLocalPart}@${emailDomain === '직접 입력' ? customDomain : emailDomain}`;

    const validatePassword = () => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&?])[A-Za-z\d!@#$%^&?]{8,30}$/;
        if (!passwordRegex.test(password)) {
            setPasswordError('영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.');
            return false;
        } else {
            setPasswordError('');
            return true;
        }
    };

    const validateConfirmPassword = () => {
        if (confirmPassword && password !== confirmPassword) {
            setConfirmPasswordError('비밀번호가 다릅니다.');
            return false;
        } else {
            setConfirmPasswordError('');
            return true;
        }
    };

    const validateNickname = () => {
        if (nickname.length < 2 || nickname.length > 20) {
            setNicknameError('닉네임은 2자 이상 20자 이하로 입력해주세요.');
            setIsNicknameValid(false);
            return false;
        } else {
            setNicknameError('');
            return true;
        }
    };

    const handleEmailBlur = async () => {
        if (emailLocalPart && (emailDomain || customDomain)) {
            try {
                const response = await checkEmail(email);
                if (response.check) {
                    setEmailError(
                        response.socialType === 'kakao'
                            ? '이미 카카오로 가입된 이메일입니다.'
                            : '이미 가입된 이메일입니다.'
                    );
                    setIsEmailValid(false);
                } else {
                    setEmailError('사용 가능한 이메일입니다.');
                    setIsEmailValid(true);
                }
            } catch (error) {
                console.error('이메일 중복 확인 오류:', error);
                setEmailError('이메일 확인 중 오류가 발생했습니다.');
                setIsEmailValid(false);
            }
        }
    };

    const handleNicknameBlur = async () => {
        if (validateNickname()) {
            try {
                const response = await checkNickname(nickname);
                if (response) {
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

    const handleDomainChange = (e) => {
        const selectedDomain = e.target.value;
        setEmailDomain(selectedDomain);
        if (selectedDomain !== '직접 입력') {
            setCustomDomain('');
        }
    };

    const handlePasswordBlur = () => {
        validatePassword();
    };

    const handleConfirmPasswordBlur = () => {
        validateConfirmPassword();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isEmailValid || !isNicknameValid || passwordError || confirmPasswordError) {
            return;
        }
        try {
            setIsSubmitting(true);
            const response = await join({ email, password, nickname });
            navigate('/register-success', { state: { email: response.email, nickname: response.nickname } });
        } catch (error) {
            setLocalError('회원가입 중 오류가 발생했습니다.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Container>
            <LogoContainer>
                <Link to={"/"}>
                    <Logo src="/src/assets/logo.png" alt="ChatEAT Logo" />
                </Link>
                <Link to={"/"}>
                    <Title>ChatEAT</Title>
                </Link>
            </LogoContainer>
            <FormContainer onSubmit={handleSubmit}>
                <FormField>
                    <Label>이메일</Label>
                    <EmailContainer>
                        <EmailInput
                            type="text"
                            value={emailLocalPart}
                            onChange={(e) => setEmailLocalPart(e.target.value)}
                            placeholder="이메일을 입력하세요."
                            onBlur={handleEmailBlur}
                        />
                        <EmailSeparator>@</EmailSeparator>
                        {emailDomain === '직접 입력' ? (
                            <CustomDomainInput
                                type="text"
                                value={customDomain}
                                onChange={(e) => setCustomDomain(e.target.value)}
                                placeholder="입력하세요."
                                onBlur={handleEmailBlur}
                            />
                        ) : (
                            <EmailDomainSelect
                                value={emailDomain}
                                onChange={handleDomainChange}
                            >
                                {emailDomains.map((domain) => (
                                    <option key={domain} value={domain}>
                                        {domain}
                                    </option>
                                ))}
                            </EmailDomainSelect>
                        )}
                    </EmailContainer>
                    {emailError && (
                        <ErrorText isValid={isEmailValid}>
                            {emailError}
                        </ErrorText>
                    )}
                </FormField>
                <FormField>
                    <Label>비밀번호</Label>
                    <PasswordHint>영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.</PasswordHint>
                    <Input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="비밀번호를 입력하세요."
                        onBlur={handlePasswordBlur}
                    />
                    {passwordError && <ErrorText isValid={false}>{passwordError}</ErrorText>}
                </FormField>
                <FormField>
                    <Label>비밀번호 확인</Label>
                    <Input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="비밀번호를 재입력하세요."
                        onBlur={handleConfirmPasswordBlur}
                    />
                    {confirmPasswordError && <ErrorText isValid={false}>{confirmPasswordError}</ErrorText>}
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
                <SubmitButton onClick={handleSubmit} disabled={!isEmailValid || !isNicknameValid || passwordError || confirmPasswordError || isSubmitting}>
                    {isSubmitting ? '로딩 중...' : '회원가입'}
                </SubmitButton>
                {localError && <ErrorMessage>{localError}</ErrorMessage>}
            </FormContainer>
        </Container>
    );
};

export default Register;

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

const Logo = styled.img`
    height: 100px;
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

const EmailContainer = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
`;

const EmailInput = styled.input`
    width: 100%;
    padding: 14px;
    border: 1px solid #ccc;
    border-radius: 5px 0 0 5px;
    font-size: 14px;
    font-family: 'Goorm Sans', sans-serif;
    box-sizing: border-box;
    transition: box-shadow 0.3s ease;

    &:focus {
        box-shadow: 0 0 8px rgba(160, 82, 45, 0.7);
        outline: none;
    }
`;

const EmailSeparator = styled.span`
    padding: 0 8px;
    font-size: 14px;
`;

const EmailDomainSelect = styled.select`
    width: 80%;
    padding: 14px;
    border: 1px solid #ccc;
    border-radius: 0 5px 5px 0;
    font-size: 14px;
    font-family: 'Goorm Sans', sans-serif;
    background-color: white;
    transition: box-shadow 0.3s ease;

    &:focus {
        box-shadow: 0 0 8px rgba(160, 82, 45, 0.7);
        outline: none;
    }
`;

const CustomDomainInput = styled.input`
    width: 80%;
    padding: 14px;
    border: 1px solid #ccc;
    border-radius: 0 5px 5px 0;
    font-size: 14px;
    font-family: 'Goorm Sans', sans-serif;
    box-sizing: border-box;
    transition: box-shadow 0.3s ease;

    &:focus {
        box-shadow: 0 0 8px rgba(160, 82, 45, 0.7);
        outline: none;
    }
`;

const ErrorMessage = styled.p`
    color: red;
    font-size: 0.9rem;
    margin-top: 10px;
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

const PasswordHint = styled.p`
    font-size: 14px;
    color: #888;
    margin-top: 5px;
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
