import React from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import styles from '../../styles/pages/AdminDashboard/AdminDashboard.module.css';

export default function AdminTagManager({ tags }) {
  return (
    <section>
      <h2>Címkék kezelése</h2>
      <div className={styles.adminTableWrapper}>
        <table className={styles.adminTable}>
          <thead>
            <tr>
              <th>Név (HU)</th>
              <th>Név (EN)</th>
              <th>Műveletek</th>
            </tr>
          </thead>
          <tbody>
            {tags.map(tag => (
              <tr key={tag.id}>
                <td>{tag.name?.hu}</td>
                <td>{tag.name?.en}</td>
                <td>
                  <button className={styles.editButton} title="Szerkesztés"><MdEdit /></button>
                  <button className={styles.deleteButton} title="Törlés"><MdDelete /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
