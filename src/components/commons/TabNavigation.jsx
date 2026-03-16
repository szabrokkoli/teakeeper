import React from 'react';
import styles from "../../styles/pages/AdminDashboard/AdminDashboard.module.css";

// tabs: [{ key, label }], activeTab: string, onTabChange: fn
export default function TabNavigation({ tabs, activeTab, onTabChange }) {
  return (
    <nav className={styles.tabs}>
      {tabs.map((tab) => (
        <button
          key={tab.key}
          className={`${styles.tabButton} ${activeTab === tab.key ? styles.activeTab : ''}`}
          onClick={() => onTabChange(tab.key)}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  );
}