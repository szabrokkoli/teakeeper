

import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/commons/Button';
import { FaKey } from 'react-icons/fa';
import styles from '../styles/pages/Profile/Profile.module.css';

export default function Profile({ setActiveModule }) {
  const { user, profile } = useAuth();
  const { lang } = useLanguage();
  const isAdmin = profile?.role === 'admin';
  const localStrings = {
    hu: {
      title: 'Profil & Beállítások',
      desc: 'Profilod, preferenciáid és beállításaid kezelése.',
      admin: 'Admin',
    },
    en: {
      title: 'Profile & Settings',
      desc: 'Manage your profile, preferences, and settings.',
      admin: 'Admin',
    }
  };
  const s = localStrings[lang];
  return (
    <section className="card">
      <h1>{s.title}</h1>
      {/* Mobilon jelenjen meg az Admin gomb a cím alatt */}
      {isAdmin && (
        <div className={styles.adminButtonMobile}>
          <Button variant="primary" icon={<FaKey />} onClick={() => setActiveModule('admin')}>
            {s.admin}
          </Button>
        </div>
      )}
      <p>{s.desc}</p>
    </section>
  );
}
