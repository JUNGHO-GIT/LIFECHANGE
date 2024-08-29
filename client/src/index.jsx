// index.jsx
// Node -> Section -> Fragment

import { useLocation } from "./imports/ImportReacts.jsx";
import { ReactDOM, BrowserRouter, Routes, Route } from "./imports/ImportReacts.jsx";
import { CssBaseline, createTheme, ThemeProvider } from "./imports/ImportMuis.jsx";
import { useScrollTop, useEnhancedTouch } from "./imports/ImportHooks.jsx";
import { useRoot } from "./imports/ImportHooks.jsx";
import { useSessionStorage, LanguageProvider } from "./imports/ImportHooks.jsx";

import "react-calendar/dist/Calendar.css";
import "./assets/styles/Calendar.css";
import "./assets/styles/Chart.css";
import "./assets/styles/Mui.css";
import "./assets/styles/Components.css";
import "./assets/styles/Core.css";
import "./assets/styles/Error.css";
import "./assets/styles/Jstyle.css";
import "./index.css";

import { Header } from "./imports/ImportLayouts.jsx";
import { TopNav } from "./imports/ImportLayouts.jsx";
import { BottomNav } from "./imports/ImportLayouts.jsx";
import { Banner } from "./imports/ImportLayouts.jsx";

import { CalendarList } from "./pages/calendar/CalendarList.jsx";
import { CalendarSave } from "./pages/calendar/CalendarSave.jsx";

import { TodayChart } from "./pages/today/chart/TodayChart.jsx";
import { TodayGoalList } from "./pages/today/TodayGoalList.jsx";
import { TodayList } from "./pages/today/TodayList.jsx";

import { ExerciseChart } from "./pages/exercise/chart/ExerciseChart.jsx";
import { ExerciseGoalList } from "./pages/exercise/goal/ExerciseGoalList.jsx";
import { ExerciseGoalSave } from "./pages/exercise/goal/ExerciseGoalSave.jsx";
import { ExerciseList } from "./pages/exercise/ExerciseList.jsx";
import { ExerciseSave } from "./pages/exercise/ExerciseSave.jsx";

import { FoodChart } from "./pages/food/chart/FoodChart.jsx";
import { FoodGoalList } from "./pages/food/goal/FoodGoalList.jsx";
import { FoodGoalSave } from "./pages/food/goal/FoodGoalSave.jsx";
import { FoodFind } from "./pages/food/FoodFind.jsx";
import { FoodList } from "./pages/food/FoodList.jsx";
import { FoodSave } from "./pages/food/FoodSave.jsx";

import { MoneyChart } from "./pages/money/chart/MoneyChart.jsx";
import { MoneyGoalList } from "./pages/money/goal/MoneyGoalList.jsx";
import { MoneyGoalSave } from "./pages/money/goal/MoneyGoalSave.jsx";
import { MoneyList } from "./pages/money/MoneyList.jsx";
import { MoneySave } from "./pages/money/MoneySave.jsx";

import { SleepChart } from "./pages/sleep/chart/SleepChart.jsx";
import { SleepGoalList } from "./pages/sleep/goal/SleepGoalList.jsx";
import { SleepGoalSave } from "./pages/sleep/goal/SleepGoalSave.jsx";
import { SleepList } from "./pages/sleep/SleepList.jsx";
import { SleepSave } from "./pages/sleep/SleepSave.jsx";

import { UserCategory } from "./pages/user/UserCategory.jsx";
import { UserDetail } from "./pages/user/UserDetail.jsx";
import { UserDummy } from "./pages/user/UserDummy.jsx";
import { UserAppSetting } from "./pages/user/UserAppSetting.jsx";
import { UserDeletes } from "./pages/user/UserDeletes.jsx";
import { UserAppInfo } from "./pages/user/UserAppInfo.jsx";
import { UserSignup } from "./pages/user/UserSignup.jsx";
import { UserLogin } from "./pages/user/UserLogin.jsx";
import { UserResetPw } from "./pages/user/UserResetPw.jsx";

import { AuthPrivacy } from "./pages/auth/AuthPrivacy.jsx";
import { AuthGoogle } from "./pages/auth/AuthGoogle.jsx";
import { AuthError } from "./pages/auth/AuthError.jsx";

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