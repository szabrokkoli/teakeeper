import { useState } from 'react';
import { supabase } from '../../services/supabaseClient';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from '../../styles/commons/Login.module.css';
import strings from '../../locales';

export default function Login() {
  const { signIn, signUp } = useAuth();
  const { lang } = useLanguage();
  const s = strings[lang].login;
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';

  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);
  const [resetting, setResetting] = useState(false);
  const handleResetPassword = async () => {
    setError(null);
    setMessage(null);
    setResetting(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) throw error;
      setMessage(s.resetEmailSent);
    } catch (err) {
      setError(s.resetEmailError);
    } finally {
      setResetting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLoginView) {
        const { error } = await signIn({ email, password });
        if (error) throw error;
        navigate(from, { replace: true });
      } else {
        const { error } = await signUp({ email, password });
        if (error) throw error;
        setMessage(s.checkEmail);
      }
    } catch (err) {
      setError(isLoginView ? s.errorLogin : s.errorSignup);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={styles.dangerCard}>{s.loginRequired}</div>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <label>{s.emailLabel}</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <label>{s.passwordLabel}</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={loading}>
          {isLoginView ? s.loginBtn : s.signupBtn}
        </button>
        {isLoginView && (
          <button
            type="button"
            className={styles.switchBtn}
            style={{ marginTop: 8, marginBottom: 8 }}
            onClick={handleResetPassword}
            disabled={resetting || !email}
          >
            {s.forgotPassword}
          </button>
        )}
        <div>
          <button
            type="button"
            onClick={() => setIsLoginView(v => !v)}
            className={styles.switchBtn}
          >
            {isLoginView ? s.noAccount : s.hasAccount}
          </button>
        </div>
        {error && <div className={styles.error}>{error}</div>}
        {message && <div className={styles.message}>{message}</div>}
      </form>
    </>
  );
}