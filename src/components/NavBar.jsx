import { useState } from 'react';
import { FaUser, FaMugHot, FaUsers, FaBars, FaTimes, FaKey } from 'react-icons/fa';
import brand_name from '../assets/brand_name.png';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/NavBar.module.css';
import { useAuth } from '../context/AuthContext';

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
    { key: 'blog', label: s.blog, show: true },
    { key: 'login', label: s.login, extraClass: 'button-login', show: !user },
    { key: 'signup', label: s.signup, extraClass: 'button-signup', show: !user },
    { key: 'friends', label: s.friends, icon: <FaUsers />, show: !!user },
    { key: 'myteas', label: s.myteas, icon: <FaMugHot />, show: !!user },
    { key: 'profile', label: s.profile, icon: <FaUser />, show: !!user },
    { key: 'admin', label: 'Admin', icon: <FaKey />, show: profile?.role === 'admin' }  
];

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
      <img src={brand_name} alt="TeaKeeper Logo" className={styles.logo} />

      <div className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
        {visibleNavItems.map(({ key, label, icon, extraClass }) => {
          
          // Ha ez a profil gomb, akkor egy speciális "wrapper"-be tesszük a dropdownhoz
          if (key === 'profile') {
            return (
              <div key={key} className={styles.profileWrapper}>
                <button
                  className={`button button-secondary ${styles.navButton} ${activeModule === key ? 'button-primary' : ''} ${extraClass || ''}`}
                  onClick={() => handleNavClick(key)}
                >
                  {icon && <span>{icon}</span>}
                  <span>{label}</span>
                </button>
                
                {/* Ez a menü csak Hover-re jelenik meg */}
                <div className={styles.profileDropdown}>
                  <button onClick={handleLogout} className={`${styles.dropdownItem} ${styles.logoutText}`}>
                    {s.logout}
                  </button>
                </div>
              </div>
            );
          }

          // A többi gomb normálisan renderelődik
          return (
            <button
              key={key}
              className={`button button-secondary ${styles.navButton} ${activeModule === key ? styles.activeNav : ''} ${extraClass || ''}`}
              onClick={() => handleNavClick(key)}
            >
              {icon && <span>{icon}</span>}
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      <div className={styles.actions}>
        <button onClick={toggleLanguage} className={`button button-secondary ${styles.langButton}`}>
          {lang === 'hu' ? 'EN' : 'HU'}
        </button>

        <button
          className={styles.hamburger}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Menü"
        >
          {isMenuOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>
    </nav>
  );
}