
import { FaHome, FaMugHot, FaBook, FaRandom, FaUsers, FaSearch } from 'react-icons/fa';
import styles from '../../styles/commons/BottomNav.module.css';
import { useLanguage } from '../../context/LanguageContext';
import strings from '../../locales';
import navKeyToPath from '../../utils/navKeyToPath';

const navItems = [
  { key: 'home', icon: <FaHome /> },
  { key: 'teas', icon: <FaSearch /> },
  { key: 'recipes', icon: <FaBook /> },
  { key: 'random', icon: <FaRandom /> },
  { key: 'friends', icon: <FaUsers /> },
  { key: 'myteas', icon: <FaMugHot /> },
];


import { useNavigate, useLocation } from 'react-router-dom';

function BottomNav() {
  const { lang } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();



  const getActiveKey = () => {
    const path = location.pathname;
    if (path === '/' || path.startsWith('/home')) return 'home';
    if (path.startsWith('/teas')) return 'teas';
    if (path.startsWith('/recipes')) return 'recipes';
    if (path.startsWith('/random')) return 'random';
    if (path.startsWith('/friends')) return 'friends';
    if (path.startsWith('/myteas')) return 'myteas';
    return '';
  };
  const activeKey = getActiveKey();

  return (
    <nav className={styles.bottomNav}>
      {navItems.map(item => (
        <div
          key={item.key}
          className={`${styles.cell} ${activeKey === item.key ? styles.cellActive : ''}`}
        >
          <button
            className={activeKey === item.key ? styles.active : ''}
            onClick={() => navigate(navKeyToPath[item.key])}
            aria-label={strings[lang].bottomNav[item.key]}
          >
            {item.icon}
            <span className={styles.label}>{strings[lang].bottomNav[item.key]}</span>
          </button>
        </div>
      ))}
    </nav>
  );
}

export default BottomNav;