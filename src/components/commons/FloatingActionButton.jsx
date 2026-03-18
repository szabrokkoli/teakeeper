import React from 'react';
import styles from '../../styles/commons/FloatingActionButton.module.css';

export default function FloatingActionButton({ onClick }) {
  return (
    <button className={styles.fab} onClick={onClick} aria-label="Add new post">
      <span className={styles.plus}>+</span>
    </button>
  );
}
