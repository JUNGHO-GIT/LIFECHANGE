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
  CssBaseline, createTheme, ThemeProvider
} from "@importMuis";

import {
  useRoot, useScrollTop, useFoodSection, useLanguageSetting, useLanguageInitialize,
  useCommonValue, useStoreLoading
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
  AdminAppInfo, UserAppSetting, UserSignup, UserLogin, UserResetPw, UserDetail, UserDelete, UserCategory
} from "@importPages";

// -------------------------------------------------------------------------------------------------
const App = () => {

  const { PATH } = useCommonValue();
  const { setLOADING } = useStoreLoading();

  useEffect(() => {
    setLOADING(true);
  }, []);

  useRoot();
  useScrollTop();
  useFoodSection();
  useLanguageInitialize();
  useLanguageSetting();

  const noneHeader = (
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
    <div className={"App"}>
      {noneHeader && <Header />}
      {noneTop && <TopNav />}
      <Loader />
      <Alert />
      <Confirm />
      <Routes>
        {/** admin **/}
        <Route path={"/admin/*"}>
          <Route path={"dashboard"} element={<AdminDashboard />} />
        </Route>
        {/** auth **/}
        <Route path={"/auth/*"}>
          <Route path={"error"} element={<AuthError />} />
          <Route path={"google"} element={<AuthGoogle />} />
          <Route path={"privacy"} element={<AuthPrivacy />} />
        </Route>
        {/** calendar **/}
        <Route path={"/calendar/*"}>
          <Route path={"list"} element={<CalendarList />} />
          <Route path={"detail"} element={<CalendarDetail />} />
        </Route>
        {/** exercise **/}
        <Route path={"/exercise/*"}>
          <Route path={"chart/list"} element={<ExerciseChart />} />
          <Route path={"goal/list"} element={<ExerciseGoalList />} />
          <Route path={"goal/detail"} element={<ExerciseGoalDetail />} />
          <Route path={"list"} element={<ExerciseList />} />
          <Route path={"detail"} element={<ExerciseDetail />} />
        </Route>
        {/** food **/}
        <Route path={"/food/*"}>
          <Route path={"chart/list"} element={<FoodChart />} />
          <Route path={"goal/list"} element={<FoodGoalList />} />
          <Route path={"goal/detail"} element={<FoodGoalDetail />} />
          <Route path={"find/list"} element={<FoodFindList />} />
          <Route path={"favorite/list"} element={<FoodFavoriteList />} />
          <Route path={"list"} element={<FoodList />} />
          <Route path={"detail"} element={<FoodDetail />} />
        </Route>
        {/** today **/}
        <Route path={"/today/*"}>
          <Route path={"goal/list"} element={<TodayGoalList />} />
          <Route path={"list"} element={<TodayList />} />
        </Route>
        {/** money **/}
        <Route path={"/money/*"}>
          <Route path={"chart/list"} element={<MoneyChart />} />
          <Route path={"goal/list"} element={<MoneyGoalList />} />
          <Route path={"goal/detail"} element={<MoneyGoalDetail />} />
          <Route path={"list"} element={<MoneyList />} />
          <Route path={"detail"} element={<MoneyDetail />} />
        </Route>
        {/** sleep **/}
        <Route path={"/sleep/*"}>
          <Route path={"chart/list"} element={<SleepChart />} />
          <Route path={"goal/list"} element={<SleepGoalList />} />
          <Route path={"goal/detail"} element={<SleepGoalDetail />} />
          <Route path={"list"} element={<SleepList />} />
          <Route path={"detail"} element={<SleepDetail />} />
        </Route>
        {/** user **/}
        <Route path={"/user/*"}>
          <Route path={"appInfo"} element={<AdminAppInfo />} />
          <Route path={"appSetting"} element={<UserAppSetting />} />
          <Route path={"signup"} element={<UserSignup />} />
          <Route path={"login"} element={<UserLogin />} />
          <Route path={"resetPw"} element={<UserResetPw />} />
          <Route path={"detail"} element={<UserDetail />} />
          <Route path={"delete"} element={<UserDelete />} />
          <Route path={"category"} element={<UserCategory />} />
        </Route>
        <Route path={"/"} element={<UserLogin />} />
      </Routes>
      {noneBottom && <BottomNav />}
    </div>
  );
};

// -------------------------------------------------------------------------------------------------
createRoot(document.getElementById('root') as HTMLElement).render(
  <BrowserRouter basename={"/JPAGE"}>
    <ThemeProvider theme={
      createTheme({
        typography:{fontFamily:"Pretendard Variable, Pretendard, Noto Sans KR, Roboto, sans-serif"}
      })
    }>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>
);