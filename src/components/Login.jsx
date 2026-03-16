import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import styles from '../styles/Login.module.css';

const localStrings = {
  hu: {
    loginTitle: "Üdv újra!",
    signupTitle: "Fiók létrehozása",
    emailLabel: "Email cím",
    passwordLabel: "Jelszó",
    loginBtn: "Bejelentkezés",
    signupBtn: "Regisztráció",
    loading: "Kérlek várj...",
    noAccount: "Nincs még fiókod?",
    hasAccount: "Már van fiókod?",
    switchBtn: "Váltás",
    errorLogin: "Hibás email vagy jelszó.",
    errorSignup: "Hiba a regisztráció során (lehet, hogy már létezik ez az email).",
    checkEmail: "Kérlek, ellenőrizd az email fiókodat a megerősítő linkért!"
  },
  en: {
    loginTitle: "Welcome back!",
    signupTitle: "Create an account",
    emailLabel: "Email address",
    passwordLabel: "Password",
    loginBtn: "Log in",
    signupBtn: "Sign up",
    loading: "Please wait...",
    noAccount: "Don't have an account?",
    hasAccount: "Already have an account?",
    switchBtn: "Switch",
    errorLogin: "Invalid email or password.",
    errorSignup: "Error during signup (email might already be in use).",
    checkEmail: "Please check your email for the confirmation link!"
  }
};

export default function Login() {
  const { signIn, signUp } = useAuth();
  const { lang } = useLanguage();
  const s = localStrings[lang];

  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    try {
      if (isLoginView) {
        const { error } = await signIn({ email, password });
        if (error) throw error;
      } else {
        const { error } = await signUp({ email, password });
        if (error) throw error;
        // Ha Supabase-ben be van kapcsolva az email megerősítés:
        setMessage(s.checkEmail);
      }
    } catch (err) {
      console.error(err);
      setError(isLoginView ? s.errorLogin : s.errorSignup);
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setIsLoginView(!isLoginView);
    setError(null);
    setMessage(null);
    setPassword('');
  };

  return (
    <div className={styles.authWrapper}>
      <div className="card" style={{
        maxWidth: 400,
        marginBottom: '1.5rem',
        background: 'var(--color-danger-bg, #ffeaea)',
        color: 'var(--color-danger, #d32f2f)',
        fontWeight: 600,
        textAlign: 'center',
        border: '1px solid var(--color-danger, #d32f2f)',
        boxShadow: '0 2px 8px rgba(220, 0, 0, 0.08)'
      }}>
        Ehhez a funkcióhoz jelentkezz be! :)
      </div>
      <div className={`card ${styles.authCard}`}>
        <h2 className={styles.title}>
          {isLoginView ? s.loginTitle : s.signupTitle}
        </h2>

        {error && <div className={styles.errorMessage}>{error}</div>}
        {message && <div className={styles.successMessage}>{message}</div>}

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="email">{s.emailLabel}</label>
            <input
              id="email"
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className={styles.inputGroup}>
            <label className={styles.label} htmlFor="password">{s.passwordLabel}</label>
            <input
              id="password"
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <button 
            type="submit" 
            className={`button button-primary ${styles.submitBtn}`}
            disabled={loading}
          >
            {loading ? s.loading : (isLoginView ? s.loginBtn : s.signupBtn)}
          </button>
        </form>

        <div className={styles.toggleWrapper}>
          <p className={styles.toggleText}>
            {isLoginView ? s.noAccount : s.hasAccount}
          </p>
          <button 
            type="button" 
            className="button button-secondary"
            onClick={toggleView}
            disabled={loading}
          >
            {isLoginView ? `${s.switchBtn} (${s.signupBtn})` : `${s.switchBtn} (${s.loginBtn})`}
          </button>
        </div>
      </div>
    </div>
  );
}