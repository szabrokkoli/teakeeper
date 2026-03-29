import { FaCrown, FaMugHot, FaBook } from 'react-icons/fa';
import styles from './UserProfileCard.module.css';
import { useLanguage } from '../../context/LanguageContext';
import strings from '../../locales';

export default function UserProfileCard({ user, profile, teasCount = 0, recipesCount = 0 }) {
  const { lang } = useLanguage();
  const s = strings[lang]?.profile || {};
  // user: { email }
  // profile: { username, avatar_url, bio, role }
  const isAdmin = profile?.role === 'admin';
  const avatarUrl = profile?.avatar_url || '';
  return (
    <div className={styles.profileCard + ' card'}>
      <div className={styles.profileHeader}>
        {avatarUrl ? (
          <img src={avatarUrl} alt="avatar" className={styles.avatar} />
        ) : (
          <div className={styles.avatarPlaceholder} />
        )}
        <div className={styles.profileInfo}>
          <div className={styles.username}>
            {profile?.username || user?.email?.split('@')[0]}
            {isAdmin && <FaCrown style={{ color: '#c99a00', marginLeft: 8, verticalAlign: 'middle' }} title="Admin" />}
          </div>
          <div className={styles.email}>{user?.email}</div>
        </div>
      </div>
      {profile?.bio && (
        <div className={styles.bioBox}>
          <div className={styles.bio}>{profile.bio}</div>
        </div>
      )}
      <div className={styles.statsRow}>
        <div className={styles.statBox}>
          <span className={styles.statIcon}><FaMugHot /></span>
          <span className={styles.statLabel}>{s.teas}</span>
          <span className={styles.statValue}>{teasCount}</span>
        </div>
        <div className={styles.statBox}>
          <span className={styles.statIcon}><FaBook /></span>
          <span className={styles.statLabel}>{s.recipes}</span>
          <span className={styles.statValue}>{recipesCount}</span>
        </div>
      </div>
    </div>
  );
}
