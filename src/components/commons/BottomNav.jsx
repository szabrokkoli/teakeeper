import React from 'react';
import { FaHome, FaMugHot, FaBook, FaRandom, FaUsers, FaSearch } from 'react-icons/fa';
import styles from '../../styles/commons/BottomNav.module.css';
import { useLanguage } from '../../context/LanguageContext';

const navLabels = {
  hu: {
    home: 'Főoldal',
    teas: 'Teák',
    recipes: 'Receptek',
    random: 'Random',
    friends: 'Barátok',
    myteas: 'Saját Teáim',
  },
  en: {
    home: 'Home',
    teas: 'Teas',
    recipes: 'Recipes',
    random: 'Random',
    friends: 'Friends',
    myteas: 'My Teas',
  },
};

const navItems = [
  { key: 'home', icon: <FaHome /> },
  { key: 'teas', icon: <FaSearch /> },
  { key: 'recipes', icon: <FaBook /> },
  { key: 'random', icon: <FaRandom /> },
  { key: 'friends', icon: <FaUsers /> },
  { key: 'myteas', icon: <FaMugHot /> },
];

export default function BottomNav({ active, onNavigate }) {
  const { lang } = useLanguage();
  return (
    <nav className={styles.bottomNav}>
      {navItems.map(item => (
        <div
          key={item.key}
          className={`${styles.cell} ${active === item.key ? styles.cellActive : ''}`}
        >
          <button
            className={active === item.key ? styles.active : ''}
            onClick={() => onNavigate(item.key)}
            aria-label={navLabels[lang][item.key]}
          >
            {item.icon}
            <span className={styles.label}>{navLabels[lang][item.key]}</span>
          </button>
        </div>
      ))}
    </nav>
  );
}