import { useState, useEffect } from 'react';
import './styles/App.css';
import { useAuth } from './context/AuthContext';

import NavBar from './components/NavBar';
import BottomNav from './components/BottomNav';
import TeaInfo from './pages/TeaInfo';
import Recipes from './pages/Recipes';
import MyTeas from './pages/MyTeas';
import RandomTea from './pages/RandomTea';
import Friends from './pages/Friends';
import BlogFAQ from './pages/BlogFAQ';
import Profile from './pages/Profile';
import Login from './components/Login';
import AdminDashboard from './pages/AdminDashboard';
import HomeFeed from './pages/HomeFeed';

function App() {
  const [activeModule, setActiveModule] = useState('teas');
  const { user, profile } = useAuth();

  useEffect(() => {
    if (user && (activeModule === 'login' || activeModule === 'signup')) {
      setActiveModule('teas');
    }
  }, [user, activeModule]);

  return (
    <div className="app-wrapper">
      <NavBar activeModule={activeModule} setActiveModule={setActiveModule} />
      <BottomNav
        active={activeModule}
        onNavigate={key => setActiveModule(key)}
      />
      <main className="tea-main">
        <section>
          {activeModule === 'home' && <HomeFeed />}
          {activeModule === 'teas' && <TeaInfo />}
          {activeModule === 'recipes' && <Recipes />}
          {activeModule === 'random' && <RandomTea />}
          {activeModule === 'tips' && <BlogFAQ />}

          {(!user && (activeModule === 'login' || activeModule === 'signup')) && <Login />}

          {user ? (
            <>
              {activeModule === 'myteas' && <MyTeas />}
              {activeModule === 'friends' && <Friends />}
              {activeModule === 'profile' && <Profile />}
              {activeModule === 'admin' && profile?.role === 'admin' && <AdminDashboard />}
            </>
          ) : (
            (activeModule === 'myteas' || activeModule === 'friends' || activeModule === 'profile' || activeModule === 'admin') && <Login />
          )}
        </section>
      </main>
    </div>
  );
}

export default App;