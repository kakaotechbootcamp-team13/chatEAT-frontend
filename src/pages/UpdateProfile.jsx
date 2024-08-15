import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import {checkNickname, getUserInfo, updateNickname, updatePassword} from '../services/memberService';
import Sidebar from '../components/Sidebar';
import PropTypes from 'prop-types';

const UpdateProfile = ({sidebarOpen, toggleSidebar}) => {
    const [newNickname, setNewNickname] = useState('');
    const [nicknameError, setNicknameError] = useState('');
    const [showNicknameModal, setShowNicknameModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [beforePassword, setBeforePassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [passwordMatchError, setPasswordMatchError] = useState('');
    const [isPasswordValid, setIsPasswordValid] = useState(false);
    const [isNicknameValid, setIsNicknameValid] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isSocialUser, setIsSocialUser] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchUserInfo = async () => {
            try {
                const userInfo = await getUserInfo();
                setIsSocialUser(userInfo.socialType === 'KAKAO'); // 소셜 로그인 확인
            } catch (error) {
                console.error('사용자 정보를 가져오는데 실패했습니다.', error);
            }
        };

        fetchUserInfo();
    }, []);

    const handleNicknameChange = async (e) => {
        const nickname = e.target.value;
        setNewNickname(nickname);
        setNicknameError('');

        if (nickname.length >= 2 && nickname.length <= 20) {
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
        } else {
            setNicknameError('닉네임은 2자 이상 20자 이하로 입력해주세요.');
            setIsNicknameValid(false);
        }
    };

    const handleUpdateChange = async () => {
        if (!isNicknameValid) {
            setNicknameError('닉네임을 다시 확인해주세요.');
            return;
        }

        try {
            await updateNickname(newNickname);
            setSuccessMessage('닉네임 변경이 완료되었습니다.');
            setShowSuccessDialog(true);
            setShowNicknameModal(false);
        } catch (error) {
            setNicknameError('회원 정보 수정에 실패했습니다. 잠시 후 다시 시도해주세요.');
            console.error('회원 정보 수정 실패:', error);
        }
    };

    const handlePasswordUpdateClick = () => {
        setShowPasswordModal(true);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&?])[A-Za-z\d!@#$%^&?]{8,30}$/;
        return passwordRegex.test(password);
    };

    const handleNewPasswordChange = (e) => {
        const password = e.target.value;
        setNewPassword(password);

        if (!validatePassword(password)) {
            setPasswordError('영문, 숫자, 특수문자를 포함한 8자 이상의 비밀번호를 입력해주세요.');
            setIsPasswordValid(false);
        } else {
            setPasswordError('');
            setIsPasswordValid(true);
        }
    };

    const handlePasswordChange = async () => {
        if (beforePassword && newPassword && isPasswordValid) {
            if (beforePassword === newPassword) {
                setPasswordMatchError('기존 비밀번호와 일치합니다.');
                return;
            } else {
                setPasswordMatchError('');
            }
            try {
                await updatePassword(beforePassword, newPassword);
                setSuccessMessage('비밀번호 수정이 완료되었습니다.');
                setShowSuccessDialog(true);
                setShowPasswordModal(false);
            } catch (error) {
                setPasswordError('기존 비밀번호가 올바르지 않습니다. 다시 시도해주세요.');
                console.error('비밀번호 변경 실패:', error);
            }
        } else {
            setPasswordError('모든 값을 입력해주세요.');
        }
    };

    const handleCloseSuccessDialog = () => {
        setShowSuccessDialog(false);
        navigate('/myinfo');
    };

    return (
        <Container>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar}/>
            <Content className={sidebarOpen ? 'sidebar-open' : ''}>
                <Header>
                    <MenuButton onClick={toggleSidebar}>
                        {sidebarOpen ? '<<' : '☰'}
                    </MenuButton>
                    <Title>회원 정보 수정</Title>
                </Header>
                <FormWrapper>
                    <UpdateButton onClick={() => setShowNicknameModal(true)}>닉네임 변경하기</UpdateButton>
                    {!isSocialUser && (
                        <UpdateButton onClick={handlePasswordUpdateClick}>비밀번호 변경하기</UpdateButton>
                    )}
                </FormWrapper>

                {showNicknameModal && (
                    <ConfirmDialog>
                        <DialogContent>
                            <DialogTitle>닉네임 변경</DialogTitle>
                            <NicknameInput
                                type="text"
                                value={newNickname}
                                onChange={(e) => setNewNickname(e.target.value)}
                                onBlur={handleNicknameChange}
                                placeholder="변경할 닉네임을 입력하세요."
                            />
                            {nicknameError && <ErrorText isValid={isNicknameValid}>{nicknameError}</ErrorText>}
                            <DialogActions>
                                <DialogButton onClick={handleUpdateChange} disabled={!isNicknameValid}>확인</DialogButton>
                                <DialogButton onClick={() => setShowNicknameModal(false)}>취소</DialogButton>
                            </DialogActions>
                        </DialogContent>
                    </ConfirmDialog>
                )}

                {showPasswordModal && (
                    <ConfirmDialog>
                        <DialogContent>
                            <DialogTitle>비밀번호 변경</DialogTitle>
                            <PasswordInput
                                type="password"
                                value={beforePassword}
                                onChange={(e) => setBeforePassword(e.target.value)}
                                placeholder="기존 비밀번호를 입력하세요."
                            />
                            <PasswordInput
                                type="password"
                                value={newPassword}
                                onChange={handleNewPasswordChange}
                                placeholder="새로운 비밀번호를 입력하세요."
                            />
                            {passwordError && <ErrorText>{passwordError}</ErrorText>}
                            {passwordMatchError && <ErrorText>{passwordMatchError}</ErrorText>}
                            <DialogActions>
                                <DialogButton onClick={handlePasswordChange}
                                              disabled={!isPasswordValid}>확인</DialogButton>
                                <DialogButton onClick={() => setShowPasswordModal(false)}>취소</DialogButton>
                            </DialogActions>
                        </DialogContent>
                    </ConfirmDialog>
                )}

                {showSuccessDialog && (
                    <ConfirmDialog>
                        <DialogContent>
                            <DialogTitle>{successMessage}</DialogTitle>
                            <DialogActions>
                                <DialogButton onClick={handleCloseSuccessDialog}>닫기</DialogButton>
                            </DialogActions>
                        </DialogContent>
                    </ConfirmDialog>
                )}
            </Content>
        </Container>
    );
};

UpdateProfile.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

export default UpdateProfile;

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
    background-color: #fff;
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

const FormWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    padding: 20px;
    gap: 30px;
    background-color: #f9f9f9;
`;

const NicknameInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 20px;
    transition: box-shadow 0.3s ease;

    &:focus {
        box-shadow: 0 0 8px rgba(160, 82, 45, 0.7);
        outline: none;
    }
`;

const PasswordInput = styled.input`
    width: 100%;
    padding: 12px;
    border: 1px solid #ccc;
    border-radius: 5px;
    font-size: 16px;
    margin-bottom: 20px;
    transition: box-shadow 0.3s ease;

    &:focus {
        box-shadow: 0 0 8px rgba(160, 82, 45, 0.7);
        outline: none;
    }
`;

const UpdateButton = styled.button`
    width: 250px;
    height: 60px;
    font-size: 23px;
    color: white;
    background-color: #A0522DFF;
    border: none;
    border-radius: 12px;
    cursor: pointer;
    transition: background-color 0.3s ease;

    &:disabled {
        background-color: #ccc;
        cursor: not-allowed;
    }

    &:hover:enabled {
        background-color: #6F3710FF;
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
`;

const DialogContent = styled.div`
    width: 90%;
    max-width: 400px;
    padding: 20px;
    background-color: #fff;
    border-radius: 10px;
    text-align: center;
`;

const DialogTitle = styled.h2`
    font-size: 18px;
    color: #333;
    margin-bottom: 20px;
`;

const DialogActions = styled.div`
    display: flex;
    justify-content: center;
    gap: 10px; /* 버튼 사이의 간격을 줄임 */
`;

const DialogButton = styled.button`
    padding: 10px 30px;
    font-size: 14px;
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

const ErrorText = styled.p`
    color: ${(props) => (props.isValid ? 'green' : 'red')};
    font-size: 12px;
    margin-top: -10px;
    margin-bottom: 10px;
`;
