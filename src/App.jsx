import {BrowserRouter as Router, Navigate, Route, Routes} from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';
import {GlobalStyle} from './styles/global-styles';
import ProtectedRoute from './components/ProtectedRoute';
import RegisterSuccess from "./pages/ResgisterSuccess.jsx";
import MyInfo from './pages/MyInfo';
import {useState} from "react";
import UpdateProfile from "./pages/UpdateProfile.jsx";
import ErrorPage from "./pages/Error.jsx";
import SocialRegister from "./pages/SocialRegister.jsx";
import KakaoLoginRedirect from "./pages/KakaoLoginRedirect.jsx";
import Admin from "./pages/Admin.jsx";
import RoleError from "./pages/RoleError.jsx";

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
                    <Route path="/register-success" element={<RegisterSuccess/>}/>
                    <Route path="*" element={<ErrorPage/>}/>
                    <Route path="/role-error" element={<RoleError/>}/>
                </Routes>
            </Router>
        </>
    );
};

export default App;
