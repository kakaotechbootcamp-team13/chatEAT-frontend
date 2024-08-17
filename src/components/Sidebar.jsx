import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import {useNavigate} from 'react-router-dom';
import {logout} from '../services/authService.js';
import {getUserInfo} from '../services/memberService';

const Sidebar = ({open}) => {
    const [nickname, setNickname] = useState('');
    const [role, setRole] = useState('');
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
                <BottomButton onClick={handleLogout}>로그아웃</BottomButton>
            </BottomContainer>
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
