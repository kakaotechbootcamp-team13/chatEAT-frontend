import React, {useState} from 'react';
import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import {GlobalStyle} from './styles/global-styles';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterSuccess from "./pages/ResgisterSuccess.jsx";
import MyInfo from './pages/MyInfo';
import UpdateProfile from "./pages/UpdateProfile.jsx";
import ErrorPage from "./pages/Error.jsx";
import SocialRegister from "./pages/SocialRegister.jsx";
import KakaoLoginRedirect from "./pages/KakaoLoginRedirect.jsx";
import Admin from "./pages/Admin.jsx";
import RoleError from "./pages/RoleError.jsx";
import Like from "./pages/Like.jsx"
import {UserProvider} from './contexts/UserContext.jsx'; // UserProvider 가져오기

const App = () => {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const isAuthenticated = !!localStorage.getItem('accessToken');

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    return (
        <>
            <GlobalStyle/>
            <Router>
                <UserProvider>
                    <Routes>
                        <Route path="/" element={isAuthenticated ? <Navigate to="/dashboard"/> : <Home/>}/>
                        <Route path="/login" element={isAuthenticated ? <Navigate to="/dashboard"/> : <Login/>}/>
                        <Route path="/register" element={isAuthenticated ? <Navigate to="/dashboard"/> : <Register/>}/>
                        <Route path="/register-success" element={<RegisterSuccess/>}/>
                        <Route path="/members/oauth2/join" element={<SocialRegister/>}/>
                        <Route path="/kakao-login" element={<KakaoLoginRedirect/>}/>
                        <Route path="/dashboard" element={
                            <ProtectedRoute>
                                <Dashboard sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/myinfo" element={
                            <ProtectedRoute>
                                <MyInfo sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/update-profile" element={
                            <ProtectedRoute>
                                <UpdateProfile sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/admin" element={
                            <ProtectedRoute>
                                <Admin sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
                            </ProtectedRoute>
                        }/>
                        <Route path="/like" element={
                            <ProtectedRoute>
                                <Like sidebarOpen={sidebarOpen} toggleSidebar={toggleSidebar}/>
                            </ProtectedRoute>
                        }/>
                        <Route path="*" element={<ErrorPage/>}/>
                        <Route path="/role-error" element={<RoleError/>}/>
                    </Routes>
                </UserProvider>
            </Router>
        </>
    );
};

export default App;
