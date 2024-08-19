import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {logout} from '../services/authService.js';
import {getUserInfo} from '../services/memberService';

const Sidebar = ({open}) => {
    const [nickname, setNickname] = useState('');
    const [role, setRole] = useState('');
    const [showLogoutDialog, setShowLogoutDialog] = useState(false); // 로그아웃 확인 모달 상태
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserInfo();
                setNickname(userInfo.nickname);
                setRole(userInfo.role);  // role 정보를 가져와서 저장
            } catch (error) {
                console.error('사용자 정보를 가져오는데 실패했습니다.', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
            window.location.reload();
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    const handleLogoutClick = () => {
        setShowLogoutDialog(true); // 로그아웃 확인 모달 표시
    };

    const handleCancelLogout = () => {
        setShowLogoutDialog(false); // 로그아웃 확인 모달 닫기
    };

    const goToMyInfo = () => {
        navigate('/myinfo');
    };

    const goToChat = () => {
        navigate('/dashboard');
    };

    const goToUpdate = () => {
        navigate('/update-profile');
    };

    const goToAdminPage = () => {
        navigate('/admin');  // 관리자 페이지로 이동
    };

    return (
        <SidebarContainer open={open}>
            <UserProfile>
                <Avatar/>
                <UserName>{nickname}</UserName>
            </UserProfile>
            <SidebarMenu>
                <SidebarButton onClick={goToChat}>채팅</SidebarButton>
                <SidebarButton>보관함</SidebarButton>
                <SidebarButton>좋아요</SidebarButton>
                <SidebarButton onClick={goToMyInfo}>내 정보</SidebarButton>
                {role === 'ROLE_ADMIN' && (
                    <SidebarButton onClick={goToAdminPage}>관리자 페이지</SidebarButton>
                )}
            </SidebarMenu>
            <BottomContainer>
                <BottomButton onClick={goToUpdate}>회원 정보 수정</BottomButton>
                <BottomButton onClick={handleLogoutClick}>로그아웃</BottomButton>
            </BottomContainer>

            {showLogoutDialog && (
                <ModalOverlay onClick={handleCancelLogout}>
                    <DialogContent onClick={(e) => e.stopPropagation()}>
                        <DialogTitle>로그아웃 하시겠습니까?</DialogTitle>
                        <DialogActions>
                            <DialogButton onClick={handleLogout}>확인</DialogButton>
                            <DialogButton onClick={handleCancelLogout}>취소</DialogButton>
                        </DialogActions>
                    </DialogContent>
                </ModalOverlay>
            )}
        </SidebarContainer>
    );
};

Sidebar.propTypes = {
    open: PropTypes.bool.isRequired,
};

export default Sidebar;

// 스타일링 관련 코드
const SidebarContainer = styled.div`
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
    margin-bottom: auto;
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

const BottomContainer = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-top: auto;
    margin-bottom: 16px;
`;

const BottomButton = styled.button`
    width: 80%;
    margin-bottom: 10px;
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

const ModalOverlay = styled.div`
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
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
    position: relative;
`;

const DialogTitle = styled.h2`
    font-size: 20px;
    color: #333;
    margin-bottom: 20px;
`;

const DialogActions = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px;
`;

const DialogButton = styled.button`
    padding: 10px 20px;
    font-size: 16px;
    color: white;
    background-color: #A0522DFF;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:hover {
        background-color: #6F3710FF;
    }
`;
