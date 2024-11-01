// index.tsx

import "react-calendar/dist/Calendar.css";
import "@assets/styles/Calendar.css";
import "@assets/styles/Chart.css";
import "@assets/styles/Mui.css";
import "@assets/styles/Components.css";
import "@assets/styles/Core.css";
import "@assets/styles/Error.css";
import "@assets/styles/Jstyle.css";
import "./index.css";

import {
  BrowserRouter, Routes, Route, createRoot, useEffect, useState
} from "@importReacts";

import {
  CssBaseline, createTheme, ThemeProvider
} from "@importMuis";

import {
  useRoot, useScrollTop, useFoodSection, useLanguageSetting, useLanguageInitialize,
  useCommonValue
} from "@importHooks";

import {
  Header, TopNav, BottomNav, Alert, Confirm, Loader
} from "@importLayouts";

import {
  AdminDashboard, AuthError, AuthGoogle, AuthPrivacy
} from "@importPages";

import {
  CalendarList, CalendarDetail
} from "@importPages";

import {
  ExerciseChart, ExerciseGoalList, ExerciseGoalDetail, ExerciseList, ExerciseDetail
} from "@importPages";

import {
  FoodChart, FoodGoalList, FoodGoalDetail, FoodFindList, FoodFavoriteList, FoodList, FoodDetail
} from "@importPages";

import {
  TodayGoalList, TodayList
} from "@importPages";

import {
  MoneyChart, MoneyGoalList, MoneyGoalDetail, MoneyList, MoneyDetail
} from "@importPages";

import {
  SleepChart, SleepGoalList, SleepGoalDetail, SleepList, SleepDetail
} from "@importPages";

import {
  UserAppInfo, UserAppSetting, UserSignup, UserLogin, UserResetPw, UserDetail, UserDelete, UserCategory
} from "@importPages";

// -------------------------------------------------------------------------------------------------
const App = () => {

  const { PATH } = useCommonValue();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  useRoot();
  useScrollTop();
  useFoodSection();
  useLanguageInitialize();
  useLanguageSetting();

  const noneHeader = (
    !PATH.includes("/error") &&
    !PATH.includes("/user/login") &&
    !PATH.includes("/user/signup") &&
    !PATH.includes("/user/resetPw")
  );
  const noneTop = (
    !PATH.includes("/error") && !PATH.includes("/user")
  );
  const noneBottom = (
    !PATH.includes("/error") && !PATH.includes("/user")
  );

  return (
    !loading ? (
      <div className={"App"}>
        {noneHeader && <Header />}
        {noneTop && <TopNav />}
        {<Alert />}
        {<Confirm />}
        <Routes>
          {/** home **/}
          <Route path={"/"} element={<div />} />
          {/** admin **/}
          <Route path={"/admin/dashboard/*"} element={<AdminDashboard />} />
          {/** auth **/}
          <Route path={"/auth/error/*"} element={<AuthError />} />
          <Route path={"/auth/google/*"} element={<AuthGoogle />} />
          <Route path={"/auth/privacy/*"} element={<AuthPrivacy />} />
          {/** calendar **/}
          <Route path={"/calendar/list/*"} element={<CalendarList />} />
          <Route path={"/calendar/detail/*"} element={<CalendarDetail />} />
          {/** exercise **/}
          <Route path={"/exercise/chart/list/*"} element={<ExerciseChart />} />
          <Route path={"/exercise/goal/list/*"} element={<ExerciseGoalList />} />
          <Route path={"/exercise/goal/detail/*"} element={<ExerciseGoalDetail />} />
          <Route path={"/exercise/list/*"} element={<ExerciseList />} />
          <Route path={"/exercise/detail/*"} element={<ExerciseDetail />} />
          {/** food **/}
          <Route path={"/food/chart/list/*"} element={<FoodChart />} />
          <Route path={"/food/goal/list/*"} element={<FoodGoalList />} />
          <Route path={"/food/goal/detail/*"} element={<FoodGoalDetail />} />
          <Route path={"/food/find/list/*"} element={<FoodFindList />} />
          <Route path={"/food/favorite/list/*"} element={<FoodFavoriteList />} />
          <Route path={"/food/list/*"} element={<FoodList />} />
          <Route path={"/food/detail/*"} element={<FoodDetail />} />
          {/** today **/}
          <Route path={"/today/goal/list/*"} element={<TodayGoalList />} />
          <Route path={"/today/list/*"} element={<TodayList />} />
          {/** money **/}
          <Route path={"/money/chart/list/*"} element={<MoneyChart />} />
          <Route path={"/money/goal/list/*"} element={<MoneyGoalList />} />
          <Route path={"/money/goal/detail/*"} element={<MoneyGoalDetail />} />
          <Route path={"/money/list/*"} element={<MoneyList />} />
          <Route path={"/money/detail/*"} element={<MoneyDetail />} />
          {/** sleep **/}
          <Route path={"/sleep/chart/list/*"} element={<SleepChart />} />
          <Route path={"/sleep/goal/list/*"} element={<SleepGoalList />} />
          <Route path={"/sleep/goal/detail/*"} element={<SleepGoalDetail />} />
          <Route path={"/sleep/list/*"} element={<SleepList />} />
          <Route path={"/sleep/detail/*"} element={<SleepDetail />} />
          {/** user **/}
          <Route path={"/user/app/info/*"} element={<UserAppInfo />} />
          <Route path={"/user/app/setting/*"} element={<UserAppSetting />} />
          <Route path={"/user/signup/*"} element={<UserSignup />} />
          <Route path={"/user/login/*"} element={<UserLogin />} />
          <Route path={"/user/resetPw/*"} element={<UserResetPw />} />
          <Route path={"/user/detail/*"} element={<UserDetail />} />
          <Route path={"/user/delete/*"} element={<UserDelete />} />
          <Route path={"/user/category/*"} element={<UserCategory />} />
          {/** error **/}
          <Route path={"*"} element={<AuthError />} />
        </Routes>
        {noneBottom && <BottomNav />}
      </div>
    ) : (
      <Loader />
    )
  );
};

// -------------------------------------------------------------------------------------------------
createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter basename={"/JPAGE"}>
    <ThemeProvider theme={
      createTheme({
        typography: {
          fontFamily: "Pretendard Variable, Pretendard, -apple-system, BlinkMacSystemFont, system-ui, Roboto, Helvetica Neue, Segoe UI, Apple SD Gothic Neo, Noto Sans KR, Malgun Gothic, Apple Color Emoji, Segoe UI Emoji, Segoe UI Symbol, sans-serif"
        }
      })
    }>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);