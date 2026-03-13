import styles from '../styles/TeaCardSkeleton.module.css';

export default function TeaCardSkeleton() {
  return (
    <div className={styles.skeletonCard}>
      {/* Kép helye */}
      <div className={`${styles.imagePlaceholder} ${styles.pulse}`}></div>
      
      <div className={styles.content}>
        {/* Cím helye */}
        <div className={`${styles.textLine} ${styles.titleLine} ${styles.pulse}`}></div>
        
        {/* Leírás sorai */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '8px' }}>
          <div className={`${styles.textLine} ${styles.descLine1} ${styles.pulse}`}></div>
          <div className={`${styles.textLine} ${styles.descLine2} ${styles.pulse}`}></div>
          <div className={`${styles.textLine} ${styles.descLine3} ${styles.pulse}`}></div>
        </div>

        {/* Címkék (badge-ek) helye */}
        <div className={styles.tagContainer}>
          <div className={`${styles.tagLine} ${styles.pulse}`}></div>
          <div className={`${styles.tagLine} ${styles.pulse}`}></div>
        </div>
      </div>
    </div>
  );
}