import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import {useNavigate} from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {changeUserRole, deleteMember, getAllMembers} from '../services/adminService';
import {getUserInfo} from '../services/memberService';
import PropTypes from 'prop-types';

const Admin = ({sidebarOpen, toggleSidebar}) => {
    const [members, setMembers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [selectedRole, setSelectedRole] = useState({});
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const [showDeleteSuccessDialog, setShowDeleteSuccessDialog] = useState(false);
    const [showErrorDialog, setShowErrorDialog] = useState(false);
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [deleteMemberId, setDeleteMemberId] = useState(null);
    const [deleteMemberNickname, setDeleteMemberNickname] = useState('');
    const [currentUserId, setCurrentUserId] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const userInfo = await getUserInfo();
                if (userInfo.role !== 'ROLE_ADMIN') {
                    navigate('/role-error');
                }
                setCurrentUserId(userInfo.id);
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                navigate('/error');
            }
        };

        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        fetchMembers();
    }, [page]);

    const fetchMembers = async () => {
        try {
            const response = await getAllMembers(page);
            setMembers(response.data.members || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Failed to fetch members:', error);
        }
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    const handleRoleSelect = (memberId, role) => {
        setSelectedRole((prevSelectedRole) => ({
            ...prevSelectedRole,
            [memberId]: role,
        }));
    };

    const handleRoleChange = async (memberId) => {
        const newRole = selectedRole[memberId];
        if (newRole) {
            try {
                await changeUserRole(memberId, newRole);
                setMembers(members.map(member =>
                    member.id === memberId ? {...member, role: newRole} : member
                ));
                clearSelectionAndDialogs();
                setShowSuccessDialog(true);
            } catch (error) {
                console.error('Failed to change role:', error);
                setShowErrorDialog(true);
            }
        }
    };

    const handleDeleteMember = async () => {
        if (deleteMemberId !== null) {
            try {
                await deleteMember(deleteMemberId);
                setMembers(members.filter(member => member.id !== deleteMemberId));
                clearSelectionAndDialogs();
                setShowDeleteSuccessDialog(true); // 삭제 성공 모달 표시
            } catch (error) {
                console.error('Failed to delete member:', error);
                setShowErrorDialog(true);
            }
        }
    };

    const confirmDeleteMember = (memberId, memberRole, memberNickname) => {
        if (memberRole === 'ADMIN') {
            alert('관리자 계정은 삭제할 수 없습니다.');
        } else {
            setDeleteMemberId(memberId);
            setDeleteMemberNickname(memberNickname);
            setShowDeleteDialog(true);
        }
    };

    const handleCloseDeleteDialog = () => {
        setShowDeleteDialog(false);
        setDeleteMemberId(null);
        setDeleteMemberNickname('');
    };

    const clearSelectionAndDialogs = () => {
        setShowDeleteDialog(false);
        setShowSuccessDialog(false);
        setShowDeleteSuccessDialog(false);
        setShowErrorDialog(false);
        setDeleteMemberId(null);
        setDeleteMemberNickname('');
        setSelectedRole({});
    };

    return (
        <Container>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar}/>
            <Content className={sidebarOpen ? 'sidebar-open' : ''}>
                <Header>
                    <MenuButton onClick={toggleSidebar}>
                        {sidebarOpen ? '<<' : '☰'}
                    </MenuButton>
                    <Title>관리자 페이지</Title>
                </Header>
                <MembersWrapper>
                    <MembersTable>
                        <thead>
                        <tr>
                            <TableHeader>ID</TableHeader>
                            <TableHeader>이메일</TableHeader>
                            <TableHeader>닉네임</TableHeader>
                            <TableHeader>역할</TableHeader>
                            <TableHeader>역할 변경</TableHeader>
                            <TableHeader>삭제</TableHeader>
                        </tr>
                        </thead>
                        <tbody>
                        {members.length > 0 ? (
                            members.map((member) => (
                                <TableRow key={member.id}>
                                    <TableData>{member.id}</TableData>
                                    <TableData>{member.email}</TableData>
                                    <TableData>{member.nickname}</TableData>
                                    <TableData>{member.role}</TableData>
                                    <TableData>
                                        <RoleChangeWrapper>
                                            <RoleSelect
                                                value={selectedRole[member.id] || member.role}
                                                onChange={(e) =>
                                                    handleRoleSelect(member.id, e.target.value)
                                                }
                                                disabled={member.id === currentUserId}
                                            >
                                                <option value="ADMIN">ADMIN</option>
                                                <option value="USER">USER</option>
                                            </RoleSelect>
                                            <ConfirmButton
                                                onClick={() => handleRoleChange(member.id)}
                                                disabled={member.id === currentUserId}
                                            >
                                                확인
                                            </ConfirmButton>
                                        </RoleChangeWrapper>
                                    </TableData>
                                    <TableData>
                                        {member.id !== currentUserId && (
                                            <DeleteButton
                                                onClick={() => confirmDeleteMember(member.id, member.role, member.nickname)}>
                                                삭제
                                            </DeleteButton>
                                        )}
                                    </TableData>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableData colSpan="6">회원 정보가 없습니다.</TableData>
                            </TableRow>
                        )}
                        </tbody>
                    </MembersTable>
                    <Pagination>
                        <PaginationButton onClick={() => handlePageChange(page - 1)} disabled={page === 1}>
                            이전
                        </PaginationButton>
                        <PageInfo>
                            {page} / {totalPages}
                        </PageInfo>
                        <PaginationButton onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>
                            다음
                        </PaginationButton>
                    </Pagination>
                </MembersWrapper>

                {showSuccessDialog && (
                    <ModalOverlay onClick={clearSelectionAndDialogs}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <DialogTitle>변경이 완료되었습니다.</DialogTitle>
                            <DialogActions>
                                <DialogButton onClick={clearSelectionAndDialogs}>확인</DialogButton>
                            </DialogActions>
                        </ModalContent>
                    </ModalOverlay>
                )}

                {showDeleteDialog && (
                    <ModalOverlay onClick={handleCloseDeleteDialog}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <DialogTitle>정말 {deleteMemberNickname} 회원을 삭제하시겠습니까?</DialogTitle>
                            <DialogActions>
                                <DialogButton onClick={handleDeleteMember}>확인</DialogButton>
                                <DialogButton onClick={handleCloseDeleteDialog}>취소</DialogButton>
                            </DialogActions>
                        </ModalContent>
                    </ModalOverlay>
                )}

                {showDeleteSuccessDialog && (
                    <ModalOverlay onClick={clearSelectionAndDialogs}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <DialogTitle>삭제가 완료되었습니다.</DialogTitle>
                            <DialogActions>
                                <DialogButton onClick={clearSelectionAndDialogs}>확인</DialogButton>
                            </DialogActions>
                        </ModalContent>
                    </ModalOverlay>
                )}

                {showErrorDialog && (
                    <ModalOverlay onClick={clearSelectionAndDialogs}>
                        <ModalContent onClick={(e) => e.stopPropagation()}>
                            <DialogTitle>오류가 발생했습니다. 다시 시도해주세요.</DialogTitle>
                            <DialogActions>
                                <DialogButton onClick={clearSelectionAndDialogs}>확인</DialogButton>
                            </DialogActions>
                        </ModalContent>
                    </ModalOverlay>
                )}
            </Content>
        </Container>
    );
};

Admin.propTypes = {
    sidebarOpen: PropTypes.bool.isRequired,
    toggleSidebar: PropTypes.func.isRequired,
};

export default Admin;

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

const MembersWrapper = styled.div`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 20px;
    background-color: #f9f9f9;
`;

const MembersTable = styled.table`
    width: 100%;
    max-width: 800px;
    border-collapse: collapse;
    margin-bottom: 20px;
`;

const TableHeader = styled.th`
    padding: 10px;
    border-bottom: 2px solid #ddd;
    font-size: 16px;
    color: #472C0B;
`;

const TableRow = styled.tr`
    &:hover {
        background-color: #f1f1f1;
    }
`;

const TableData = styled.td`
    padding: 10px;
    border-bottom: 1px solid #ddd;
    text-align: center;
`;

const RoleChangeWrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const RoleSelect = styled.select`
    padding: 5px;
    font-size: 14px;
    margin-right: 10px;
    border-radius: 5px;
    border: 1px solid #ccc;
`;

const ConfirmButton = styled.button`
    padding: 8px 12px;
    font-size: 14px;
    color: white;
    background-color: #6c757d;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: #5a6268;
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const DeleteButton = styled.button`
    padding: 8px 12px;
    font-size: 14px;
    color: white;
    background-color: #d9534f;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:hover {
        background-color: #c9302c;
    }
`;

const Pagination = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

const PaginationButton = styled.button`
    padding: 10px 20px;
    margin: 0 10px;
    font-size: 16px;
    color: #472C0B;
    background-color: transparent;
    border: 2px solid #472C0B;
    border-radius: 5px;
    cursor: pointer;
    transition: background-color 0.3s ease-in-out;

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
    }

    &:hover:not(:disabled) {
        background-color: #f1f1f1;
    }
`;

const PageInfo = styled.div`
    font-size: 16px;
    color: #472C0B;
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

const ModalContent = styled.div`
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
