import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {withdraw, withdrawOAuth2} from '../services/authService';
import {getUserInfo} from '../services/memberService';

const MyInfo = ({sidebarOpen, toggleSidebar}) => {
    const [userInfo, setUserInfo] = useState({email: '', nickname: '', socialType: null});
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false); // 탈퇴 완료 모달 상태
    const [password, setPassword] = useState('');
    const [inputError, setInputError] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const data = await getUserInfo();
                setUserInfo({email: data.email, nickname: data.nickname, socialType: data.socialType, role: data.role});
            } catch (error) {
                console.error('사용자 정보를 가져오는데 실패했습니다.', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleWithdrawClick = () => {
        setShowConfirmDialog(true);
    };

    const handleConfirmWithdraw = async () => {
        try {
            if (userInfo.socialType === 'KAKAO') {
                if (password === userInfo.nickname) {
                    await withdrawOAuth2();
                } else {
                    setInputError('닉네임이 일치하지 않습니다.');
                    return;
                }
            } else {
                await withdraw(password);
            }
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            setShowConfirmDialog(false);
            setShowSuccessDialog(true); // 탈퇴 완료 모달 표시
        } catch (error) {
            setInputError('비밀번호를 확인해주세요.');
            console.error('회원 탈퇴 실패:', error);
        }
    };

    const handleCloseSuccessDialog = () => {
        setShowSuccessDialog(false);
        navigate('/');
    };

    const handleCancelWithdraw = () => {
        setShowConfirmDialog(false);
        setPassword('');
        setInputError('');
    };

    return (
        <Container>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar}/>
            <Content className={sidebarOpen ? 'sidebar-open' : ''}>
                <Header>
                    <MenuButton onClick={toggleSidebar}>
                        {sidebarOpen ? '<<' : '☰'}
                    </MenuButton>
                    <Title>내 정보</Title>
                </Header>
                <InfoWrapper>
                    <InfoTitle>회원 정보</InfoTitle>
                    <InfoContainer>
                        <InfoBox>
                            <InfoItem>
                                <Label>이메일:</Label>
                                <Value>{userInfo.email}</Value>
                            </InfoItem>
                            <InfoItem>
                                <Label>닉네임:</Label>
                                <Value>{userInfo.nickname}</Value>
                            </InfoItem>
                            {userInfo.socialType === 'KAKAO' && (
                                <InfoItem>
                                    <Label>소셜 로그인:</Label>
                                    <Value>카카오</Value>
                                </InfoItem>
                            )}
                            {userInfo.role === 'ROLE_ADMIN' && (
                                <InfoItem>
                                    <Label>역할:</Label>
                                    <Value>관리자</Value>
                                </InfoItem>
                            )}
                        </InfoBox>
                        <WithdrawButton onClick={handleWithdrawClick}>회원 탈퇴</WithdrawButton>
                    </InfoContainer>
                </InfoWrapper>

                {showConfirmDialog && (
                    <ConfirmDialog>
                        <DialogContent>
                            <DialogTitle>정말 회원 탈퇴를 하시겠습니까?</DialogTitle>
                            <InputLabel>
                                {userInfo.socialType === 'KAKAO' ? '닉네임 확인' : '비밀번호 확인'}
                            </InputLabel>
                            <DialogInput
                                type={userInfo.socialType === 'KAKAO' ? 'text' : 'password'}
                                placeholder={userInfo.socialType === 'KAKAO' ? '닉네임을 입력하세요.' : '비밀번호를 입력하세요.'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            {inputError && <ErrorText>{inputError}</ErrorText>}
                            <DialogActions>
                                <DialogButton onClick={handleConfirmWithdraw}>확인</DialogButton>
                                <DialogButton onClick={handleCancelWithdraw}>취소</DialogButton>
                            </DialogActions>
                        </DialogContent>
                    </ConfirmDialog>
                )}

                {showSuccessDialog && (
                    <ModalOverlay onClick={handleCloseSuccessDialog}>
                        <DialogContent onClick={(e) => e.stopPropagation()}>
                            <DialogTitle>탈퇴가 완료되었습니다.</DialogTitle>
                            <DialogActions>
                                <DialogButton onClick={handleCloseSuccessDialog}>확인</DialogButton>
                            </DialogActions>
                        </DialogContent>
                    </ModalOverlay>
                )}
            </Content>
        </Container>
    );
};

MyInfo.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

export default MyInfo;

// 스타일링 관련 코드
const Container = styled.div`
    display: flex;
    height: 100vh;
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
    background-color: #ffffff;
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

const Title = styled.h1`
    margin-left: 10px;
    font-size: 24px;
    font-weight: bold;
    color: #472C0B;
`;

const InfoWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #ffffff;
`;

const InfoTitle = styled.h2`
    margin-bottom: 20px;
    font-size: 24px;
    color: #472C0B;
`;

const InputLabel = styled.p`
    font-size: 14px;
    color: #555;
    margin-bottom: 10px;
`;

const InfoContainer = styled.div`
    width: 100%;
    max-width: 500px;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #ffffff;
`;

const InfoBox = styled.div`
    width: 100%;
    max-width: 500px;
    padding: 20px;
    background-color: #ffffff;
    border-radius: 15px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    transform: scale(1);
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    position: relative;

    &:hover {
        transform: scale(1.05);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
`;

const InfoItem = styled.div`
    margin-bottom: 20px;
    font-size: 1.2rem;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid #ddd;
    padding-bottom: 10px;
`;

const Label = styled.span`
    font-weight: bold;
    color: #8b4513;
`;

const Value = styled.span`
    color: #333;
    font-family: 'Goorm Sans', sans-serif;
`;

const WithdrawButton = styled.button`
    font-size: 14px;
    color: #a52a2a;
    background: none;
    border: none;
    cursor: pointer;
    align-self: flex-end;
    margin-top: 15px;

    &:hover {
        color: #ff0000;
    }
`;

const ConfirmDialog = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;

const DialogContent = styled.div`
    width: 90%;
    max-width: 400px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
    z-index: 1001;
`;

const DialogTitle = styled.h2`
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
`;

const DialogInput = styled.input`
    width: 100%;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-bottom: 20px;
`;

const DialogActions = styled.div`
    display: flex;
    justify-content: center;
    gap: 20px;
`;

const DialogButton = styled.button`
    padding: 10px 30px;
    font-size: 14px;
    color: white;
    background-color: #A1664D;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #8b4513;
    }
`;

const ErrorText = styled.p`
    color: red;
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 10px;
`;

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 1000;
`;
