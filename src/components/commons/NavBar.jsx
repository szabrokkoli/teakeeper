import { useState } from 'react';
import { FaUser, FaMugHot, FaUsers, FaBars, FaTimes, FaKey, FaLightbulb } from 'react-icons/fa';
import brand_name from '../../assets/brand_name.png';
import { useLanguage } from '../../context/LanguageContext';
import styles from '../../styles/commons/NavBar.module.css';
import { useAuth } from '../../context/AuthContext';
import Button from './Button';

const localStrings = {
  hu: {
    teas: "Teák",
    recipes: "Receptek",
    random: "Válassz nekem Teát",
    blog: "Tippek",
    login: "Belépés",
    signup: "Regisztráció",
    friends: "Barátok",
    myteas: "Saját Teáim",
    profile: "Profil",
    logout: "Kilépés"
  },
  en: {
    teas: "Teas",
    recipes: "Recipes",
    random: "Pick me a Tea",
    blog: "Tips",
    login: "Log in",
    signup: "Sign up",
    friends: "Tea Friends",
    myteas: "My Teas",
    profile: "Profile",
    logout: "Log out"
  }
};

export default function NavBar({ activeModule, setActiveModule }) {
  const { lang, toggleLanguage } = useLanguage();
  const { user, profile, signOut } = useAuth();
  const s = localStrings[lang];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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
  
  const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches;

  // Tippek gomb: desktopon szöveg is, mobilon csak ikon
  const tipsButton = (
    <Button
      icon={<FaLightbulb />}
      className={styles.navButton}
      onClick={() => handleNavClick('blog')}
    >
      {!isMobile && s.blog}
    </Button>
  );

  const visibleNavItems = navItems.filter(item => item.show);

  const handleNavClick = (key) => {
    setActiveModule(key);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    await signOut();
    setActiveModule('teas');
    setIsMenuOpen(false);
  };

  return (
    <nav className={`toolbar ${styles.navbar}`}>
      <img
        src={brand_name}
        alt="TeaKeeper Logo"
        className={styles.logo}
        style={{ cursor: 'pointer' }}
        onClick={() => setActiveModule('home')}
      />

      {/* Főmenü asztali nézetben */}
      {!isMobile && (
        <div className={styles.menu}>
          {visibleNavItems.map(({ key, label, icon, extraClass }) => (
            <Button
              key={key}
              icon={icon}
              className={`styles.navButton ${activeModule === key ? styles.activeNav : ''} ${extraClass || ''}`}
              onClick={() => handleNavClick(key)}
            >
              {label}
            </Button>
          ))}
        </div>
      )}

      <div className={styles.actions}>
        <Button onClick={toggleLanguage} className={styles.navButton}>
          {lang === 'hu' ? 'EN' : 'HU'}
        </Button>
        {tipsButton}
        
        {isMobile && (
          <Button
            className={styles.navButton}
            onClick={() => handleNavClick(user ? 'profile' : 'login')}
            aria-label="Profil"
            icon={<FaUser size={24} />}
          />
        )}
      </div>
    </nav>
  );
}