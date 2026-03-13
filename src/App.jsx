import { useState } from 'react';
import './styles/App.css';

import NavBar from './components/NavBar';

import TeaInfo from './pages/TeaInfo';
import Recipes from './pages/Recipes';
import MyTeas from './pages/MyTeas';
import RandomTea from './pages/RandomTea';
import Friends from './pages/Friends';
import BlogFAQ from './pages/BlogFAQ';
import Profile from './pages/Profile';

function App() {
  const [activeModule, setActiveModule] = useState('teas');

  return (
    <div className="app-wrapper">
      <NavBar activeModule={activeModule} setActiveModule={setActiveModule} />
      
      <main className="tea-main">
        <section>
          {activeModule === 'teas' && <TeaInfo />}
          {activeModule === 'recipes' && <Recipes />}
          {activeModule === 'myteas' && <MyTeas />}
          {activeModule === 'random' && <RandomTea />}
          {activeModule === 'friends' && <Friends />}
          {activeModule === 'blog' && <BlogFAQ />}
          {activeModule === 'profile' && <Profile />}
        </section>
      </main>
    </div>
  );
}

export default App;