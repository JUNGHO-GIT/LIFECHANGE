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
    header: {
      login: {
        ko: "로그인", en: "Login"
      },
      signup: {
        ko: "회원가입", en: "Signup"
      },
      dataSet: {
        ko: "데이터 입력", en: "Data Input"
      },
      dataList: {
        ko: "데이터 리스트", en: "Data List"
      },
    },
    navBar: {
      total: {
        ko: "총합", en: "total"
      },
      exercise: {
        ko: "운동", en: "exercise"
      },
      food: {
        ko: "식사", en: "food"
      },
      calendar: {
        ko: "일정", en: "calendar"
      },
      money: {
        ko: "재무", en: "money"
      },
      sleep: {
        ko: "수면", en: "sleep"
      },
      score: {
        ko: "* 평균점수 : 1.00 ~ 5.00", en: "* Average score : 1.00 ~ 5.00"
      },
    },
    topNav: {
      dashList: {
        ko: "통계", en: "Statistics"
      },
      diffList: {
        ko: "비교", en: "Comparison"
      },
      findList: {
        ko: "찾기", en: "Find"
      },
      planList: {
        ko: "리스트(계획)", en: "List(Plan)"
      },
      planSave: {
        ko: "저장(계획)", en: "Save(Plan)"
      },
      list: {
        ko: "리스트", en: "List"
      },
      save: {
        ko: "저장", en: "Save"
      }
    },
    bottomNav: {
      exercise: {
        ko: "운동", en: "Exercise"
      },
      food: {
        ko: "식사", en: "Food"
      },
      calendar: {
        ko: "일정", en: "Calendar"
      },
      money: {
        ko: "재무", en: "Money"
      },
      sleep: {
        ko: "수면", en: "Sleep"
      }
    },
    btn: {
      goToList: {
        ko: "리스트", en: "List"
      },
      goToFind: {
        ko: "찾기", en: "Find"
      },
      goToFindSave: {
        ko: "완료", en: "Finish"
      },
      getToday: {
        ko: "오늘", en: "Today"
      },
      getCalendar: {
        ko: "일정", en: "Calendar"
      },
      getProperty: {
        ko: "지갑", en: "Wallet"
      },
      flowLogin: {
        ko: "로그인", en: "Login"
      },
      flowLogout: {
        ko: "로그아웃", en: "Logout"
      },
      flowSignup: {
        ko: "회원가입", en: "Signup"
      },
      flowSave: {
        ko: "저장", en: "Save"
      },
      flowDelete: {
        ko: "삭제", en: "Delete"
      },
      flowFind: {
        ko: "찾기", en: "Find"
      },
      flowDefault: {
        ko: "기본값", en: "Default"
      },
      flowDemo: {
        ko: "추가", en: "Insert"
      },
    },
    common: {
      empty: {
        ko: "데이터가 없습니다.", en: "No data."
      },
      date: {
        ko: "날짜", en: "Date"
      },
      category: {
        ko: "카테고리", en: "Category"
      },
      plan: {
        ko: "계획", en: "Plan"
      },
      real: {
        ko: "실제", en: "Real"
      },
      diff: {
        ko: "차이", en: "Diff"
      }
    },
    exercise: {
      count: {
        ko: "횟수", en: "Count"
      },
      volume: {
        ko: "볼륨", en: "Volume"
      },
      cardio: {
        ko: "유산소", en: "Cardio"
      },
      weight: {
        ko: "체중", en: "Weight"
      }
    },
    food: {
      title: {
        ko: "식품명", en: "Name"
      },
      brand: {
        ko: "브랜드", en: "Brand"
      },
      serv: {
        ko: "1회 제공량", en: "Serving"
      },
      kcal: {
        ko: "칼로리", en: "Kcal"
      },
      carb: {
        ko: "탄수화물", en: "Carb"
      },
      protein: {
        ko: "단백질", en: "Protein"
      },
      fat: {
        ko: "지방", en: "Fat"
      }
    },
  };

  const translate = useCallback((key) => {
    const keys = key.split('-');
    let result = resources;

    console.log('keys : ', keys);

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
