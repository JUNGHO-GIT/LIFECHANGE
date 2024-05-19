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
      login: {ko: "로그인", en: "Login"},
      signup: {ko: "회원가입", en: "Signup"},
      dataSet: {ko: "데이터 입력", en: "Data Input"},
      dataList: {ko: "데이터 리스트", en: "Data List"},
    },
    navBar: {
      total: {ko: "총합", en: "total"},
      exercise: {ko: "운동", en: "exercise"},
      food: {ko: "식사", en: "food"},
      calendar: {ko: "일정", en: "calendar"},
      money: {ko: "재무", en: "money"},
      sleep: {ko: "수면", en: "sleep"},
      score: {ko: "* 평균점수 : 1.00 ~ 5.00", en: "* Average score : 1.00 ~ 5.00"},
    },
    topNav: {
      dashList: {ko: "통계", en: "Statistics"},
      diffList: {ko: "비교", en: "Comparison"},
      findList: {ko: "찾기", en: "Find"},
      planList: {ko: "리스트(계획)", en: "List(Plan)"},
      planSave: {ko: "저장(계획)", en: "Save(Plan)"},
      list: {ko: "리스트", en: "List"},
      save: {ko: "저장", en: "Save"},
    },
    bottomNav: {
      exercise: {ko: "운동", en: "Exercise"},
      food: {ko: "식사", en: "Food"},
      calendar: {ko: "일정", en: "Calendar"},
      money: {ko: "재무", en: "Money"},
      sleep: {ko: "수면", en: "Sleep"},
    },
    btn: {
      goToList: {ko: "리스트", en: "List"},
      goToFind: {ko: "찾기", en: "Find"},
      goToFindSave: {ko: "완료", en: "Finish"},
      getToday: {ko: "오늘", en: "Today"},
      getCalendar: {ko: "일정", en: "Calendar"},
      getProperty: {ko: "지갑", en: "Wallet"},
      flowLogin: {ko: "로그인", en: "Login"},
      flowLogout: {ko: "로그아웃", en: "Logout"},
      flowSignup: {ko: "회원가입", en: "Signup"},
      flowSave: {ko: "저장", en: "Save"},
      flowDelete: {ko: "삭제", en: "Delete"},
      flowFind: {ko: "찾기", en: "Find"},
      flowDefault: {ko: "기본값", en: "Default"},
      flowDemo: {ko: "추가", en: "Insert"},
    },
    common: {
      empty: {ko: "데이터가 없습니다", en: "No data"},
      date: {ko: "날짜", en: "Date"},
      startDt: {ko: "시작일", en: "Start Date"},
      endDt: {ko: "종료일", en: "End Date"},
      count: {ko: "항목수", en: "Count"},
      category: {ko: "카테고리", en: "Category"},
      plan: {ko: "계획", en: "Plan"},
      real: {ko: "실제", en: "Real"},
      diff: {ko: "차이", en: "Diff"},
      delete: {ko: "삭제", en: "Delete"},
    },
    exercise: {
      planCount: {ko: "횟수 목표", en: "Count Goals"},
      planVolume: {ko: "볼륨 목표", en: "Volume Goals"},
      planCardio: {ko: "유산소 목표", en: "Cardio Goals"},
      planWeight: {ko: "체중 목표", en: "Weight Goals"},
      totalCount: {ko: "총 횟수", en: "Total Count"},
      totalVolume: {ko: "총 볼륨", en: "Total Volume"},
      totalCardio: {ko: "총 유산소", en: "Total Cardio"},
      part: {ko: "부위", en: "Part"},
      title: {ko: "운동명", en: "Name"},
      count: {ko: "횟수", en: "Count"},
      volume: {ko: "볼륨", en: "Volume"},
      cardio: {ko: "유산소", en: "Cardio"},
      weight: {ko: "체중", en: "Weight"},
      set: {ko: "세트", en: "Set"},
      rep: {ko: "횟수", en: "Rep"},
      kg: {ko: "kg", en: "kg"},
      endWeight: {ko: "kg", en: "kg"},
      endSet: {ko: "set", en: "set"},
      endRep: {ko: "rep", en: "rep"},
      endKg: {ko: "kg", en: "kg"},
      endCount: {ko: "회", en: "times"},
    },
    food: {
      planKcal: {ko: "칼로리 목표", en: "Kcal Goals"},
      planCarb: {ko: "탄수화물 목표", en: "Carb Goals"},
      planProtein: {ko: "단백질 목표", en: "Protein Goals"},
      planFat: {ko: "지방 목표", en: "Fat Goals"},
      totalKcal: {ko: "총 칼로리", en: "Total Kcal"},
      totalCarb: {ko: "총 탄수화물", en: "Total Carb"},
      totalProtein: {ko: "총 단백질", en: "Total Protein"},
      totalFat: {ko: "총 지방", en: "Total Fat"},
      part: {ko: "대분류", en: "Category"},
      title: {ko: "식품명", en: "Name"},
      brand: {ko: "브랜드", en: "Brand"},
      serv: {ko: "1회 제공량", en: "Serving"},
      gram: {ko: "그램", en: "Gram"},
      kcal: {ko: "칼로리", en: "Kcal"},
      carb: {ko: "탄수화물", en: "Carb"},
      protein: {ko: "단백질", en: "Protein"},
      fat: {ko: "지방", en: "Fat"},
      count: {ko: "회", en: "Count"},
      endCount: {ko: "회", en: "times"},
      endKcal: {ko: "kcal", en: "kcal"},
      endGram: {ko: "g", en: "g"},
    },
    money: {
      planIn: {ko: "수입 목표", en: "Income Goals"},
      planOut: {ko: "지출 목표", en: "Expense Goals"},
      totalIn: {ko: "총 수입", en: "Total Income"},
      totalOut: {ko: "총 지출", en: "Total Expense"},
      in: {ko: "수입", en: "Income"},
      out: {ko: "지출", en: "Expense"},
      part: {ko: "대분류", en: "Category"},
      title: {ko: "소분류", en: "Detail"},
      amount: {ko: "금액", en: "Amount"},
      content: {ko: "내용", en: "Content"},
      endCurrency: {ko: "원", en: "USD"},
    },
    sleep: {
      night: {ko: "취침", en: "Bed Time"},
      morning: {ko: "기상", en: "Wake-up Time"},
      time: {ko: "수면", en: "Sleep Time"},
      planNight: {ko: "취침 목표", en: "Bed Time Goals"},
      planMorning: {ko: "기상 목표", en: "Wake-up Time Goals"},
      planTime: {ko: "수면 목표", en: "Sleep Time Goals"},
    },
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
