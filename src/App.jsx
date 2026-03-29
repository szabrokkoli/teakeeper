import { useEffect } from 'react';
import './styles/App.css';
import { useAuth } from './context/AuthContext';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import NavBar from './components/commons/NavBar';
import BottomNav from './components/commons/BottomNav';
import TeaInfo from './pages/TeaInfo';
import Recipes from './pages/Recipes';
import MyTeas from './pages/MyTeas';
import RandomTea from './pages/RandomTea';
import Friends from './pages/Friends';
import Tips from './pages/Tips';
import Profile from './pages/Profile';
import UserProfilePage from './pages/UserProfilePage';
import Login from './components/commons/Login';
import AdminDashboard from './pages/AdminDashboard';
import HomeFeed from './pages/HomeFeed';
import ResetPassword from './pages/ResetPassword';

function App() {
  const { user, profile } = useAuth();
  return (
    <Router>
      <div className="app-wrapper">
        <NavBar />
        <BottomNav />
        <main className="tea-main">
          <Routes>
            <Route path="/" element={<HomeFeed />} />
            <Route path="/teas" element={<TeaInfo />} />
            <Route path="/recipes" element={<Recipes />} />
            <Route path="/random" element={<RandomTea />} />
            <Route path="/tips" element={<Tips />} />
            <Route path="/login" element={<Login />} />
            <Route path="/myteas" element={user ? <MyTeas /> : <Navigate to="/login" />} />
            <Route path="/friends" element={user ? <Friends /> : <Navigate to="/login" />} />
            <Route path="/profile" element={user ? <Profile /> : <Navigate to="/login" />} />
            <Route path="/user/:id" element={<UserProfilePage />} />
            <Route path="/admin" element={user && profile?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/" />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            {/* 404 fallback */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;