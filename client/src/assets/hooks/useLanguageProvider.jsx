// useLanguageProvider.jsx

import {React, useState, useEffect, useCallback} from "../../import/ImportReacts.jsx";
import {createContext, useContext} from "../../import/ImportReacts.jsx";
import {log} from "../../import/ImportUtils.jsx";

// -------------------------------------------------------------------------------------------------
// @ts-ignore
const LanguageContext = createContext();

// -------------------------------------------------------------------------------------------------
export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(sessionStorage.getItem('lang') || 'ko');

  useEffect(() => {
    sessionStorage.setItem('lang', lang);
    log("LanguageProvider", lang);
  }, [lang]);

  return (
    <LanguageContext.Provider value={{lang, setLang}}>
      {children}
    </LanguageContext.Provider>
  );
};

// -------------------------------------------------------------------------------------------------
export const useLanguage = () => (
  useContext(LanguageContext)
);

// -------------------------------------------------------------------------------------------------
export const useTranslate = () => {
  const {lang} = useLanguage();
  const resources = {
    // a
    all: {ko: "전체", en: "All"},
    age: {ko: "나이", en: "Age"},
    asc: {ko: "오름차순", en: "Asc"},
    alreadyId: {ko: "아이디가 있는 경우", en: "Already have an Account"},
    amount: {ko: "금액", en: "Amount"},
    avg: {ko: "평균", en: "Avg"},

    // b
    brand: {ko: "브랜드", en: "Brand"},
    breakfast: {ko: "아침", en: "Breakfast"},
    bedTime: {ko: "취침", en: "Bed"},

    // c
    c: {ko: "count", en: "count"},
    cm: {ko: "cm", en: "cm"},
    carb: {ko: "탄수화물", en: "Carb"},
    calendar: {ko: "일정", en: "calendar"},
    cardio: {ko: "유산소", en: "Cardio"},
    category: {ko: "분류", en: "Category"},
    content: {ko: "내용", en: "Content"},
    count: {ko: "항목수", en: "Count"},
    culture: {ko: "문화", en: "Culture"},
    currency: {ko: "₩", en: "$"},
    calendarTitle: {ko: "제목", en: "Title"},
    color: {ko: "색상", en: "Color"},

    // d
    dashBar: {ko: "목표", en: "Goal"},
    dashPie: {ko: "비율", en: "Proportion"},
    dashLine: {ko: "추이", en: "Trend"},
    dashAvg: {ko: "평균", en: "Average"},
    dataCategory: {ko: "카테고리", en: "Category"},
    dataCategory1: {ko: "분류 1", en: "Category 1"},
    dataCategory2: {ko: "분류 2", en: "Category 2"},
    dataCategory3: {ko: "분류 3", en: "Category 3"},
    dataDetail: {ko: "회원정보", en: "Information"},
    dataList: {ko: "데이터 리스트", en: "Data List"},
    dashList: {ko: "통계", en: "Statistics"},
    date: {ko: "날짜", en: "Date"},
    data: {ko: "데이터", en: "Data"},
    dateEnd: {ko: "종료일", en: "End Date"},
    dateStart: {ko: "시작일", en: "Start Date"},
    dateType: {ko: "유형", en: "Type"},
    day: {ko: "일별", en: "Day"},
    deletes: {ko: "회원탈퇴", en: "Delete"},
    desc: {ko: "내림차순", en: "Desc"},
    diff: {ko: "비교", en: "Diff"},
    diffList: {ko: "비교", en: "Comparison"},
    duration: {ko: "기간", en: "Duration"},
    dignity: {ko: "품위", en: "Dignity"},
    dinner: {ko: "저녁", en: "Dinner"},

    // e
    empty: {ko: "데이터가 없습니다", en: "No data"},
    Empty: {ko: "Empty", en: "Empty"},
    exercise: {ko: "운동", en: "exercise"},
    expense: {ko: "지출", en: "Expense"},
    entertainment: {ko: "유흥", en: "Entertainment"},

    // f
    female: {ko: "여성", en: "Female"},
    fat: {ko: "지방", en: "Fat"},
    find: {ko: "찾기", en: "Find"},
    findList: {ko: "찾기", en: "Find"},
    flowDefault: {ko: "기본값", en: "Default"},
    flowDummy: {ko: "추가", en: "Insert"},
    flowDeletes: {ko: "삭제", en: "Delete"},
    flowFind: {ko: "찾기", en: "Find"},
    flowLogin: {ko: "로그인", en: "Login"},
    flowLogout: {ko: "로그아웃", en: "Logout"},
    flowSave: {ko: "저장", en: "Save"},
    flowSignup: {ko: "회원가입", en: "Signup"},
    food: {ko: "식사", en: "food"},
    finance: {ko: "금융", en: "Finance"},
    foodCount: {ko: "회", en: "Count"},
    foodTitle: {ko: "식품명", en: "Food"},

    // g
    g: {ko: "g", en: "g"},
    gender: {ko: "성별", en: "Gender"},
    getCalendar: {ko: "달력", en: "Calendar"},
    getToday: {ko: "오늘", en: "Today"},
    goToFind: {ko: "더 찾기", en: "Find More"},
    goToFindSave: {ko: "완료", en: "Finish"},
    goToList: {ko: "리스트", en: "List"},
    goToLogin: {ko: "로그인", en: "Login"},
    goToSave: {ko: "저장", en: "Save"},
    goToSignup: {ko: "회원가입", en: "Signup"},
    goal: {ko: "목표", en: "Goal"},
    goalCardio: {ko: "유산소 목표", en: "Cardio Goals"},
    goalCarb: {ko: "탄수화물 목표", en: "Carb Goals"},
    goalCount: {ko: "횟수 목표", en: "Count Goals"},
    goalFat: {ko: "지방 목표", en: "Fat Goals"},
    goalIncome: {ko: "수입 목표", en: "Income Goals"},
    goalKcal: {ko: "칼로리 목표", en: "Kcal Goals"},
    goalList: {ko: "리스트(목표)", en: "List(Goal)"},
    goalMorning: {ko: "기상 목표", en: "WakeTime Goals"},
    goalNight: {ko: "취침 목표", en: "BedTime Goals"},
    goalExpense: {ko: "지출 목표", en: "Expense Goals"},
    goalProtein: {ko: "단백질 목표", en: "Protein Goals"},
    goalSave: {ko: "저장(목표)", en: "Save(Goal)"},
    goalSleepTime: {ko: "수면 목표", en: "Sleep Time Goals"},
    goalBedTime: {ko: "취침 목표", en: "Bed Time Goals"},
    goalWakeTime: {ko: "기상 목표", en: "Wake Time Goals"},
    goalVolume: {ko: "볼륨 목표", en: "Volume Goals"},
    goalWeight: {ko: "체중 목표", en: "Weight Goals"},
    gram: {ko: "그램", en: "Gram"},
    googleLogin: {ko: "구글 아이디로 로그인", en: "Login with Google"},
    googleSignup: {ko: "구글 아이디로 회원가입", en: "Signup with Google"},

    // h
    hm: {ko: "h:m", en: "h:m"},
    height: {ko: "키", en: "Height"},
    housing: {ko: "주거", en: "Housing"},
    health: {ko: "건강", en: "Health"},

    // i
    id: {ko: "아이디", en: "ID"},
    income: {ko: "수입", en: "Income"},
    incomeExpense: {ko: "수입-지출", en: "Income-Expense"},
    info: {ko: "정보", en: "Information"},
    isVerified: {ko: "인증되었습니다", en: "Verified"},
    isNotVerified: {ko: "인증 실패", en: "Not Verified"},

    // j
    join: {ko: "가입", en: "Join"},
    joinDate: {ko: "가입일", en: "Join Date"},

    // k
    k: {ko: "kcal", en: "kcal"},
    kcal: {ko: "칼로리", en: "Kcal"},
    kcalNut: {ko: "칼로리-영양소", en: "Kcal-Nutrition"},
    kg: {ko: "kg", en: "kg"},

    // l
    language: {ko: "언어", en: "Language"},
    lastLogin: {ko: "최근 로그인", en: "Last Login"},
    list: {ko: "리스트", en: "List"},
    login: {ko: "로그인", en: "Login"},
    logout: {ko: "로그아웃", en: "Logout"},
    lunch: {ko: "점심", en: "Lunch"},
    labor: {ko: "근로", en: "Labor"},

    // m
    memo: {ko: "메모", en: "Memo"},
    male: {ko: "남성", en: "Male"},
    money: {ko: "자산", en: "money"},
    month: {ko: "월별", en: "Month"},
    month1: {ko: "1월", en: "Month1"},
    month2: {ko: "2월", en: "Month2"},
    month3: {ko: "3월", en: "Month3"},
    month4: {ko: "4월", en: "Month4"},
    month5: {ko: "5월", en: "Month5"},
    month6: {ko: "6월", en: "Month6"},
    month7: {ko: "7월", en: "Month7"},
    month8: {ko: "8월", en: "Month8"},
    month9: {ko: "9월", en: "Month9"},
    month10: {ko: "10월", en: "Month10"},
    month11: {ko: "11월", en: "Month11"},
    month12: {ko: "12월", en: "Month12"},

    // n
    noData: {ko: "삭제할 데이터가 없습니다", en: "No data to delete"},
    notId: {ko: "아이디가 없는 경우", en: "Don't have an Account"},
    nutrition: {ko: "영양소", en: "Nutrition"},
    nut: {ko: "영양소", en: "Nutrition"},

    // o
    others: {ko: "기타", en: "Others"},

    // p
    p: {ko: "per", en: "per"},
    part: {ko: "분류1", en: "Part"},
    partTitle: {ko: "부위-운동", en: "Part-Exercise"},
    property: {ko: "자산", en: "Property"},
    protein: {ko: "단백질", en: "Protein"},
    pw: {ko: "비밀번호", en: "PW"},
    pwConfirm: {ko: "비밀번호 확인", en: "PW Confirm"},
    proportion: {ko: "비율", en: "Proportion"},

    // q
    quantity: {ko: "수량", en: "Quantity"},
    question: {ko: "질문", en: "Question"},

    // r
    r: {ko: "rep", en: "rep"},
    real: {ko: "실제", en: "Real"},
    rep: {ko: "횟수", en: "Rep"},
    regDt: {ko: "가입일", en: "Signup Date"},

    // s
    s: {ko: "set", en: "set"},
    save: {ko: "저장", en: "Save"},
    score: {ko: "* 평균점수 : 1.00 ~ 5.00", en: "* Average score : 1.00 ~ 5.00"},
    select: {ko: "선택별", en: "Select"},
    serv: {ko: "1회 제공량", en: "Serving"},
    set: {ko: "세트", en: "Set"},
    signup: {ko: "회원가입", en: "Signup"},
    sleep: {ko: "수면", en: "sleep"},
    sleepTime: {ko: "수면", en: "Sleep"},
    sort: {ko: "정렬", en: "Sort"},
    send: {ko: "전송", en: "Send"},
    signupDate: {ko: "가입일", en: "Signup Date"},
    saveId: {ko: "아이디 저장", en: "Save ID"},
    savings: {ko: "저축", en: "Savings"},
    snack: {ko: "간식", en: "Snack"},

    // t
    trend: {ko: "추이", en: "Trend"},
    today: {ko: "오늘", en: "Today"},
    title: {ko: "분류2", en: "Title"},
    total: {ko: "총합", en: "total"},
    totalCount: {ko: "총 횟수", en: "Total Count"},
    totalCardio: {ko: "총 유산소", en: "Total Cardio"},
    totalCarb: {ko: "총 탄수화물", en: "Total Carb"},
    totalFat: {ko: "총 지방", en: "Total Fat"},
    totalIncome: {ko: "총 수입", en: "Total Income"},
    totalKcal: {ko: "총 칼로리", en: "Total Kcal"},
    totalExpense: {ko: "총 지출", en: "Total Expense"},
    totalProtein: {ko: "총 단백질", en: "Total Protein"},
    totalVolume: {ko: "총 볼륨", en: "Total Volume"},
    transportation: {ko: "교통", en: "Transportation"},

    // u
    unknown: {ko: "선택하지 않음", en: "Unknown"},

    // v
    verify: {ko: "인증", en: "Verify"},
    viewDay: {ko: "일별", en: "Day View"},
    viewMonth: {ko: "월별", en: "Month View"},
    viewSelect: {ko: "선택별", en: "Select View"},
    viewWeek: {ko: "주별", en: "Week View"},
    viewYear: {ko: "년별", en: "Year View"},
    volume: {ko: "볼륨", en: "Volume"},
    volumeCardio: {ko: "볼륨-유산소", en: "Volume-Cardio"},

    // w
    won: {ko: "₩", en: "₩"},
    week: {ko: "주별", en: "Week"},
    weight: {ko: "체중", en: "Weight"},
    wakeTime: {ko: "기상", en: "Wake"},
    week1: {ko: "1주차", en: "Week1"},
    week2: {ko: "2주차", en: "Week2"},
    week3: {ko: "3주차", en: "Week3"},
    week4: {ko: "4주차", en: "Week4"},
    week5: {ko: "5주차", en: "Week5"},
    week6: {ko: "6주차", en: "Week6"},

    // x
    xl: {ko: "대", en: "XL"},

    // y
    year: {ko: "년별", en: "Year"},

    // z

    // day
    mon: {ko: "월", en: "Mon"},
    tue: {ko: "화", en: "Tue"},
    wed: {ko: "수", en: "Wed"},
    thu: {ko: "목", en: "Thu"},
    fri: {ko: "금", en: "Fri"},
    sat: {ko: "토", en: "Sat"},
    sun: {ko: "일", en: "Sun"},

    // exercise
    chest: {ko: "가슴", en: "Chest"},
    back: {ko: "등", en: "Back"},
    shoulder: {ko: "어깨", en: "Shoulder"},
    biceps: {ko: "이두", en: "Biceps"},
    triceps: {ko: "삼두", en: "Triceps"},
    deadLift: {ko: "데드리프트", en: "Dead Lift"},
    barbellRow: {ko: "바벨로우", en: "Barbell Row"},
    dumbbellRow: {ko: "덤벨로우", en: "Dumbbell Row"},
    seatedRow: {ko: "시티드로우", en: "Seated Row"},
    latPulldown: {ko: "랫풀다운", en: "Lat Pulldown"},
    pullUp: {ko: "풀업", en: "Pull-Up"},
    backSquat: {ko: "백스쿼트", en: "Back Squat"},
    frontSquat: {ko: "프론트스쿼트", en: "Front Squat"},
    hackSquat: {ko: "핵스쿼트", en: "Hack Squat"},
    barbellLunge: {ko: "바벨런지", en: "Barbell Lunge"},
    dumbbellLunge: {ko: "덤벨런지", en: "Dumbbell Lunge"},
    leg: {ko: "하체", en: "Leg"},
    legPress: {ko: "레그프레스", en: "Leg Press"},
    legExtension: {ko: "레그익스텐션", en: "Leg Extension"},
    legCurl: {ko: "레그컬", en: "Leg Curl"},
    barbellBenchPress: {ko: "바벨벤치프레스", en: "Barbell Bench Press"},
    dumbbellBenchPress: {ko: "덤벨벤치프레스", en: "Dumbbell Bench Press"},
    machineBenchPress: {ko: "머신벤치프레스", en: "Machine Bench Press"},
    inclineBenchPress: {ko: "인클라인벤치프레스", en: "Incline Bench Press"},
    declineBenchPress: {ko: "디클라인벤치프레스", en: "Decline Bench Press"},
    dumbbellFly: {ko: "덤벨플라이", en: "Dumbbell Fly"},
    cableFly: {ko: "케이블플라이", en: "Cable Fly"},
    cableCrossover: {ko: "케이블크로스오버", en: "Cable Crossover"},
    dips: {ko: "딥스", en: "Dips"},
    pushUp: {ko: "푸시업", en: "Push-Up"},
    militaryPress: {ko: "밀리터리프레스", en: "Military Press"},
    barbellPress: {ko: "바벨프레스", en: "Barbell Press"},
    dumbbellPress: {ko: "덤벨프레스", en: "Dumbbell Press"},
    machinePress: {ko: "머신프레스", en: "Machine Press"},
    behindNeckPress: {ko: "비하인드넥프레스", en: "Behind-The-Neck Press"},
    frontLateralRaise: {ko: "프론트레터럴레이즈", en: "Front Lateral Raise"},
    sideLateralRaise: {ko: "사이드레터럴레이즈", en: "Side Lateral Raise"},
    bentOverLateralRaise: {ko: "벤트오버레터럴레이즈", en: "Bent-Over Lateral Raise"},
    facePull: {ko: "페이스풀", en: "Face Pull"},
    lyingTricepsExtension: {ko: "라잉트라이셉스익스텐션", en: "Lying Triceps Extension"},
    dumbbellTricepsExtension: {ko: "덤벨트라이셉스익스텐션", en: "Dumbbell Triceps Extension"},
    overheadTricepsExtension: {ko: "오버헤드트라이셉스익스텐션", en: "Overhead Triceps Extension"},
    closeGripBenchPress: {ko: "클로즈그립벤치프레스", en: "Close-Grip Bench Press"},
    cableTricepsPushDown: {ko: "케이블트라이셉스푸쉬다운", en: "Cable Triceps Push Down"},
    cableTricepsRopeDown: {ko: "케이블트라이셉스로프다운", en: "Cable Triceps Rope Down"},
    kickback: {ko: "킥백", en: "Kickback"},
    barbellCurl: {ko: "바벨컬", en: "Barbell Curl"},
    dumbbellCurl: {ko: "덤벨컬", en: "Dumbbell Curl"},
    hammerCurl: {ko: "해머컬", en: "Hammer Curl"},
    machineCurl: {ko: "머신컬", en: "Machine Curl"},
    cableCurl: {ko: "케이블컬", en: "Cable Curl"},
    barbellPreacherCurl: {ko: "바벨프리처컬", en: "Barbell Preacher Curl"},
    dumbbellPreacherCurl: {ko: "덤벨프리처컬", en: "Dumbbell Preacher Curl"},
    walking: {ko: "걷기", en: "Walking"},
    running: {ko: "달리기", en: "Running"},
    stepper: {ko: "스텝퍼", en: "Stepper"},
    cycling: {ko: "사이클", en: "Cycling"},
    swimming: {ko: "수영", en: "Swimming"},
    plank: {ko: "플랭크", en: "Plank"},
    rest: {ko: "휴식", en: "Rest"},

    // gender
    M: {ko: "남성", en: "Male"},
    F: {ko: "여성", en: "Female"},
    N: {ko: "선택하지 않음", en: "Unknown"},

    // error alert
    errorFoodPart: {ko: "분류1을 선택해주세요", en: "Please select Part"},
    errorFoodTitle: {ko: "식품명을 입력해주세요", en: "Please enter Food"},
    errorFoodCount: {ko: "수량을 입력해주세요", en: "Please enter Count"},
    errorFoodGram: {ko: "그램을 입력해주세요", en: "Please enter Gram"},
    errorFoodKcal: {ko: "칼로리를 입력해주세요", en: "Please enter Kcal"},
    errorFoodCarb: {ko: "탄수화물을 입력해주세요", en: "Please enter Carb"},
    errorFoodProtein: {ko: "단백질을 입력해주세요", en: "Please enter Protein"},
    errorFoodFat: {ko: "지방을 입력해주세요", en: "Please enter Fat"},
    errorMoneyPart: {ko: "분류1을 선택해주세요", en: "Please select Part"},
    errorMoneyTitle: {ko: "분류2를 선택해주세요", en: "Please select Title"},
    errorMoneyAmount: {ko: "금액을 입력해주세요", en: "Please enter Amount"},
  };

  const translate = useCallback((key, className) => {
    const result = resources[key];
    if (!result) {
      return key;
    }
    return result[lang];
  }, [lang]);

  return {translate};
};
