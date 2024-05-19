// useTranslate.jsx
// @ts-nocheck

import {React, useState, useEffect} from "../../import/ImportReacts.jsx";
import {createContext, useContext} from "../../import/ImportReacts.jsx";

// ------------------------------------------------------------------------------------------------>
const LanguageContext = createContext();

// ------------------------------------------------------------------------------------------------>
export const useLanguage = () => (
  useContext(LanguageContext)
);

// ------------------------------------------------------------------------------------------------>
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(sessionStorage.getItem('lang') || 'ko');

  useEffect(() => {
    sessionStorage.setItem('lang', lang);
    console.log('Language changed : ', lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{lang, setLang}}>
      {children}
    </LanguageContext.Provider>
  );
};
