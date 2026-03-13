import { useState } from 'react';
import { FaUser, FaMugHot, FaUsers, FaBars, FaTimes } from 'react-icons/fa';
import brand_name from '../assets/brand_name.png';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/NavBar.module.css';

const localStrings = {
  hu: {
    teas: "Teák",
    recipes: "Receptek",
    random: "Válassz nekem",
    blog: "Tippek",
    login: "Belépés",
    signup: "Regisztráció",
    friends: "Barátok",
    myteas: "Saját teáim",
    profile: "Profil"
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
    profile: "Profile"
  }
};

export default function NavBar({ activeModule, setActiveModule }) {
  const { lang, toggleLanguage } = useLanguage();
  const s = localStrings[lang];
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    { key: 'teas', label: s.teas },
    { key: 'recipes', label: s.recipes },
    { key: 'random', label: s.random },
    { key: 'blog', label: s.blog },
    { key: 'login', label: s.login, extraClass: 'button-login' },
    { key: 'signup', label: s.signup, extraClass: 'button-signup' },
    { key: 'friends', label: s.friends, icon: <FaUsers /> },
    { key: 'myteas', label: s.myteas, icon: <FaMugHot /> },
    { key: 'profile', label: s.profile, icon: <FaUser /> },
  ];

  const handleNavClick = (key) => {
    setActiveModule(key);
    setIsMenuOpen(false);
  };

  return (
    <nav className={`toolbar ${styles.navbar}`}>
      <img src={brand_name} alt="TeaKeeper Logo" className={styles.logo} />

      <div className={`${styles.menu} ${isMenuOpen ? styles.menuOpen : ''}`}>
        {navItems.map(({ key, label, icon, extraClass }) => (
          <button
            key={key}
            className={`button button-secondary ${styles.navButton} ${activeModule === key ? 'button-primary' : ''} ${extraClass || ''}`}
            onClick={() => handleNavClick(key)}
          >
            {icon && <span>{icon}</span>}
            <span>{label}</span>
          </button>
        ))}
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