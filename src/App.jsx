
import { useState } from 'react';
import { FaUser, FaMugHot, FaUsers } from 'react-icons/fa';
import logo from './assets/logo.png';
import './App.css';
import TeaInfo from './modules/TeaInfo';
import Recipes from './modules/Recipes';
import MyTeas from './modules/MyTeas';
import RandomTea from './modules/RandomTea';
import Friends from './modules/Friends';
import BlogFAQ from './modules/BlogFAQ';
import Profile from './modules/Profile';


// Navigation bar as a subcomponent
function NavBar({ activeModule, setActiveModule }) {
  const navItems = [
    { key: 'teas', label: 'Explore Teas' },
    { key: 'recipes', label: 'Tea Mixes' },
    { key: 'random', label: 'Pick Me a Tea' },
    { key: 'blog', label: 'Tea Tips' },
    { key: 'login', label: 'Log in', extraClass: 'button-login' },
    { key: 'signup', label: 'Sign up', extraClass: 'button-signup' },
    { key: 'friends', label: 'Tea Friends', icon: <FaUsers style={{ marginRight: 4, verticalAlign: 'middle' }} /> },
    { key: 'myteas', label: 'My Teas', icon: <FaMugHot style={{ marginRight: 4, verticalAlign: 'middle' }} /> },
    { key: 'profile', label: 'Profile', icon: <FaUser style={{ marginRight: 4, verticalAlign: 'middle' }} /> },
  ];

  return (
    <nav className="toolbar" style={{ display: 'flex', alignItems: 'center' }}>
      <img src={logo} alt="TeaKeeper Logo" style={{ height: 64, marginRight: 24, display: 'block' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        {navItems.map(({ key, label, icon, extraClass }) => (
          <button
            key={key}
            className={`button button-secondary${activeModule === key ? ' button-primary' : ''}${extraClass ? ' ' + extraClass : ''}`}
            onClick={() => setActiveModule(key)}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          >
            {icon && <span style={{ display: 'flex', alignItems: 'center' }}>{icon}</span>}
            <span style={{ display: 'flex', alignItems: 'center' }}>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
}

function App() {
  const [activeModule, setActiveModule] = useState('teas');

  return (
    <main className="tea-main">
      <NavBar activeModule={activeModule} setActiveModule={setActiveModule} />
      <section style={{ marginTop: 'var(--space-6)' }}>
        {activeModule === 'teas' && <TeaInfo />}
        {activeModule === 'recipes' && <Recipes />}
        {activeModule === 'myteas' && <MyTeas />}
        {activeModule === 'random' && <RandomTea />}
        {activeModule === 'friends' && <Friends />}
        {activeModule === 'blog' && <BlogFAQ />}
        {activeModule === 'profile' && <Profile />}
      </section>
    </main>
  );
}

export default App;
