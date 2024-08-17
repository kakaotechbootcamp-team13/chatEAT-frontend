import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import { getAllMembers } from '../services/adminService';
import { getUserInfo } from '../services/memberService';
import PropTypes from 'prop-types';

const Admin = ({ sidebarOpen, toggleSidebar }) => {
    const [members, setMembers] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdmin = async () => {
            try {
                const userInfo = await getUserInfo();
                if (userInfo.role !== 'ROLE_ADMIN') {
                    navigate('/role-error');
                }
            } catch (error) {
                console.error('Failed to fetch user info:', error);
                navigate('/error');
            }
        };

        checkAdmin();
    }, [navigate]);

    useEffect(() => {
        const fetchMembers = async () => {
            try {
                const response = await getAllMembers(page);
                setMembers(response.data.members || []);
                setTotalPages(response.data.totalPages || 0);
            } catch (error) {
                console.error('Failed to fetch members:', error);
            }
        };

        fetchMembers();
    }, [page]);

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= totalPages) {
            setPage(newPage);
        }
    };

    return (
        <Container>
            <Sidebar open={sidebarOpen} toggleSidebar={toggleSidebar} />
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
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableData colSpan="4">회원 정보가 없습니다.</TableData>
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
