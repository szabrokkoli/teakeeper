import React from 'react';
import ReactDOM from 'react-dom';
import styles from '../../styles/pages/TeaInfo/TeaCard.module.css';

export default function Modal({ open, onClose, children }) {
  if (!open) return null;
  return ReactDOM.createPortal(
    <div className={styles.modalOverlay}>
      <div
        className={styles.modalContent}
        onClick={e => e.stopPropagation()}
      >
        <button className={styles.modalClose} onClick={onClose}>&times;</button>
        {children}
      </div>
    </div>,
    document.body
  );
}