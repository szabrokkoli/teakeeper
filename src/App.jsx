import { useState } from 'react';
import './App.css';
import TeaInfo from './modules/TeaInfo';
import Recipes from './modules/Recipes';
import MyTeas from './modules/MyTeas';
import RandomTea from './modules/RandomTea';
import Friends from './modules/Friends';
import BlogFAQ from './modules/BlogFAQ';
import Profile from './modules/Profile';

function App() {
  const [activeModule, setActiveModule] = useState('teas');

  const navItems = [
    { key: 'teas', label: 'Tea List' },
    { key: 'recipes', label: 'Recipes' },
    { key: 'myteas', label: 'My Teas' },
    { key: 'random', label: 'Random Tea' },
    { key: 'friends', label: 'Friends' },
    { key: 'blog', label: 'Blog & FAQ' },
    { key: 'profile', label: 'Profile' }
  ];

  return (
    <main className="tea-main">
      <nav className="toolbar">
        {navItems.map(item => (
          <button
            key={item.key}
            className={`button button-secondary${activeModule === item.key ? ' button-primary' : ''}`}
            onClick={() => setActiveModule(item.key)}
          >
            {item.label}
          </button>
        ))}
      </nav>
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

export default App
