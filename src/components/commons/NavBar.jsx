import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import navKeyToPath from '../../utils/navKeyToPath';
import { FaUser, FaMugHot, FaUsers, FaKey, FaLightbulb } from 'react-icons/fa';
import brand_name from '../../assets/brand_name.png';
import { useLanguage } from '../../context/LanguageContext';
import styles from '../../styles/commons/NavBar.module.css';
import Button from './Button';
import { useAuth } from '../../context/AuthContext';
import strings from '../../locales';


function NavBar() {
  const navigate = useNavigate();
  const { lang, toggleLanguage } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const s = strings[lang].navBar;
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;
  const navItems = [
    { key: 'teas', label: s.teas, show: true },
    { key: 'recipes', label: s.recipes, show: true },
    { key: 'random', label: s.random, show: true },
    { key: 'login', label: s.login, extraClass: 'button-login', show: !user },
    { key: 'signup', label: s.signup, extraClass: 'button-signup', show: !user },
    { key: 'friends', label: s.friends, icon: <FaUsers />, show: !!user },
    { key: 'myteas', label: s.myteas, icon: <FaMugHot />, show: !!user },
    { key: 'profile', label: s.profile, icon: <FaUser />, show: !!user },
    { key: 'admin', label: 'Admin', icon: <FaKey />, show: profile?.role === 'admin' }
  ];
  const visibleNavItems = navItems.filter(item => item.show);
  const tipsButton = (
    <Button
      icon={<FaLightbulb />}
      className={styles.navButton}
      onClick={() => handleNavClick('blog')}
    >
      {!isMobile && s.blog}
    </Button>
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleNavClick = (key) => {
    const path = navKeyToPath[key] || '/';
    navigate(path);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/teas');
    setIsMenuOpen(false);
  };

  return (
    <nav className={`toolbar ${styles.navbar}`}>
      <img
        src={brand_name}
        alt="TeaKeeper Logo"
        className={styles.logo}
        style={{ cursor: 'pointer' }}
        onClick={() => handleNavClick('home')}
      />

      {/* Főmenü asztali nézetben */}
      {!isMobile && (
        <div className={styles.menu}>
          {visibleNavItems.map(({ key, label, icon, extraClass }) => (
            <Button
              key={key}
              icon={icon || null}
              className={`${styles.navButton} ${extraClass || ''}`}
              onClick={() => handleNavClick(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Button icon={null} onClick={toggleLanguage} className={styles.navButton}>
          {lang === 'hu' ? 'EN' : 'HU'}
        </Button>
        {tipsButton}
        
        {isMobile && (
          <Button
            className={styles.navButton}
            onClick={() => handleNavClick(user ? 'profile' : 'login')}
            aria-label="Profil"
            icon={<FaUser size={24} />}
            children={user ? s.profile : s.login}
          />
        )}

      </div>
    </nav>
  );
}

export default NavBar;