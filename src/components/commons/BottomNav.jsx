import React from 'react';
import { FaHome, FaMugHot, FaBook, FaRandom, FaUsers, FaSearch } from 'react-icons/fa';
import styles from '../../styles/commons/BottomNav.module.css';

const navItems = [
  { key: 'home', icon: <FaHome />, label: 'Home' },
  { key: 'teas', icon: <FaSearch />, label: 'Teák' },
  { key: 'recipes', icon: <FaBook />, label: 'Receptek' },
  { key: 'random', icon: <FaRandom />, label: 'Random' },
  { key: 'friends', icon: <FaUsers />, label: 'Barátok' },
  { key: 'myteas', icon: <FaMugHot />, label: 'Saját Teáim' },
];

export default function BottomNav({ active, onNavigate }) {
  return (
    <nav className={styles.bottomNav}>
      {navItems.map(item => (
        <div
          key={item.key}
          className={active === item.key ? styles.cellActive : styles.cell}
        >
          <button
            className={active === item.key ? styles.active : ''}
            onClick={() => onNavigate(item.key)}
            aria-label={item.label}
          >
            {item.icon}
          </button>
        </div>
      ))}
    </nav>
  );
}