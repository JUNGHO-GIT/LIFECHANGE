// index.jsx

import { React, useLocation } from "./import/ImportReacts.jsx";
import { ReactDOM, BrowserRouter, Routes, Route } from "./import/ImportReacts.jsx";
import { CssBaseline, createTheme, ThemeProvider } from "./import/ImportMuis.jsx";
import { useScrollTop, useEnhancedTouch } from "./import/ImportHooks.jsx";
import { useRoot, useSessionStorage, LanguageProvider } from "./import/ImportHooks.jsx";

import "react-calendar/dist/Calendar.css";
import "./assets/css/Calendar.css";
import "./assets/css/Chart.css";
import "./assets/css/Mui.css";
import "./assets/css/Components.css";
import "./assets/css/Core.css";
import "./assets/css/Error.css";
import "./assets/css/Jstyle.css";
import "./index.css";

import { Header } from "./import/ImportLayouts.jsx";
import { TopNav } from "./import/ImportLayouts.jsx";
import { BottomNav } from "./import/ImportLayouts.jsx";
import { Banner } from "./import/ImportLayouts.jsx";

import { CalendarList } from "./page/calendar/CalendarList.jsx";
import { CalendarSave } from "./page/calendar/CalendarSave.jsx";

import { TodayChart } from "./page/today/chart/TodayChart.jsx";
import { TodayGoalList } from "./page/today/TodayGoalList.jsx";
import { TodayList } from "./page/today/TodayList.jsx";

import { ExerciseChart } from "./page/exercise/chart/ExerciseChart.jsx";
import { ExerciseGoalList } from "./page/exercise/goal/ExerciseGoalList.jsx";
import { ExerciseGoalSave } from "./page/exercise/goal/ExerciseGoalSave.jsx";
import { ExerciseList } from "./page/exercise/ExerciseList.jsx";
import { ExerciseSave } from "./page/exercise/ExerciseSave.jsx";

import { FoodChart } from "./page/food/chart/FoodChart.jsx";
import { FoodGoalList } from "./page/food/goal/FoodGoalList.jsx";
import { FoodGoalSave } from "./page/food/goal/FoodGoalSave.jsx";
import { FoodFind } from "./page/food/FoodFind.jsx";
import { FoodList } from "./page/food/FoodList.jsx";
import { FoodSave } from "./page/food/FoodSave.jsx";

import { MoneyChart } from "./page/money/chart/MoneyChart.jsx";
import { MoneyGoalList } from "./page/money/goal/MoneyGoalList.jsx";
import { MoneyGoalSave } from "./page/money/goal/MoneyGoalSave.jsx";
import { MoneyList } from "./page/money/MoneyList.jsx";
import { MoneySave } from "./page/money/MoneySave.jsx";

import { SleepChart } from "./page/sleep/chart/SleepChart.jsx";
import { SleepGoalList } from "./page/sleep/goal/SleepGoalList.jsx";
import { SleepGoalSave } from "./page/sleep/goal/SleepGoalSave.jsx";
import { SleepList } from "./page/sleep/SleepList.jsx";
import { SleepSave } from "./page/sleep/SleepSave.jsx";

import { UserCategory } from "./page/user/UserCategory.jsx";
import { UserDetail } from "./page/user/UserDetail.jsx";
import { UserDummy } from "./page/user/UserDummy.jsx";
import { UserAppSetting } from "./page/user/UserAppSetting.jsx";
import { UserDeletes } from "./page/user/UserDeletes.jsx";
import { UserAppInfo } from "./page/user/UserAppInfo.jsx";
import { UserSignup } from "./page/user/UserSignup.jsx";
import { UserLogin } from "./page/user/UserLogin.jsx";
import { UserResetPw } from "./page/user/UserResetPw.jsx";

import { AuthPrivacy } from "./page/auth/AuthPrivacy.jsx";
import { AuthGoogle } from "./page/auth/AuthGoogle.jsx";
import { AuthError } from "./page/auth/AuthError.jsx";

// -------------------------------------------------------------------------------------------------
const Calendar = () => (
  <Routes>
    <Route path="/list" element={<CalendarList />} />
    <Route path="/save" element={<CalendarSave />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Today = () => (
  <Routes>
    <Route path="/chart/list" element={<TodayChart />} />
    <Route path="/goal/list" element={<TodayGoalList />} />
    <Route path="/list" element={<TodayList />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Exercise = () =>  (
  <Routes>
    <Route path="/chart/list" element={<ExerciseChart />} />
    <Route path="/goal/list" element={<ExerciseGoalList />} />
    <Route path="/goal/save" element={<ExerciseGoalSave />} />
    <Route path="/list" element={<ExerciseList />} />
    <Route path="/save" element={<ExerciseSave />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Food = () => (
  <Routes>
    <Route path="/chart/list" element={<FoodChart />} />
    <Route path="/goal/list" element={<FoodGoalList />} />
    <Route path="/goal/save" element={<FoodGoalSave />} />
    <Route path="/find" element={<FoodFind />} />
    <Route path="/list" element={<FoodList />} />
    <Route path="/save" element={<FoodSave />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Money = () =>  (
  <Routes>
    <Route path="/chart/list" element={<MoneyChart />} />
    <Route path="/goal/list" element={<MoneyGoalList />} />
    <Route path="/goal/save" element={<MoneyGoalSave />} />
    <Route path="/list" element={<MoneyList />} />
    <Route path="/save" element={<MoneySave />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Sleep = () => (
  <Routes>
    <Route path="/chart/list" element={<SleepChart />} />
    <Route path="/goal/list" element={<SleepGoalList />} />
    <Route path="/goal/save" element={<SleepGoalSave />} />
    <Route path="/list" element={<SleepList />} />
    <Route path="/save" element={<SleepSave />} />
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
    <Route path="/deletes" element={<UserDeletes />} />
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
  useSessionStorage();
  useScrollTop();
  useEnhancedTouch();

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
  const noneBanner = (
    location.pathname.includes("/user/login") ||
    location.pathname.includes("/user/signup") ||
    location.pathname.includes("/user/resetPw") ||
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
      {!noneBanner && <Banner />}
    </div>
  );
};

// -------------------------------------------------------------------------------------------------
const theme = createTheme({
  typography: {
    fontFamily: '"Noto Sans KR", sans-serif',
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