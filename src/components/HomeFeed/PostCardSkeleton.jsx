import styles from '../../styles/pages/HomeFeed/PostCardSkeleton.module.css';

export default function PostCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.imagePlaceholder} ${styles.pulse}`}></div>
      <div className={styles.content}>
        <div className={styles.headerSkeleton}>
          <span className={`${styles.avatarPlaceholder} ${styles.pulse}`}></span>
          <div className={`${styles.textLine} ${styles.titleLine} ${styles.pulse}`}></div>
        </div>
        <div className={styles.textLine + ' ' + styles.pulse}></div>
        <div className={styles.textLine + ' ' + styles.pulse}></div>
        <div className={styles.statRowSkeleton}>
          <span className={`${styles.iconSkeleton} ${styles.pulse}`}></span>
          <span className={`${styles.iconSkeleton} ${styles.pulse}`}></span>
        </div>
      </div>
    </div>
  );
}
