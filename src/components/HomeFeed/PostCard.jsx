import React from 'react';
import { FaRegHeart, FaRegComment } from 'react-icons/fa';
import styles from '../../styles/pages/PostCard.module.css';
import { useLanguage } from '../../context/LanguageContext';

export default function PostCard({ post }) {
  const { lang } = useLanguage();
  // A localStrings import helyett a relatív szövegeket itt definiáljuk
  const s = lang === 'hu'
    ? { justNow: 'épp most', minute: 'perce', hour: 'órája', day: 'napja', unknown: 'ismeretlen idő' }
    : { justNow: 'just now', minute: 'minutes ago', hour: 'hours ago', day: 'days ago', unknown: 'unknown time' };

  function getRelativeTime(dateString) {
    if (!dateString) return s.unknown;
    const safeDateString = dateString.replace(' ', 'T').replace(/\+00$/, 'Z');
    const utcDate = new Date(safeDateString);
    const now = new Date();
    const diffMs = now.getTime() - utcDate.getTime();
    if (isNaN(diffMs) || diffMs < 0) return s.justNow;
    const diffMin = Math.floor(diffMs / 60000);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    if (diffDay > 0) return `${diffDay} ${s.day}`;
    if (diffHour > 0) return `${diffHour} ${s.hour}`;
    if (diffMin > 0) return `${diffMin} ${s.minute}`;
    return s.justNow;
  }

  return (
    <div className={styles.card}>
      {/* Kép, ha van */}
      {post?.imageUrl && (
        <img src={post.imageUrl} alt="post visual" className={styles.image} />
      )}
      <div className={styles.content}>
        <div className={styles.header}>
          <span className={styles.author}>{post.author}</span>
          <span className={styles.date}>{getRelativeTime(post.date)}</span>
        </div>
        <div className={styles.text}>{post.content}</div>
        <div className={styles.statsRow}>
          <span className={styles.stat}>
            <FaRegHeart className={styles.icon} /> {post.likes || 0}
          </span>
          <span className={styles.stat}>
            <FaRegComment className={styles.icon} /> {post.comments || 0}
          </span>
        </div>
      </div>
    </div>
  );
}
