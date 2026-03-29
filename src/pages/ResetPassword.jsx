import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../services/supabaseClient';
import Button from '../components/commons/Button';
import InputGroup from '../components/commons/InputGroup';
import styles from '../styles/commons/Login.module.css';
import strings from '../locales';
import { useLanguage } from '../context/LanguageContext';

export default function ResetPassword() {
  const { lang } = useLanguage();
  const s = strings[lang].login;
  const navigate = useNavigate();
  const location = useLocation();
  const [password, setPassword] = useState('');
  const [password2, setPassword2] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  // Supabase magic link: access_token in URL hash
  const hash = location.hash;
  const access_token = hash.match(/access_token=([^&]+)/)?.[1];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    if (password.length < 6 || password !== password2) {
      setError(s.passwordError);
      return;
    }
    if (!access_token) {
      setError(s.resetTokenError || 'Invalid or missing reset token.');
      return;
    }
    setLoading(true);
    try {
      supabase.auth.setSession({ access_token, refresh_token: null });
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setMessage(s.passwordUpdated || 'Password updated!');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(s.resetPasswordError || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginForm} style={{ maxWidth: 400, margin: '2rem auto' }}>
      <h2>{s.resetPasswordTitle || 'Reset Password'}</h2>
      <form onSubmit={handleSubmit}>
        <InputGroup
          label={s.newPassword}
          value={password}
          onChange={e => setPassword(e.target.value)}
          inputProps={{ type: 'password', autoComplete: 'new-password' }}
        />
        <InputGroup
          label={s.repeatNewPassword}
          value={password2}
          onChange={e => setPassword2(e.target.value)}
          inputProps={{ type: 'password', autoComplete: 'new-password' }}
        />
        <Button type="submit" variant="primary" disabled={loading} icon={null} style={{ width: '100%', marginTop: '1.2rem' }}>
          {loading ? s.saving : s.savePassword}
        </Button>
        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.message}>{message}</div>}
      </form>
    </div>
  );
}
