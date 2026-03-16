import React from 'react';
import styles from '../styles/pages/HomeFeed.module.css';

export default function Post({ post }) {
  return (
    <div className={styles.postCard}>
      <div className={styles.postHeader}>
        <span className={styles.author}>{post.author}</span>
        <span className={styles.date}>{post.date}</span>
      </div>
      <div className={styles.postContent}>{post.content}</div>
    </div>
  );
}
