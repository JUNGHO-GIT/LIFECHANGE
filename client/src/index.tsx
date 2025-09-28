// index.tsx

import "react-calendar/dist/Calendar.css";
import "@assets/styles/Core.css";
import "@assets/styles/Schedule.css";
import "@assets/styles/Chart.css";
import "@assets/styles/Mui.css";
import '@assets/styles/Components.css';

import {
  BrowserRouter, Routes, Route, createRoot, useEffect, memo
} from "@importReacts";

import {
  CssBaseline, ThemeProvider, createTheme
} from "@importMuis";

import {
  useRoot, useScrollTop, useFoodSection, useLanguageSetting, useLanguageInitialize, useCommonValue,
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
  SchedulePlannerList, SchedulePlannerDetail, ScheduleGoalList, ScheduleRecordList
} from "@importPages";

import {
  ExerciseChart, ExerciseGoalList, ExerciseGoalDetail, ExerciseRecordList, ExerciseRecordDetail
} from "@importPages";

import {
  FoodChart, FoodGoalList, FoodGoalDetail, FoodFindList, FoodFavoriteList, FoodRecordList, FoodRecordDetail
} from "@importPages";

import {
  MoneyChart, MoneyGoalList, MoneyGoalDetail, MoneyRecordList, MoneyRecordDetail
} from "@importPages";

import {
  SleepChart, SleepGoalList, SleepGoalDetail, SleepRecordList, SleepRecordDetail
} from "@importPages";

import {
  AdminAppInfo, UserAppSetting, UserSignup, UserLogin, UserResetPw, UserDetail, UserDelete, UserCategory
} from "@importPages";

// -------------------------------------------------------------------------------------------------
const App = memo(() => {

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
        {/** schedule **/}
				<Route path={"/schedule/planner/list/*"} element={<SchedulePlannerList />} />
				<Route path={"/schedule/planner/detail/*"} element={<SchedulePlannerDetail />} />
        <Route path={"/schedule/goal/list/*"} element={<ScheduleGoalList />} />
        <Route path={"/schedule/record/list/*"} element={<ScheduleRecordList />} />
        {/** exercise **/}
        <Route path={"/exercise/chart/list/*"} element={<ExerciseChart />} />
        <Route path={"/exercise/goal/list/*"} element={<ExerciseGoalList />} />
        <Route path={"/exercise/goal/detail/*"} element={<ExerciseGoalDetail />} />
        <Route path={"/exercise/record/list/*"} element={<ExerciseRecordList />} />
        <Route path={"/exercise/record/detail/*"} element={<ExerciseRecordDetail />} />
        {/** food **/}
        <Route path={"/food/chart/list/*"} element={<FoodChart />} />
        <Route path={"/food/goal/list/*"} element={<FoodGoalList />} />
        <Route path={"/food/goal/detail/*"} element={<FoodGoalDetail />} />
        <Route path={"/food/record/list/*"} element={<FoodRecordList />} />
        <Route path={"/food/record/detail/*"} element={<FoodRecordDetail />} />
        <Route path={"/food/favorite/list/*"} element={<FoodFavoriteList />} />
        <Route path={"/food/find/list/*"} element={<FoodFindList />} />
        {/** money **/}
        <Route path={"/money/chart/list/*"} element={<MoneyChart />} />
        <Route path={"/money/goal/list/*"} element={<MoneyGoalList />} />
        <Route path={"/money/goal/detail/*"} element={<MoneyGoalDetail />} />
        <Route path={"/money/record/list/*"} element={<MoneyRecordList />} />
        <Route path={"/money/record/detail/*"} element={<MoneyRecordDetail />} />
        {/** sleep **/}
        <Route path={"/sleep/chart/list/*"} element={<SleepChart />} />
        <Route path={"/sleep/goal/list/*"} element={<SleepGoalList />} />
        <Route path={"/sleep/goal/detail/*"} element={<SleepGoalDetail />} />
        <Route path={"/sleep/record/list/*"} element={<SleepRecordList />} />
        <Route path={"/sleep/record/detail/*"} element={<SleepRecordDetail />} />
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
});

// -------------------------------------------------------------------------------------------------
const fontFamily = "'Pretendard Variable', Pretendard, FontAwesome, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif";

// -------------------------------------------------------------------------------------------------
createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter basename={"/LIFECHANGE"}>
    <ThemeProvider theme={
      createTheme({ typography:{ fontFamily: fontFamily } })
    }>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);