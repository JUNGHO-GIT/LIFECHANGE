// index.tsx

import "react-calendar/dist/Calendar.css";
import "@assets/styles/Core.css";
import "@assets/styles/Calendar.css";
import "@assets/styles/Chart.css";
import "@assets/styles/Mui.css";
import '@assets/styles/Components.css';

import {
  BrowserRouter, Routes, Route, createRoot, useEffect
} from "@importReacts";

import {
  CssBaseline, ThemeProvider, createTheme
} from "@importMuis";

import {
  useRoot, useScrollTop, useFoodSection, useLanguageSetting, useLanguageInitialize,
  useCommonValue,
} from "@importHooks";

import {
  useStoreLoading
} from "@importStores";

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
  AdminAppInfo, UserAppSetting, UserSignup, UserLogin, UserResetPw, UserDetail, UserDelete, UserCategory
} from "@importPages";

// -------------------------------------------------------------------------------------------------
const App = () => {

  const { PATH } = useCommonValue();
  const { setLOADING } = useStoreLoading();

  useEffect(() => {
    setLOADING(true);
    setTimeout(() => {
      setLOADING(false);
    }, 500);
  }, []);

  useRoot();
  useScrollTop();
  useFoodSection();
  useLanguageInitialize();
  useLanguageSetting();

  const noneHeader = (
    !PATH.includes("/user/login") &&
    !PATH.includes("/user/signup") &&
    !PATH.includes("/user/resetPw") &&
    !PATH.includes("/auth/error") &&
    !PATH.includes("/auth/privacy")
  );
  const noneTop = (
    !PATH.includes("/user") &&
    !PATH.includes("/auth/error") &&
    !PATH.includes("/auth/privacy")

  );
  const noneBottom = (
    !PATH.includes("/user") &&
    !PATH.includes("/auth/error") &&
    !PATH.includes("/auth/privacy")
  );

  return (
    <div className={"App"}>
      {noneHeader && <Header />}
      {noneTop && <TopNav />}
      <Loader />
      <Alert />
      <Confirm />
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
        <Route path={"/user/appInfo/*"} element={<AdminAppInfo />} />
        <Route path={"/user/appSetting/*"} element={<UserAppSetting />} />
        <Route path={"/user/signup/*"} element={<UserSignup />} />
        <Route path={"/user/login/*"} element={<UserLogin />} />
        <Route path={"/user/resetPw/*"} element={<UserResetPw />} />
        <Route path={"/user/detail/*"} element={<UserDetail />} />
        <Route path={"/user/delete/*"} element={<UserDelete />} />
        <Route path={"/user/category/*"} element={<UserCategory />} />
      </Routes>
      {noneBottom && <BottomNav />}
    </div>
  );
};

// -------------------------------------------------------------------------------------------------
createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter basename={"/LIFECHANGE"}>
    <ThemeProvider theme={
      createTheme({
        typography:{
          fontFamily: "'Pretendard Variable', Pretendard, FontAwesome, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif",
        },
      })
    }>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);