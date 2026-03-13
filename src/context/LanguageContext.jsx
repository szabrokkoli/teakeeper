import { createContext, useState, useContext } from 'react';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('hu');

  const toggleLanguage = () => {
    setLang((prev) => (prev === 'hu' ? 'en' : 'hu'));
  };

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);