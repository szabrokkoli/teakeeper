import React from 'react';
import { MdEdit } from 'react-icons/md';
import styles from '../../styles/AdminDashboard.module.css';

export default function AdminCategoryManager({ categories }) {
  return (
    <section>
      <h2>Kategóriák kezelése</h2>
      <table className={styles.adminTable}>
        <thead>
          <tr>
            <th>Név (HU)</th>
            <th>Név (EN)</th>
            <th>Műveletek</th>
          </tr>
        </thead>
        <tbody>
          {categories.map(cat => (
            <tr key={cat.id}>
              <td>{cat.name?.hu}</td>
              <td>{cat.name?.en}</td>
              <td>
                <button className={styles.editButton} title="Szerkesztés"><MdEdit /></button>
                <button className={styles.deleteButton} title="Törlés"><MdEdit /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
