import styles from '../../styles/pages/TeaInfo/TeaCardSkeleton.module.css';

export default function TeaCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      <div className={`${styles.imagePlaceholder} ${styles.pulse}`}></div>
      
      <div className={styles.content}>
        <div className={`${styles.textLine} ${styles.titleLine} ${styles.pulse}`}></div>
      
        <div className={styles.descLines}>
          <div className={`${styles.textLine} ${styles.descLine1} ${styles.pulse}`}></div>
          <div className={`${styles.textLine} ${styles.descLine2} ${styles.pulse}`}></div>
          <div className={`${styles.textLine} ${styles.descLine3} ${styles.pulse}`}></div>
        </div>

        <div className={styles.tagContainer}>
          <div className={`${styles.tagLine} ${styles.pulse}`}></div>
          <div className={`${styles.tagLine} ${styles.pulse}`}></div>
        </div>
      </div>
    </div>
  );
}