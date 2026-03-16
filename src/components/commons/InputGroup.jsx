import React from 'react';
import styles from '../../styles/pages/AdminDashboard/AdminDashboard.module.css';

export default function InputGroup({ label, value, onChange, inputProps }) {
  return (
    <div className={styles.inputGroup}>
      <label className={styles.label}>{label}</label>
      <input
        className={styles.adminInput}
        value={value}
        onChange={onChange}
        {...inputProps}
      />
    </div>
  );
}