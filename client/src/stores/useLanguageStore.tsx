// useLanguageStore.ts

import { create } from "@imports/ImportUtils";

// -------------------------------------------------------------------------------------------------
declare type LanguageState = {
  lang: string;
  setLang: (lang: string) => void;
  translate: (key: string) => string;
}

// -------------------------------------------------------------------------------------------------
export const useLanguageStore = create<LanguageState>((set, get) => ({
  lang: "en",
  setLang: (lang: string) => set({ lang }),
  translate: (key: string) => {

    const { lang } = get();
    const resources: Record<string, any> = {

      // -------------------------------------------------------------------------------------------
      // a
      all: {
        ko: "전체",
        en: "All"
      },
      age: {
        ko: "나이",
        en: "Age"
      },
      asc: {
        ko: "오름차순",
        en: "Asc"
      },
      autoLogin: {
        ko: "자동로그인",
        en: "Auto Login"
      },
      alreadyId: {
        ko: "아이디가 있는 경우",
        en: "Already have an Account"
      },
      amount: {
        ko: "금액",
        en: "Amount"
      },
      avg: {
        ko: "평균값",
        en: "Avg"
      },
      analyze: {
        ko: "분석",
        en: "Analyze"
      },
      analyzeTabs: {
        ko: "분석",
        en: "Analyze"
      },
      appInfo: {
        ko: "앱 정보",
        en: "App Info"
      },

      // -------------------------------------------------------------------------------------------
      // b
      brand: {
        ko: "브랜드",
        en: "Brand"
      },
      breakfast: {
        ko: "아침",
        en: "Breakfast"
      },
      bedTime: {
        ko: "취침",
        en: "Bed"
      },

      // -------------------------------------------------------------------------------------------
      // c
      c: {
        ko: "cnt",
        en: "cnt"
      },
      cm: {
        ko: "cm",
        en: "cm"
      },
      carb: {
        ko: "탄수화물",
        en: "Carb"
      },
      calendar: {
        ko: "일정",
        en: "calendar"
      },
      cardio: {
        ko: "유산소",
        en: "Cardio"
      },
      category: {
        ko: "분류 편집",
        en: "Edit Category"
      },
      content: {
        ko: "내용",
        en: "Content"
      },
      count: {
        ko: "항목",
        en: "Count"
      },
      culture: {
        ko: "문화",
        en: "Culture"
      },
      currency: {
        ko: "₩",
        en: "$"
      },
      calendarTitle: {
        ko: "제목",
        en: "Title"
      },
      color: {
        ko: "색상",
        en: "Color"
      },
      chart: {
        ko: "분석",
        en: "Analysis"
      },
      chartBar: {
        ko: "목표",
        en: "Goal"
      },
      chartPie: {
        ko: "비율",
        en: "Proportion"
      },
      chartLine: {
        ko: "추이",
        en: "Trend"
      },
      chartAvg: {
        ko: "평균",
        en: "Average"
      },
      curProperty: {
        ko: "현재 자산",
        en: "Current Property"
      },
      close: {
        ko: "닫기",
        en: "Close"
      },
      curScale: {
        ko: "현재 체중",
        en: "Current Weight"
      },
      confirm: {
        ko: "확인",
        en: "Confirm"
      },

      // -------------------------------------------------------------------------------------------
      // d
      done: {
        ko: "완료",
        en: "Done"
      },
      delete: {
        ko: "삭제",
        en: "Delete"
      },
      deleteAll: {
        ko: "전체삭제",
        en: "Delete All"
      },
      deleteUser: {
        ko: "탈퇴 후에는 복구가 불가능합니다.\n정말로 탈퇴하시겠습니까?",
        en: "Withdrawal is irreversible.\nDo you really want to withdraw?"
      },
      user_dataCategory: {
        ko: "카테고리 편집",
        en: "Edit Category"
      },
      dataCategory1: {
        ko: "분류 1",
        en: "Category 1"
      },
      dataCategory2: {
        ko: "분류 2",
        en: "Category 2"
      },
      dataCategory3: {
        ko: "분류 3",
        en: "Category 3"
      },
      dataDetail: {
        ko: "회원정보",
        en: "Information"
      },
      dataList: {
        ko: "데이터 리스트",
        en: "Data List"
      },
      chartList: {
        ko: "통계",
        en: "Statistics"
      },
      date: {
        ko: "날짜",
        en: "Date"
      },
      data: {
        ko: "데이터",
        en: "Data"
      },
      dateEnd: {
        ko: "종료일",
        en: "End Date"
      },
      dateStart: {
        ko: "시작일",
        en: "Start Date"
      },
      dateType: {
        ko: "유형",
        en: "Type"
      },
      day: {
        ko: "일별",
        en: "Day"
      },
      desc: {
        ko: "내림차순",
        en: "Desc"
      },
      diff: {
        ko: "비교",
        en: "Diff"
      },
      diffList: {
        ko: "비교",
        en: "Comparison"
      },
      duration: {
        ko: "기간",
        en: "Duration"
      },
      dignity: {
        ko: "품위",
        en: "Dignity"
      },
      dinner: {
        ko: "저녁",
        en: "Dinner"
      },
      dash: {
        ko: "대시보드",
        en: "Dashboard"
      },
      dataAlreadyExist: {
        ko: "해당 날짜의 데이터가 이미 존재합니다.\n수정하시겠습니까?",
        en: "Data for the date already exists.\nDo you want to update?"
      },

      // -------------------------------------------------------------------------------------------
      // e
      Empty: {
        ko: "Empty",
        en: "Empty"
      },
      empty: {
        ko: "데이터가 없습니다",
        en: "No Data"
      },
      exercise: {
        ko: "운동",
        en: "exercise"
      },
      expense: {
        ko: "지출",
        en: "Expense"
      },
      entertainment: {
        ko: "유흥",
        en: "Entertainment"
      },
      errorCount: {
        ko: "항목을 추가해주세요",
        en: "Please add an item"
      },
      exerciseCount: {
        ko: "횟수",
        en: "Count"
      },
      exercisePart: {
        ko: "부위",
        en: "Part"
      },
      exerciseTitle: {
        ko: "운동명",
        en: "Exercise"
      },

      // -------------------------------------------------------------------------------------------
      // f
      female: {
        ko: "여성",
        en: "Female"
      },
      favorite: {
        ko: "즐겨찾기",
        en: "Favorite"
      },
      fat: {
        ko: "지방",
        en: "Fat"
      },
      find: {
        ko: "찾기",
        en: "Find"
      },
      findList: {
        ko: "찾기",
        en: "Find"
      },
      findMore: {
        ko: "더 찾기",
        en: "Find More"
      },
      flowDefault: {
        ko: "기본값",
        en: "Default"
      },
      flowDummy: {
        ko: "추가",
        en: "Insert"
      },
      flowDummySave: {
        ko: "추가",
        en: "Insert"
      },
      flowDummyDelete: {
        ko: "삭제",
        en: "Delete"
      },
      flowDummyDeleteAll: {
        ko: "전체삭제",
        en: "Delete All"
      },
      flowDelete: {
        ko: "삭제",
        en: "Delete"
      },
      flowFind: {
        ko: "찾기",
        en: "Find"
      },
      flowLogin: {
        ko: "로그인",
        en: "Login"
      },
      flowLogout: {
        ko: "로그아웃",
        en: "Logout"
      },
      flowSave: {
        ko: "저장",
        en: "Save"
      },
      flowSignup: {
        ko: "회원가입",
        en: "Signup"
      },
      food: {
        ko: "식사",
        en: "food"
      },
      finance: {
        ko: "금융",
        en: "Finance"
      },
      foodCount: {
        ko: "회",
        en: "Count"
      },
      foodName: {
        ko: "식품명",
        en: "Food"
      },
      foodBrand: {
        ko: "브랜드",
        en: "Brand"
      },
      findFood: {
        ko: "음식",
        en: "Food"
      },
      forgotPw: {
        ko: "비밀번호를 잊은 경우",
        en: "Forgot Password"
      },

      // -------------------------------------------------------------------------------------------
      // g
      g: {
        ko: "g",
        en: "g"
      },
      gender: {
        ko: "성별",
        en: "Gender"
      },
      getCalendar: {
        ko: "달력",
        en: "Calendar"
      },
      getDay: {
        ko: "오늘",
        en: "Today"
      },
      goToFind: {
        ko: "더 찾기",
        en: "Find More"
      },
      goToFindSave: {
        ko: "완료",
        en: "Finish"
      },
      goToList: {
        ko: "리스트",
        en: "List"
      },
      goToLogin: {
        ko: "로그인",
        en: "Login"
      },
      goToSave: {
        ko: "저장",
        en: "Save"
      },
      goToSignup: {
        ko: "회원가입",
        en: "Signup"
      },
      goal: {
        ko: "목표",
        en: "Goal"
      },
      goalTabs: {
        ko: "목표",
        en: "Goal"
      },
      goalCardio: {
        ko: "유산소 목표",
        en: "Cardio Goals"
      },
      goalCarb: {
        ko: "탄수화물 목표",
        en: "Carb Goals"
      },
      goalCount: {
        ko: "횟수 목표",
        en: "Count Goals"
      },
      goalFat: {
        ko: "지방 목표",
        en: "Fat Goals"
      },
      goalIncome: {
        ko: "수입 목표",
        en: "Income Goals"
      },
      goalKcal: {
        ko: "칼로리 목표",
        en: "Kcal Goals"
      },
      goalList: {
        ko: "리스트(목표)",
        en: "List(Goal)"
      },
      goalExpense: {
        ko: "지출 목표",
        en: "Expense Goals"
      },
      goalProtein: {
        ko: "단백질 목표",
        en: "Protein Goals"
      },
      goalSave: {
        ko: "저장(목표)",
        en: "Save(Goal)"
      },
      goalSleepTime: {
        ko: "수면 목표",
        en: "Sleep Time Goals"
      },
      goalBedTime: {
        ko: "취침 목표",
        en: "Bed Time Goals"
      },
      goalWakeTime: {
        ko: "기상 목표",
        en: "Wake Time Goals"
      },
      goalVolume: {
        ko: "볼륨 목표",
        en: "Volume Goals"
      },
      goalWeight: {
        ko: "체중 목표",
        en: "Weight Goals"
      },
      gram: {
        ko: "그램",
        en: "Gram"
      },
      googleLogin: {
        ko: "구글 아이디로 로그인",
        en: "Login with Google"
      },
      googleSignup: {
        ko: "구글 아이디로 회원가입",
        en: "Signup with Google"
      },

      // -------------------------------------------------------------------------------------------
      // h
      hm: {
        ko: "h:m",
        en: "h:m"
      },
      height: {
        ko: "키",
        en: "Height"
      },
      housing: {
        ko: "주거",
        en: "Housing"
      },
      health: {
        ko: "건강",
        en: "Health"
      },
      helperId: {
        ko: "이메일 형식으로 입력해주세요",
        en: "Please enter your email address"
      },
      helperIdVerified: {
        ko: "이메일 인증을 완료해주세요",
        en: "Please verify your email address"
      },
      helperPw: {
        ko: "영문, 숫자, 특수문자 포함 8자 이상 입력해주세요",
        en: "Please enter 8 or more characters including letters, numbers, and special characters"
      },
      helperPwVerified: {
        ko: "비밀번호 확인을 입력해주세요",
        en: "Please enter your password confirmation"
      },
      helperScale: {
        ko: "현재 체중을 입력해주세요",
        en: "Please enter your current weight"
      },
      helperProperty: {
        ko: "현재 자산을 입력해주세요",
        en: "Please enter your current property"
      },

      // -------------------------------------------------------------------------------------------
      // i
      item: {
        ko: "항목",
        en: "Item"
      },
      id: {
        ko: "아이디",
        en: "ID"
      },
      income: {
        ko: "수입",
        en: "Income"
      },
      incomeExpense: {
        ko: "수입-지출",
        en: "Income-Expense"
      },
      info: {
        ko: "정보",
        en: "Information"
      },
      isVerified: {
        ko: "인증되었습니다",
        en: "Verified"
      },
      isNotVerified: {
        ko: "인증 실패",
        en: "Not Verified"
      },
      initProperty: {
        ko: "초기 자산",
        en: "Initial Property"
      },
      initScale: {
        ko: "초기 체중",
        en: "Initial Weight"
      },
      insert: {
        ko: "추가",
        en: "Insert"
      },
      includingExclusions: {
        ko: "제외 항목 포함",
        en: "Including Exclusions"
      },
      includeProperty: {
        ko: "자산에 포함",
        en: "Include in Property"
      },

      // -------------------------------------------------------------------------------------------
      // j
      join: {
        ko: "가입",
        en: "Join"
      },
      joinDate: {
        ko: "가입일",
        en: "Join Date"
      },

      // -------------------------------------------------------------------------------------------
      // k
      kc: {
        ko: "kcal",
        en: "kcal"
      },
      kcal: {
        ko: "칼로리",
        en: "Kcal"
      },
      kcalNut: {
        ko: "칼로리-영양소",
        en: "Kcal-Nutrition"
      },
      k: {
        ko: "kg",
        en: "kg"
      },
      kg: {
        ko: "무게",
        en: "Kg"
      },

      // -------------------------------------------------------------------------------------------
      // l
      locale: {
        ko: "언어",
        en: "Locale"
      },
      language: {
        ko: "언어",
        en: "Language"
      },
      lastLogin: {
        ko: "최근 로그인",
        en: "Last Login"
      },
      list: {
        ko: "리스트",
        en: "List"
      },
      listTabs: {
        ko: "리스트",
        en: "List"
      },
      login: {
        ko: "로그인",
        en: "Login"
      },
      logout: {
        ko: "로그아웃",
        en: "Logout"
      },
      lunch: {
        ko: "점심",
        en: "Lunch"
      },
      labor: {
        ko: "근로",
        en: "Labor"
      },
      itemLock: {
        ko: "항목 잠금",
        en: "Item Lock"
      },
      locked: {
        ko: "잠김",
        en: "Locked"
      },
      unlocked: {
        ko: "열림",
        en: "Unlocked"
      },

      // -------------------------------------------------------------------------------------------
      // m
      monthScore: {
        ko: "월간 목표 달성 점수",
        en: "Monthly Goal Achievement Score"
      },
      minScale: {
        ko: "최저 체중",
        en: "Min Weight"
      },
      maxScale: {
        ko: "최고 체중",
        en: "Max Weight"
      },
      memo: {
        ko: "메모",
        en: "Memo"
      },
      male: {
        ko: "남성",
        en: "Male"
      },
      money: {
        ko: "자산",
        en: "money"
      },
      moneyInclude: {
        ko: "자산에 포함",
        en: "Include in Property"
      },
      month: {
        ko: "월별",
        en: "Month"
      },
      month1: {
        ko: "1월",
        en: "Month1"
      },
      month2: {
        ko: "2월",
        en: "Month2"
      },
      month3: {
        ko: "3월",
        en: "Month3"
      },
      month4: {
        ko: "4월",
        en: "Month4"
      },
      month5: {
        ko: "5월",
        en: "Month5"
      },
      month6: {
        ko: "6월",
        en: "Month6"
      },
      month7: {
        ko: "7월",
        en: "Month7"
      },
      month8: {
        ko: "8월",
        en: "Month8"
      },
      month9: {
        ko: "9월",
        en: "Month9"
      },
      month10: {
        ko: "10월",
        en: "Month10"
      },
      month11: {
        ko: "11월",
        en: "Month11"
      },
      month12: {
        ko: "12월",
        en: "Month12"
      },

      // -------------------------------------------------------------------------------------------
      // n
      nation: {
        ko: "국가",
        en: "Nation"
      },
      new: {
        ko: "신규",
        en: "New"
      },
      noData: {
        ko: "삭제할 데이터가 없습니다",
        en: "No data to delete"
      },
      notId: {
        ko: "아이디가 없는 경우",
        en: "Don't have an Account"
      },
      nutrition: {
        ko: "영양소",
        en: "Nutrition"
      },
      nut: {
        ko: "영양소",
        en: "Nutrition"
      },
      notFound: {
        ko: "결과가 없습니다",
        en: "result is not available"
      },
      newPw: {
        ko: "새 비밀번호",
        en: "New PW"
      },
      newPwVerified: {
        ko: "새 비밀번호 확인",
        en: "New PW Confirm"
      },

      // -------------------------------------------------------------------------------------------
      // o
      others: {
        ko: "기타",
        en: "Others"
      },
      open: {
        ko: "열기",
        en: "Open"
      },
      openAll: {
        ko: "전체 열기",
        en: "Open All"
      },
      closeAll: {
        ko: "전체 닫기",
        en: "Close All"
      },

      // -------------------------------------------------------------------------------------------
      // p
      p: {
        ko: "per",
        en: "per"
      },
      part: {
        ko: "대분류",
        en: "Part"
      },
      partTitle: {
        ko: "부위-운동",
        en: "Part-Exercise"
      },
      property: {
        ko: "자산",
        en: "Property"
      },
      protein: {
        ko: "단백질",
        en: "Protein"
      },
      pw: {
        ko: "비밀번호",
        en: "PW"
      },
      pwVerified: {
        ko: "비밀번호 확인",
        en: "PW Confirm"
      },
      proportion: {
        ko: "비율",
        en: "Proportion"
      },
      pwDoesNotMatch: {
        ko: "비밀번호가 일치하지 않습니다",
        en: "Passwords do not match"
      },

      // -------------------------------------------------------------------------------------------
      // q
      query: {
        ko: "검색어",
        en: "Query"
      },
      quantity: {
        ko: "수량",
        en: "Quantity"
      },
      question: {
        ko: "질문",
        en: "Question"
      },

      // -------------------------------------------------------------------------------------------
      // r
      r: {
        ko: "rep",
        en: "rep"
      },
      real: {
        ko: "실제",
        en: "Real"
      },
      realTabs: {
        ko: "실제",
        en: "Real"
      },
      realList: {
        ko: "리스트(실제)",
        en: "List"
      },
      realSave: {
        ko: "저장(실제)",
        en: "Save"
      },
      rep: {
        ko: "횟수",
        en: "Rep"
      },
      regDt: {
        ko: "가입일",
        en: "Signup Date"
      },
      replace: {
        ko: "교체",
        en: "Replace"
      },
      resetPw: {
        ko: "비밀번호 변경",
        en: "Reset Password"
      },
      replaceOrInsert: {
        ko: "해당 날짜의 데이터가 이미 존재합니다.\n교체 또는 추가를 선택해주세요",
        en: "Data for the date already exists.\nPlease select replace or insert"
      },

      // -------------------------------------------------------------------------------------------
      // s
      s: {
        ko: "set",
        en: "set"
      },
      search: {
        ko: "검색",
        en: "Search"
      },
      save: {
        ko: "저장",
        en: "Save"
      },
      saveTabs: {
        ko: "저장",
        en: "Save"
      },
      saveAll: {
        ko: "전체저장",
        en: "Save All"
      },
      score: {
        ko: "* 평균점수 : 1.00 ~ 5.00",
        en: "* Average score : 1.00 ~ 5.00"
      },
      select: {
        ko: "선택별",
        en: "Select"
      },
      serv: {
        ko: "1회 제공량",
        en: "Serving"
      },
      set: {
        ko: "세트",
        en: "Set"
      },
      signup: {
        ko: "회원가입",
        en: "Signup"
      },
      sleep: {
        ko: "수면",
        en: "sleep"
      },
      sleepTime: {
        ko: "수면",
        en: "Sleep"
      },
      sort: {
        ko: "정렬",
        en: "Sort"
      },
      send: {
        ko: "전송",
        en: "Send"
      },
      signupDate: {
        ko: "가입일",
        en: "Signup Date"
      },
      saveId: {
        ko: "아이디 저장",
        en: "Save ID"
      },
      savings: {
        ko: "저축",
        en: "Savings"
      },
      snack: {
        ko: "간식",
        en: "Snack"
      },
      schedule: {
        ko: "일정",
        en: "Schedule"
      },
      selectDate: {
        ko: "날짜선택",
        en: "Select"
      },
      scale: {
        ko: "체중",
        en: "Weight"
      },
      sumIncome: {
        ko: "총 수입",
        en: "Total Income"
      },
      sumExpense: {
        ko: "총 지출",
        en: "Total Expense"
      },

      // -------------------------------------------------------------------------------------------
      // t
      toSave: {
        ko: "저장하기",
        en: "To Save"
      },
      toUpdate: {
        ko: "수정하기",
        en: "To Update"
      },
      toDelete: {
        ko: "삭제하기",
        en: "To Delete"
      },
      toFind: {
        ko: "찾기",
        en: "To Find"
      },
      toList: {
        ko: "리스트",
        en: "To List"
      },
      trend: {
        ko: "추이",
        en: "Trend"
      },
      today: {
        ko: "오늘",
        en: "Today"
      },
      thisToday: {
        ko: "오늘",
        en: "Today"
      },
      thisWeek: {
        ko: "이번주",
        en: "Week"
      },
      thisMonth: {
        ko: "이번달",
        en: "Month"
      },
      thisYear: {
        ko: "올해",
        en: "Year"
      },
      title: {
        ko: "소분류",
        en: "Title"
      },
      total: {
        ko: "총합",
        en: "total"
      },
      totalCount: {
        ko: "총 횟수",
        en: "Total Count"
      },
      totalCardio: {
        ko: "총 유산소",
        en: "Total Cardio"
      },
      totalCarb: {
        ko: "총 탄수화물",
        en: "Total Carb"
      },
      totalFat: {
        ko: "총 지방",
        en: "Total Fat"
      },
      totalIncome: {
        ko: "총 수입",
        en: "Total Income"
      },
      totalKcal: {
        ko: "총 칼로리",
        en: "Total Kcal"
      },
      totalExpense: {
        ko: "총 지출",
        en: "Total Expense"
      },
      totalProtein: {
        ko: "총 단백질",
        en: "Total Protein"
      },
      totalVolume: {
        ko: "총 볼륨",
        en: "Total Volume"
      },
      transportation: {
        ko: "교통",
        en: "Transportation"
      },

      // -------------------------------------------------------------------------------------------
      // u
      update: {
        ko: "수정",
        en: "Update"
      },
      unknown: {
        ko: "선택하지 않음",
        en: "Unknown"
      },
      userDelete: {
        ko: "회원탈퇴",
        en: "Withdrawal"
      },

      // -------------------------------------------------------------------------------------------
      // v
      verify: {
        ko: "인증",
        en: "Verify"
      },
      viewDay: {
        ko: "일별",
        en: "Day View"
      },
      viewMonth: {
        ko: "월별",
        en: "Month View"
      },
      viewSelect: {
        ko: "날짜선택",
        en: "Select View"
      },
      viewWeek: {
        ko: "주별",
        en: "Week View"
      },
      viewYear: {
        ko: "년별",
        en: "Year View"
      },
      volume: {
        ko: "볼륨",
        en: "Volume"
      },
      volumeCardio: {
        ko: "볼륨-유산소",
        en: "Volume-Cardio"
      },

      // -------------------------------------------------------------------------------------------
      // w
      won: {
        ko: "₩",
        en: "₩"
      },
      week: {
        ko: "주별",
        en: "Week"
      },
      weight: {
        ko: "체중",
        en: "Weight"
      },
      wakeTime: {
        ko: "기상",
        en: "Wake"
      },
      week1: {
        ko: "1주차",
        en: "Week1"
      },
      week2: {
        ko: "2주차",
        en: "Week2"
      },
      week3: {
        ko: "3주차",
        en: "Week3"
      },
      week4: {
        ko: "4주차",
        en: "Week4"
      },
      week5: {
        ko: "5주차",
        en: "Week5"
      },
      week6: {
        ko: "6주차",
        en: "Week6"
      },

      // -------------------------------------------------------------------------------------------
      // x
      xl: {
        ko: "대",
        en: "XL"
      },

      // -------------------------------------------------------------------------------------------
      // y
      year: {
        ko: "년별",
        en: "Year"
      },

      // -------------------------------------------------------------------------------------------
      // gender
      M: {
        ko: "남성",
        en: "Male"
      },
      F: {
        ko: "여성",
        en: "Female"
      },
      N: {
        ko: "선택하지 않음",
        en: "Unknown"
      },

      // -------------------------------------------------------------------------------------------
      // day
      mon: {
        ko: "월",
        en: "Mon"
      },
      Mon: {
        ko: "월",
        en: "Mon"
      },
      tue: {
        ko: "화",
        en: "Tue"
      },
      Tue: {
        ko: "화",
        en: "Tue"
      },
      wed: {
        ko: "수",
        en: "Wed"
      },
      Wed: {
        ko: "수",
        en: "Wed"
      },
      thu: {
        ko: "목",
        en: "Thu"
      },
      Thu: {
        ko: "목",
        en: "Thu"
      },
      fri: {
        ko: "금",
        en: "Fri"
      },
      Fri: {
        ko: "금",
        en: "Fri"
      },
      sat: {
        ko: "토",
        en: "Sat"
      },
      Sat: {
        ko: "토",
        en: "Sat"
      },
      sun: {
        ko: "일",
        en: "Sun"
      },
      Sun: {
        ko: "일",
        en: "Sun"
      },

      // -------------------------------------------------------------------------------------------
      // exercise
      chest: {
        ko: "가슴",
        en: "Chest"
      },
      back: {
        ko: "등",
        en: "Back"
      },
      shoulder: {
        ko: "어깨",
        en: "Shoulder"
      },
      biceps: {
        ko: "이두",
        en: "Biceps"
      },
      triceps: {
        ko: "삼두",
        en: "Triceps"
      },
      deadLift: {
        ko: "데드리프트",
        en: "Dead Lift"
      },
      barbellRow: {
        ko: "바벨로우",
        en: "Barbell Row"
      },
      dumbbellRow: {
        ko: "덤벨로우",
        en: "Dumbbell Row"
      },
      seatedRow: {
        ko: "시티드로우",
        en: "Seated Row"
      },
      latPulldown: {
        ko: "랫풀다운",
        en: "Lat Pulldown"
      },
      pullUp: {
        ko: "풀업",
        en: "Pull-Up"
      },
      backSquat: {
        ko: "백스쿼트",
        en: "Back Squat"
      },
      frontSquat: {
        ko: "프론트스쿼트",
        en: "Front Squat"
      },
      hackSquat: {
        ko: "핵스쿼트",
        en: "Hack Squat"
      },
      barbellLunge: {
        ko: "바벨런지",
        en: "Barbell Lunge"
      },
      dumbbellLunge: {
        ko: "덤벨런지",
        en: "Dumbbell Lunge"
      },
      leg: {
        ko: "하체",
        en: "Leg"
      },
      legPress: {
        ko: "레그프레스",
        en: "Leg Press"
      },
      legExtension: {
        ko: "레그익스텐션",
        en: "Leg Extension"
      },
      legCurl: {
        ko: "레그컬",
        en: "Leg Curl"
      },
      barbellBenchPress: {
        ko: "바벨벤치프레스",
        en: "Barbell Bench Press"
      },
      dumbbellBenchPress: {
        ko: "덤벨벤치프레스",
        en: "Dumbbell Bench Press"
      },
      machineBenchPress: {
        ko: "머신벤치프레스",
        en: "Machine Bench Press"
      },
      inclineBenchPress: {
        ko: "인클라인벤치프레스",
        en: "Incline Bench Press"
      },
      declineBenchPress: {
        ko: "디클라인벤치프레스",
        en: "Decline Bench Press"
      },
      dumbbellFly: {
        ko: "덤벨플라이",
        en: "Dumbbell Fly"
      },
      cableFly: {
        ko: "케이블플라이",
        en: "Cable Fly"
      },
      cableCrossover: {
        ko: "케이블크로스오버",
        en: "Cable Crossover"
      },
      dips: {
        ko: "딥스",
        en: "Dips"
      },
      pushUp: {
        ko: "푸시업",
        en: "Push-Up"
      },
      militaryPress: {
        ko: "밀리터리프레스",
        en: "Military Press"
      },
      barbellPress: {
        ko: "바벨프레스",
        en: "Barbell Press"
      },
      dumbbellPress: {
        ko: "덤벨프레스",
        en: "Dumbbell Press"
      },
      machinePress: {
        ko: "머신프레스",
        en: "Machine Press"
      },
      behindNeckPress: {
        ko: "비하인드넥프레스",
        en: "Behind-The-Neck Press"
      },
      frontLateralRaise: {
        ko: "프론트레터럴레이즈",
        en: "Front Lateral Raise"
      },
      sideLateralRaise: {
        ko: "사이드레터럴레이즈",
        en: "Side Lateral Raise"
      },
      bentOverLateralRaise: {
        ko: "벤트오버레터럴레이즈",
        en: "Bent-Over Lateral Raise"
      },
      facePull: {
        ko: "페이스풀",
        en: "Face Pull"
      },
      lyingTricepsExtension: {
        ko: "라잉트라이셉스익스텐션",
        en: "Lying Triceps Extension"
      },
      dumbbellTricepsExtension: {
        ko: "덤벨트라이셉스익스텐션",
        en: "Dumbbell Triceps Extension"
      },
      overheadTricepsExtension: {
        ko: "오버헤드트라이셉스익스텐션",
        en: "Overhead Triceps Extension"
      },
      closeGripBenchPress: {
        ko: "클로즈그립벤치프레스",
        en: "Close-Grip Bench Press"
      },
      cableTricepsPushDown: {
        ko: "케이블트라이셉스푸쉬다운",
        en: "Cable Triceps Push Down"
      },
      cableTricepsRopeDown: {
        ko: "케이블트라이셉스로프다운",
        en: "Cable Triceps Rope Down"
      },
      kickback: {
        ko: "킥백",
        en: "Kickback"
      },
      barbellCurl: {
        ko: "바벨컬",
        en: "Barbell Curl"
      },
      dumbbellCurl: {
        ko: "덤벨컬",
        en: "Dumbbell Curl"
      },
      hammerCurl: {
        ko: "해머컬",
        en: "Hammer Curl"
      },
      machineCurl: {
        ko: "머신컬",
        en: "Machine Curl"
      },
      cableCurl: {
        ko: "케이블컬",
        en: "Cable Curl"
      },
      barbellPreacherCurl: {
        ko: "바벨프리처컬",
        en: "Barbell Preacher Curl"
      },
      dumbbellPreacherCurl: {
        ko: "덤벨프리처컬",
        en: "Dumbbell Preacher Curl"
      },
      walking: {
        ko: "걷기",
        en: "Walking"
      },
      running: {
        ko: "달리기",
        en: "Running"
      },
      stepper: {
        ko: "스텝퍼",
        en: "Stepper"
      },
      cycling: {
        ko: "사이클",
        en: "Cycling"
      },
      swimming: {
        ko: "수영",
        en: "Swimming"
      },
      plank: {
        ko: "플랭크",
        en: "Plank"
      },
      rest: {
        ko: "휴식",
        en: "Rest"
      },

      // -------------------------------------------------------------------------------------------
      // alert
      searchSuccessful: {
        ko: "조회 성공",
        en: "Search Successful"
      },
      searchFailed: {
        ko: "조회 실패",
        en: "Search Failed"
      },
      searchError: {
        ko: "조회 오류",
        en: "Search Error"
      },
      saveSuccessful: {
        ko: "저장 성공",
        en: "Save Successful"
      },
      saveFailed: {
        ko: "저장 실패",
        en: "Save Failed"
      },
      saveError: {
        ko: "저장 오류",
        en: "Save Error"
      },
      replaceSuccessful: {
        ko: "수정 성공",
        en: "Replace Successful"
      },
      replaceFailed: {
        ko: "수정 실패",
        en: "Replace Failed"
      },
      replaceError: {
        ko: "수정 오류",
        en: "Replace Error"
      },
      insertSuccessful: {
        ko: "추가 성공",
        en: "Insert Successful"
      },
      insertFailed: {
        ko: "추가 실패",
        en: "Insert Failed"
      },
      insertError: {
        ko: "추가 오류",
        en: "Insert Error"
      },
      createSuccessful: {
        ko: "저장 성공",
        en: "Create Successful"
      },
      createFailed: {
        ko: "저장 실패",
        en: "Create Failed"
      },
      createError: {
        ko: "저장 오류",
        en: "Create Error"
      },
      updateSuccessful: {
        ko: "수정 성공",
        en: "Update Successful"
      },
      updateFailed: {
        ko: "수정 실패",
        en: "Update Failed"
      },
      updateError: {
        ko: "수정 오류",
        en: "Update Error"
      },
      deleteSuccessful: {
        ko: "삭제 성공",
        en: "Delete Successful"
      },
      deleteFailed: {
        ko: "삭제 실패",
        en: "Delete Failed"
      },
      deleteError: {
        ko: "삭제 오류",
        en: "Delete Error"
      },
      signupSuccessful: {
        ko: "회원가입 성공",
        en: "Signup Successful"
      },
      signupFailed: {
        ko: "회원가입 실패",
        en: "Signup Failed"
      },
      signupError: {
        ko: "회원가입 오류",
        en: "Signup Error"
      },
      duplicatedId: {
        ko: "중복된 아이디입니다",
        en: "This ID is already in use"
      },
      duplicatedEmail: {
        ko: "중복된 이메일입니다",
        en: "This Email is already in use"
      },
      loginSuccessful: {
        ko: "로그인 성공",
        en: "Login Successful"
      },
      loginFailed: {
        ko: "로그인 실패",
        en: "Login Failed"
      },
      loginError: {
        ko: "로그인 오류",
        en: "Login Error"
      },
      theIdOrPwIsIncorrect: {
        ko: "아이디 또는 비밀번호가 일치하지 않습니다",
        en: "The ID or Password is incorrect"
      },
      resetPwSuccessful: {
        ko: "비밀번호 변경 성공",
        en: "Password Reset Successful"
      },
      resetPwFailed: {
        ko: "비밀번호 변경 실패",
        en: "Password Reset Failed"
      },
      resetPwError: {
        ko: "비밀번호 변경 오류",
        en: "Password Reset Error"
      },
      authenticationSuccessful: {
        ko: "인증 성공",
        en: "Authentication Successful"
      },
      authenticationFailed: {
        ko: "인증 실패",
        en: "Authentication Failed"
      },
      authenticationError: {
        ko: "인증 오류",
        en: "Authentication Error"
      },
      emailSendSuccessful: {
        ko: "이메일 전송 성공",
        en: "Email Send Successful"
      },
      emailSendFailed: {
        ko: "이메일 전송 실패",
        en: "Email Send Failed"
      },
      emailSendError: {
        ko: "이메일 전송 오류",
        en: "Email Send Error"
      },
      emailNotExist: {
        ko: "존재하지 않는 이메일입니다",
        en: "Email does not exist"
      },
      authenticationUrlGeneratedSuccessfully: {
        ko: "인증 URL 생성 성공",
        en: "Authentication URL Generated Successfully"
      },
      authenticationUrlGenerationFailed: {
        ko: "인증 URL 생성 실패",
        en: "Authentication URL Generation Failed"
      },
      authenticationUrlGenerationError: {
        ko: "인증 URL 생성 오류",
        en: "Authentication URL Generation Error"
      },
      callbackSuccessful: {
        ko: "콜백 성공",
        en: "Callback Successful"
      },
      callbackFailed: {
        ko: "콜백 실패",
        en: "Callback Failed"
      },
      googleLoginSuccessful: {
        ko: "구글 로그인 성공",
        en: "Google Login Successful"
      },
      googleLoginFailed: {
        ko: "구글 로그인 실패",
        en: "Google Login Failed"
      },
      googleLoginError: {
        ko: "구글 로그인 오류",
        en: "Google Login Error"
      },
      cantBeDeletedLastItem: {
        ko: "마지막 항목은 삭제할 수 없습니다",
        en: "The last item cannot be deleted"
      },
      isGoogleUserLogin: {
        ko: "구글 사용자입니다. 구글 로그인을 이용해주세요",
        en: "This is a Google user. Please use Google Login"
      },
      isGoogleUserResetPw: {
        ko: "구글 사용자입니다. 비밀번호 변경을 이용할 수 없습니다",
        en: "This is a Google user. You cannot use password reset"
      },

      // -------------------------------------------------------------------------------------------
      // error
      errorExerciseGoalCount: {
        ko: "횟수 목표를 입력해주세요",
        en: "Please enter Goal Count"
      },
      errorExerciseGoalVolume: {
        ko: "볼륨 목표를 입력해주세요",
        en: "Please enter Goal Volume"
      },
      errorExerciseGoalWeight: {
        ko: "체중 목표를 입력해주세요",
        en: "Please enter Goal Weight"
      },
      errorExercisePartIdx: {
        ko: "운동 부위를 선택해주세요",
        en: "Please select Part"
      },
      errorExerciseTitleIdx: {
        ko: "운동 종목을 선택해주세요",
        en: "Please enter Exercise"
      },
      errorExerciseCount: {
        ko: "횟수를 입력해주세요",
        en: "Please enter Count"
      },
      errorExerciseSet: {
        ko: "세트를 입력해주세요",
        en: "Please enter Set"
      },
      errorExerciseRep: {
        ko: "횟수를 입력해주세요",
        en: "Please enter Rep"
      },
      errorExerciseKg: {
        ko: "무게를 입력해주세요",
        en: "Please enter Kg"
      },
      errorFoodGoalKcal : {
        ko: "칼로리 목표를 입력해주세요",
        en: "Please enter Goal Kcal"
      },
      errorFoodGoalCarb : {
        ko: "탄수화물 목표를 입력해주세요",
        en: "Please enter Goal Carb"
      },
      errorFoodGoalProtein : {
        ko: "단백질 목표를 입력해주세요",
        en: "Please enter Goal Protein"
      },
      errorFoodGoalFat : {
        ko: "지방 목표를 입력해주세요",
        en: "Please enter Goal Fat"
      },
      errorFoodPartIdx: {
        ko: "대분류를 선택해주세요",
        en: "Please select Part"
      },
      errorFoodName: {
        ko: "식품명을 입력해주세요",
        en: "Please enter Food"
      },
      errorFoodCount: {
        ko: "수량을 입력해주세요",
        en: "Please enter Count"
      },
      errorFoodGram: {
        ko: "용량을 입력해주세요",
        en: "Please enter Gram"
      },
      errorFoodCountOrGram: {
        ko: "수량 또는 용량을 입력해주세요",
        en: "Please enter Count or Gram"
      },
      errorFoodKcal: {
        ko: "칼로리를 입력해주세요",
        en: "Please enter Kcal"
      },
      errorFoodCarb: {
        ko: "탄수화물을 입력해주세요",
        en: "Please enter Carb"
      },
      errorFoodProtein: {
        ko: "단백질을 입력해주세요",
        en: "Please enter Protein"
      },
      errorFoodFat: {
        ko: "지방을 입력해주세요",
        en: "Please enter Fat"
      },
      errorCalendarPartIdx: {
        ko: "대분류를 선택해주세요",
        en: "Please select Part"
      },
      errorCalendarColor: {
        ko: "색상을 선택해주세요",
        en: "Please select Color"
      },
      errorCalendarTitle: {
        ko: "제목을 입력해주세요",
        en: "Please enter Title"
      },
      errorCalendarContent: {
        ko: "내용을 입력해주세요",
        en: "Please enter Content"
      },
      errorMoneyGoalIncome: {
        ko: "수입 목표를 입력해주세요",
        en: "Please enter Goal Income"
      },
      errorMoneyGoalExpense: {
        ko: "지출 목표를 입력해주세요",
        en: "Please enter Goal Expense"
      },
      errorMoneyPartIdx: {
        ko: "대분류를 선택해주세요",
        en: "Please select Part"
      },
      errorMoneyTitleIdx: {
        ko: "소분류를 선택해주세요",
        en: "Please select Title"
      },
      errorMoneyAmount: {
        ko: "금액을 입력해주세요",
        en: "Please enter Amount"
      },
      errorSleepGoalBedTime: {
        ko: "취침시간 목표를 입력해주세요",
        en: "Please enter Goal Bed Time"
      },
      errorSleepGoalWakeTime: {
        ko: "기상시간 목표를 입력해주세요",
        en: "Please enter Goal Wake Time"
      },
      errorSleepGoalSleepTime: {
        ko: "수면시간 목표를 입력해주세요",
        en: "Please enter Goal Sleep Time"
      },
      errorSleepBedTime: {
        ko: "취침시간을 입력해주세요",
        en: "Please enter Bed Time"
      },
      errorSleepWakeTime: {
        ko: "기상시간을 입력해주세요",
        en: "Please enter Wake Time"
      },
      errorSleepSleepTime: {
        ko: "수면시간을 입력해주세요",
        en: "Please enter Sleep Time"
      },
      errorUserId: {
        ko: "아이디를 입력해주세요",
        en: "Please enter ID"
      },
      errorUserVerifyCode: {
        ko: "인증코드를 입력해주세요",
        en: "Please enter Verification Code"
      },
      errorUserIdVerified: {
        ko: "이메일 인증을 완료해주세요",
        en: "Please complete email verification"
      },
      errorUserIdAt: {
        ko: "아이디는 이메일 형식으로 입력해주세요",
        en: "Please enter ID in email format"
      },
      errorUserPw: {
        ko: "비밀번호를 입력해주세요",
        en: "Please enter PW"
      },
      errorUserPwRule: {
        ko: "비밀번호는 8자 이상, 영문, 숫자, 특수문자를 포함해주세요",
        en: "Password must be at least 8 characters long, including letters, numbers, and special characters"
      },
      errorUserPwVerified: {
        ko: "비밀번호 확인을 입력해주세요",
        en: "Please enter PW Confirm"
      },
      errorUserPwMatch: {
        ko: "비밀번호가 일치하지 않습니다",
        en: "Passwords do not match"
      },
      errorUserAge: {
        ko: "나이를 입력해주세요",
        en: "Please enter Age"
      },
      errorUserGender: {
        ko: "성별을 선택해주세요",
        en: "Please select Gender"
      },
      errorUserHeight: {
        ko: "키를 입력해주세요",
        en: "Please enter Height"
      },
      errorUserInitScale: {
        ko: "체중을 입력해주세요",
        en: "Please enter Weight"
      },
      errorUserCurScale: {
        ko: "현재 체중을 입력해주세요",
        en: "Please enter Weight"
      },
      errorUserInitProperty: {
        ko: "초기 자산을 입력해주세요",
        en: "Please enter Initial Property"
      },
      errorUserCurProperty: {
        ko: "현재 자산을 입력해주세요",
        en: "Please enter Current Property"
      },
      errorUserGoalProperty: {
        ko: "목표 자산을 입력해주세요",
        en: "Please enter Goal Property"
      },
      errorUserGoalWeight: {
        ko: "목표 체중을 입력해주세요",
        en: "Please enter Goal Weight"
      },
    };

    const result = resources[key];
    if (!result) {
      return key;
    }
    return result[lang];
  },
}));