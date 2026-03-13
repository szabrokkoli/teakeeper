import { createContext, useState, useContext } from 'react';

// 1. Létrehozzuk a "csatornát"
const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // 2. Itt tároljuk az aktuális nyelvet (alapból magyar)
  const [lang, setLang] = useState('hu');

  // 3. Függvény a nyelv váltásához
  const toggleLanguage = () => {
    setLang((prev) => (prev === 'hu' ? 'en' : 'hu'));
  };

  return (
    // 4. "Sugározzuk" a nyelvet és a váltó funkciót az egész appnak
    <LanguageContext.Provider value={{ lang, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

// 5. Ez a kis "hook" segít, hogy könnyen elérjük a nyelvet más fájlokból
export const useLanguage = () => useContext(LanguageContext);