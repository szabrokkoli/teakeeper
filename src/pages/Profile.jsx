import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../context/LanguageContext';
import Button from '../components/commons/Button';
import { FaKey } from 'react-icons/fa';
import styles from '../styles/pages/Profile/Profile.module.css';
import strings from '../locales';

export default function Profile() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const { lang } = useLanguage();
  const isAdmin = profile?.role === 'admin';
  const s = strings[lang].profile;
  return (
    <section className="card">
      <h1>{s.title}</h1>
      {isAdmin && (
        <div className={styles.adminButtonMobile}>
          <Button variant="primary" icon={<FaKey />} onClick={() => navigate('/admin')}>
            {s.admin}
          </Button>
        </div>
      )}
      <p>{s.desc}</p>
    </section>
  );
}
