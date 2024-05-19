// useLanguageProvider.jsx

import {React, useState, useEffect, useCallback} from "../../import/ImportReacts.jsx";
import {createContext, useContext} from "../../import/ImportReacts.jsx";

// ------------------------------------------------------------------------------------------------>
// @ts-ignore
const LanguageContext = createContext();

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

// ------------------------------------------------------------------------------------------------>
export const useLanguage = () => (
  useContext(LanguageContext)
);

// ------------------------------------------------------------------------------------------------>
export const useTranslate = () => {
  const {lang} = useLanguage();
  const resources = {
    tabBar: {
      dashList: {
        ko: "통계",
        en: "Statistics"
      },
      diffList: {
        ko: "비교",
        en: "Comparison"
      },
      planList: {
        ko: "리스트(계획)",
        en: "List(Plan)"
      },
      planSave: {
        ko: "저장(계획)",
        en: "Save(Plan)"
      },
      list: {
        ko: "리스트",
        en: "List"
      },
      save: {
        ko: "저장",
        en: "Save"
      }
    }
  };

  const translate = useCallback((key) => {
    const keys = key.split('-');
    let result = resources;

    for (let k of keys) {
      if (result && result[k]) {
        result = result[k];
      }
      else {
        return '';
      }
    }

    return result[lang] || '';
  }, [lang]);

  return {translate};
};
