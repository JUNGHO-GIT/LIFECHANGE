// index.tsx

import "./index.css";
import "react-calendar/dist/Calendar.css";
import "@styles/Calendar.css";
import "@styles/Chart.css";
import "@styles/Mui.css";
import "@styles/Components.css";
import "@styles/Core.css";
import "@styles/Error.css";
import "@styles/Jstyle.css";

import {
  useLocation, ReactDOM, BrowserRouter, Routes, Route
} from "@imports/ImportReacts";

import {
  CssBaseline, createTheme, ThemeProvider
} from "@imports/ImportMuis";

import {
  useRoot, useScrollTop, useFoodSection, LanguageProvider, useTimeZone
} from "@imports/ImportHooks";

import {
  Header, TopNav, BottomNav,
} from "@imports/ImportLayouts";

import {
  CalendarList, CalendarDetail,
} from "@imports/ImportPages";

import {
  TodayGoalList, TodayList,
} from "@imports/ImportPages";

import {
  ExerciseChart, ExerciseGoalList, ExerciseGoalDetail, ExerciseList, ExerciseDetail,
} from "@imports/ImportPages";

import {
  FoodChart, FoodFindList, FoodGoalList, FoodGoalDetail, FoodList, FoodDetail,
} from "@imports/ImportPages";

import {
  MoneyChart, MoneyGoalList, MoneyGoalDetail, MoneyList, MoneyDetail,
} from "@imports/ImportPages";

import {
  SleepChart, SleepGoalList, SleepGoalDetail, SleepList, SleepDetail,
} from "@imports/ImportPages";

import {
  UserAppInfo, UserAppSetting, UserCategory, UserDelete, UserDetail, UserDummy, UserLogin, UserResetPw, UserSignup,
} from "@imports/ImportPages";

import {
  AuthError, AuthGoogle, AuthPrivacy
} from "@imports/ImportPages";

// -------------------------------------------------------------------------------------------------
const Calendar = () => (
  <Routes>
    <Route path="/list" element={<CalendarList />} />
    <Route path="/detail" element={<CalendarDetail />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Today = () => (
  <Routes>
    <Route path="/goal/list" element={<TodayGoalList />} />
    <Route path="/list" element={<TodayList />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Exercise = () =>  (
  <Routes>
    <Route path="/chart/list" element={<ExerciseChart />} />
    <Route path="/goal/list" element={<ExerciseGoalList />} />
    <Route path="/goal/detail" element={<ExerciseGoalDetail />} />
    <Route path="/list" element={<ExerciseList />} />
    <Route path="/detail" element={<ExerciseDetail />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Food = () => (
  <Routes>
    <Route path="/chart/list" element={<FoodChart />} />
    <Route path="/goal/list" element={<FoodGoalList />} />
    <Route path="/goal/detail" element={<FoodGoalDetail />} />
    <Route path="/find/list" element={<FoodFindList />} />
    <Route path="/list" element={<FoodList />} />
    <Route path="/detail" element={<FoodDetail />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Money = () =>  (
  <Routes>
    <Route path="/chart/list" element={<MoneyChart />} />
    <Route path="/goal/list" element={<MoneyGoalList />} />
    <Route path="/goal/detail" element={<MoneyGoalDetail />} />
    <Route path="/list" element={<MoneyList />} />
    <Route path="/detail" element={<MoneyDetail />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Sleep = () => (
  <Routes>
    <Route path="/chart/list" element={<SleepChart />} />
    <Route path="/goal/list" element={<SleepGoalList />} />
    <Route path="/goal/detail" element={<SleepGoalDetail />} />
    <Route path="/list" element={<SleepList />} />
    <Route path="/detail" element={<SleepDetail />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const User = () => (
  <Routes>
    <Route path="/app/info" element={<UserAppInfo />} />
    <Route path="/app/setting" element={<UserAppSetting />} />
    <Route path="/signup" element={<UserSignup />} />
    <Route path="/login" element={<UserLogin />} />
    <Route path="/resetPw" element={<UserResetPw />} />
    <Route path="/detail" element={<UserDetail />} />
    <Route path="/delete" element={<UserDelete />} />
    <Route path="/category" element={<UserCategory />} />
    <Route path="/dummy" element={<UserDummy />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Auth = () => (
  <Routes>
    <Route path="/privacy" element={<AuthPrivacy />} />
    <Route path="/google" element={<AuthGoogle />} />
    <Route path="/error" element={<AuthError />} />
  </Routes>
);

// -------------------------------------------------------------------------------------------------
const App = () => {

  useRoot();
  useTimeZone();
  useScrollTop();
  useFoodSection();

  const location = useLocation();
  const noneHeader = (
    location.pathname.includes("/user/login") ||
    location.pathname.includes("/user/signup") ||
    location.pathname.includes("/user/resetPw") ||
    location.pathname.indexOf("/auth") > -1
  );
  const noneTop = (
    location.pathname.indexOf("/user") > -1 ||
    location.pathname.indexOf("/auth") > -1
  );
  const noneBottom = (
    location.pathname.indexOf("/user") > -1 ||
    location.pathname.indexOf("/auth") > -1
  );

  return (
    <div className={"App"}>
      {!noneHeader && <Header />}
      {!noneTop && <TopNav />}
      <Routes>
        <Route path="/*" element={<User />} />
        <Route path="/calendar/*" element={<Calendar />} />
        <Route path="/today/*" element={<Today />} />
        <Route path="/exercise/*" element={<Exercise />} />
        <Route path="/food/*" element={<Food />} />
        <Route path="/money/*" element={<Money />} />
        <Route path="/sleep/*" element={<Sleep />} />
        <Route path="/user/*" element={<User />} />
        <Route path="/auth/*" element={<Auth />} />
      </Routes>
      {!noneBottom && <BottomNav />}
    </div>
  );
};

// -------------------------------------------------------------------------------------------------
const theme = createTheme({
  typography: {
    fontFamily: "Pretendard, 'Noto Sans KR', sans-serif",
  },
});

const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("root element is null");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter basename={"/JPAGE"}>
    <LanguageProvider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <App />
      </ThemeProvider>
    </LanguageProvider>
  </BrowserRouter>
);