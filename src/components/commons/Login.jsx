import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useLanguage } from '../../context/LanguageContext';
import styles from '../../styles/commons/Login.module.css';

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
    checkEmail: "Kérlek, ellenőrizd az email fiókodat a megerősítő linkért!",
    loginRequired: "Be kell jelentkezned a használathoz!"
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
    checkEmail: "Please check your email for the confirmation link!",
    loginRequired: "You need to log in to use this!"
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
        setMessage(s.checkEmail);
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