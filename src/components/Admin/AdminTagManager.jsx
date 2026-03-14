import React from 'react';
import { MdEdit } from 'react-icons/md';
import styles from '../../styles/AdminDashboard.module.css';

export default function AdminTagManager({ tags }) {
  return (
    <section>
      <h2>Címkék kezelése</h2>
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
                <button className={styles.deleteButton} title="Törlés"><MdEdit /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
