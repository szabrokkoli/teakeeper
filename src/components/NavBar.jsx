import { useState } from 'react';
import { FaUser, FaMugHot, FaUsers, FaBars, FaTimes, FaKey, FaLightbulb } from 'react-icons/fa';
import brand_name from '../assets/brand_name.png';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/NavBar.module.css';
import { useAuth } from '../context/AuthContext';
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
  const { user, profile, signOut } = useAuth(); // Itt lekérjük a profilt is az Admin gombhoz
  const s = localStrings[lang];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // A menüpontok listája (benne az Admin gombbal!)
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
  // Tippek gomb felülre, profil mellé
  const tipsButton = (
    <Button
      icon={<FaLightbulb />}
      className={`button button-secondary ${styles.navButton}`}
      onClick={() => handleNavClick('blog')}
    />
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

      {/* Mobilon, ha be van jelentkezve, ne jelenjen meg a menü */}
      {!(typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches && user) && (
        <div className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
          {typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches && !user && isMenuOpen ? (
            <>
              <Button
                variant="primary"
                className={`button ${styles.navButton} button-login`}
                onClick={() => handleNavClick('login')}
              >
                {s.login}
              </Button>
              <Button
                className={`button button-secondary ${styles.navButton} button-signup`}
                onClick={() => handleNavClick('signup')}
              >
                {s.signup}
              </Button>
            </>
          ) : (
            visibleNavItems.map(({ key, label, icon, extraClass }) => {
              if (key === 'profile') {
                return (
                  <Button
                    key={key}
                    icon={icon}
                    className={`button button-secondary ${styles.navButton} ${activeModule === key ? 'button-primary' : ''} ${extraClass || ''}`}
                    onClick={() => handleNavClick(user ? 'profile' : 'login')}
                    style={{ pointerEvents: 'auto' }}
                  >
                    {label}
                  </Button>
                );
              }
              // A többi gomb normálisan renderelődik
              return (
                <Button
                  key={key}
                  icon={icon}
                  className={`button button-secondary ${styles.navButton} ${activeModule === key ? styles.activeNav : ''} ${extraClass || ''}`}
                  onClick={() => handleNavClick(key)}
                >
                  {label}
                </Button>
              );
            })
          )}
        </div>
      )}

      <div className={styles.actions}>
        <Button onClick={toggleLanguage} className={`button button-secondary ${styles.langButton}`}>
          {lang === 'hu' ? 'EN' : 'HU'}
        </Button>
        {tipsButton}
        {typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches && (
          <Button
            className={styles.hamburger}
            onClick={() => handleNavClick(user ? 'profile' : 'login')}
            aria-label="Profil"
            icon={<FaUser size={24} />}
          />
        )}
      </div>
    </nav>
  );
}