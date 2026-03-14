import React from 'react';
import styles from '../styles/TeaInfo.module.css';

// controls: array of { type, ...props }
export default function FilterToolbar({ controls, children }) {
  return (
    <div className={styles.toolbar}>
      {controls.map((control, idx) => {
        if (control.type === 'select') {
          return (
            <select
              key={idx}
              className="filter-control"
              value={control.value}
              onChange={control.onChange}
            >
              {control.options.map((opt, i) => (
                <option key={i} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          );
        }
        // Bővíthető további típusokkal
        return null;
      })}
      {children}
    </div>
  );
}
