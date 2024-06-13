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
    // a
    asc: {ko: "오름차순", en: "Asc"},
    alreadyId: {ko: "아이디가 있는 경우", en: "Already have an Account"},
    amount: {ko: "금액", en: "Amount"},

    // b
    brand: {ko: "브랜드", en: "Brand"},

    // c
    calendar: {ko: "일정", en: "calendar"},
    cardio: {ko: "유산소", en: "Cardio"},
    category: {ko: "분류", en: "Category"},
    content: {ko: "내용", en: "Content"},
    count: {ko: "항목수", en: "Count"},

    // d
    dataCategory: {ko: "데이터 입력", en: "Data Input"},
    dataCategory1: {ko: "분류 1", en: "Category 1"},
    dataCategory2: {ko: "분류 2", en: "Category 2"},
    dataCategory3: {ko: "분류 3", en: "Category 3"},
    dataDetail: {ko: "회원정보 수정", en: "Edit Information"},
    dataList: {ko: "데이터 리스트", en: "Data List"},
    dashList: {ko: "통계", en: "Statistics"},
    date: {ko: "날짜", en: "Date"},
    dateEnd: {ko: "종료일", en: "End Date"},
    dateStart: {ko: "시작일", en: "Start Date"},
    dateType: {ko: "유형", en: "Type"},
    day: {ko: "일별", en: "Day"},
    deletes: {ko: "회원탈퇴", en: "Delete"},
    desc: {ko: "내림차순", en: "Desc"},
    diff: {ko: "차이", en: "Diff"},
    diffList: {ko: "비교", en: "Comparison"},
    duration: {ko: "기간", en: "Duration"},

    // e
    empty: {ko: "데이터가 없습니다", en: "No data"},
    endCarb: {ko: "g", en: "g"},
    endCount: {ko: "회", en: "times"},
    endCurrency: {ko: "₩", en: "$"},
    endFat: {ko: "g", en: "g"},
    endGram: {ko: "g", en: "g"},
    endHour: {ko: "h:m", en: "h:m"},
    endKcal: {ko: "kcal", en: "kcal"},
    endKg: {ko: "kg", en: "kg"},
    endProtein: {ko: "g", en: "g"},
    endRep: {ko: "rep", en: "rep"},
    endSet: {ko: "set", en: "set"},
    endVolume: {ko: "vol", en: "vol"},
    endWeight: {ko: "kg", en: "kg"},
    exercise: {ko: "운동", en: "exercise"},

    // f
    find: {ko: "찾기", en: "Find"},
    findList: {ko: "찾기", en: "Find"},
    flowDefault: {ko: "기본값", en: "Default"},
    flowDemo: {ko: "추가", en: "Insert"},
    flowDeletes: {ko: "삭제", en: "Delete"},
    flowFind: {ko: "찾기", en: "Find"},
    flowLogin: {ko: "로그인", en: "Login"},
    flowLogout: {ko: "로그아웃", en: "Logout"},
    flowSave: {ko: "저장", en: "Save"},
    flowSignup: {ko: "회원가입", en: "Signup"},
    food: {ko: "식사", en: "food"},

    // g
    getCalendar: {ko: "달력", en: "Calendar"},
    getToday: {ko: "오늘", en: "Today"},
    goToFind: {ko: "더 찾기", en: "Find More"},
    goToFindSave: {ko: "완료", en: "Finish"},
    goToList: {ko: "리스트", en: "List"},
    goToLogin: {ko: "로그인", en: "Login"},
    goToSave: {ko: "저장", en: "Save"},
    goToSignup: {ko: "회원가입", en: "Signup"},
    goal: {ko: "목표", en: "Goal"},
    gram: {ko: "그램", en: "Gram"},
    googleLogin: {ko: "구글 아이디로 로그인", en: "Login with Google"},
    googleSignup: {ko: "구글 아이디로 회원가입", en: "Signup with Google"},

    // h
    // i
    id: {ko: "아이디", en: "ID"},
    in: {ko: "수입", en: "Income"},
    info: {ko: "정보", en: "Information"},

    // j
    // k
    kcal: {ko: "칼로리", en: "Kcal"},
    kg: {ko: "kg", en: "kg"},

    // l
    language: {ko: "언어", en: "Language"},
    lastLogin: {ko: "최근 로그인", en: "Last Login"},
    list: {ko: "리스트", en: "List"},
    login: {ko: "로그인", en: "Login"},
    logout: {ko: "로그아웃", en: "Logout"},

    // m
    money: {ko: "재무", en: "money"},
    month: {ko: "월별", en: "Month"},
    morning: {ko: "기상", en: "Wake-up Time"},

    // n
    night: {ko: "취침", en: "Bed Time"},
    notId: {ko: "아이디가 없는 경우", en: "Don't have an Account"},

    // o
    out: {ko: "지출", en: "Expense"},

    // p
    part: {ko: "분류1", en: "Part"},
    plan: {ko: "계획", en: "Plan"},
    planCardio: {ko: "유산소 목표", en: "Cardio Goals"},
    planCarb: {ko: "탄수화물 목표", en: "Carb Goals"},
    planCount: {ko: "횟수 목표", en: "Count Goals"},
    planFat: {ko: "지방 목표", en: "Fat Goals"},
    planIn: {ko: "수입 목표", en: "Income Goals"},
    planKcal: {ko: "칼로리 목표", en: "Kcal Goals"},
    planList: {ko: "리스트(계획)", en: "List(Plan)"},
    planMorning: {ko: "기상 목표", en: "Wake-up Time Goals"},
    planNight: {ko: "취침 목표", en: "Bed Time Goals"},
    planOut: {ko: "지출 목표", en: "Expense Goals"},
    planProtein: {ko: "단백질 목획", en: "Protein Goals"},
    planSave: {ko: "저장(계획)", en: "Save(Plan)"},
    planTime: {ko: "수면 목표", en: "Sleep Time Goals"},
    planVolume: {ko: "볼륨 목표", en: "Volume Goals"},
    planWeight: {ko: "체중 목표", en: "Weight Goals"},
    property: {ko: "자산", en: "Property"},
    protein: {ko: "단백질", en: "Protein"},
    pw: {ko: "비밀번호", en: "PW"},

    // q
    // r
    real: {ko: "실제", en: "Real"},
    rep: {ko: "횟수", en: "Rep"},

    // s
    save: {ko: "저장", en: "Save"},
    score: {ko: "* 평균점수 : 1.00 ~ 5.00", en: "* Average score : 1.00 ~ 5.00"},
    select: {ko: "선택별", en: "Select"},
    serv: {ko: "1회 제공량", en: "Serving"},
    set: {ko: "세트", en: "Set"},
    signup: {ko: "회원가입", en: "Signup"},
    sleep: {ko: "수면", en: "sleep"},
    sort: {ko: "정렬", en: "Sort"},
    send: {ko: "전송", en: "Send"},
    signupDate: {ko: "가입일", en: "Signup Date"},

    // t
    time: {ko: "수면", en: "Sleep Time"},
    title: {ko: "분류2", en: "Title"},
    total: {ko: "총합", en: "total"},
    totalCount: {ko: "총 횟수", en: "Total Count"},
    totalCardio: {ko: "총 유산소", en: "Total Cardio"},
    totalCarb: {ko: "총 탄수화물", en: "Total Carb"},
    totalFat: {ko: "총 지방", en: "Total Fat"},
    totalIn: {ko: "총 수입", en: "Total Income"},
    totalKcal: {ko: "총 칼로리", en: "Total Kcal"},
    totalOut: {ko: "총 지출", en: "Total Expense"},
    totalProtein: {ko: "총 단백질", en: "Total Protein"},
    totalVolume: {ko: "총 볼륨", en: "Total Volume"},

    // u
    // v
    verified: {ko: "인증", en: "Verified"},
    viewDay: {ko: "일별", en: "Day View"},
    viewMonth: {ko: "월별", en: "Month View"},
    viewSelect: {ko: "선택별", en: "Select View"},
    viewWeek: {ko: "주별", en: "Week View"},
    viewYear: {ko: "년별", en: "Year View"},
    volume: {ko: "볼륨", en: "Volume"},

    // w
    week: {ko: "주별", en: "Week"},
    weight: {ko: "체중", en: "Weight"},

    // x
    // y
    year: {ko: "년별", en: "Year"},

    // z
  };

  const translate = useCallback((key) => {
    const result = resources[key];
    if (!result) {
      return key;
    }
    return (
      (
        key.indexOf("calendar") === -1 &&
        key.indexOf("end") !== -1
      ) ? (
        <div className={"fs-0-6rem"}>
          {result[lang]}
        </div>
      ) : (
        key.indexOf("asc") !== -1 ||
        key.indexOf("desc") !== -1
      ) ? (
        <div className={"fs-0-7rem"}>
          {result[lang]}
        </div>
      ) : (
        result[lang]
      )
    );
  }, [lang]);

  return {translate};
};
