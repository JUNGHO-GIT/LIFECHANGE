/**
 * @file index.tsx
 * @description foo-hmr-probe
 * @author Jungho
 * @since 2025-12-26
 */

import "react-calendar/dist/Calendar.css";
import "@assets/styles/Core.css";
import "@assets/styles/Calendar.css";
import "@assets/styles/Chart.css";
import "@assets/styles/Mui.css";
import "@assets/styles/Components.css";
import "@assets/styles/Extra.css";

import lifechangeLogo from "@assets/images/splash-v2.webp";
import { useCommonValue } from "@hooks/common/useCommonValue";
import { useLanguageInitialize } from "@hooks/language/useLanguageInitialize";
import { useLanguageSetting } from "@hooks/language/useLanguageSetting";
import { useFoodSection } from "@hooks/util/useFoodSection";
import { useRoot } from "@hooks/util/useRoot";
import { useScrollTop } from "@hooks/util/useScrollTop";
import { Alert } from "@interfaces/layouts/Alert";
import { BottomNav } from "@interfaces/layouts/BottomNav";
import { Confirm } from "@interfaces/layouts/Confirm";
import { ErrorBoundary } from "@interfaces/layouts/ErrorBoundary";
import { Header } from "@interfaces/layouts/Header";
import { Loader } from "@interfaces/layouts/Loader";
import { TopNav } from "@interfaces/layouts/TopNav";
import { CssBaseline, createTheme, ThemeProvider } from "@exportMuis";
import { BrowserRouter, createRoot, lazy, memo, Route, Routes, Suspense, useEffect, useState } from "@exportReacts";
import { registerInterceptor } from "@assets/scripts/interceptor";

// admin ------------------------------------------------------------------------------------------
const AdminDashboard = lazy(() => import("@pages/admin/AdminDashboard").then((m) => ({
  default: m.AdminDashboard,
})));
const AdminAppInfo = lazy(() => import("@pages/admin/AdminAppInfo").then((m) => ({
  default: m.AdminAppInfo,
})));

// auth --------------------------------------------------------------------------------------------
const AuthError = lazy(() => import("@pages/auth/AuthError").then((m) => ({
  default: m.AuthError
})));
const AuthGoogle = lazy(() => import("@pages/auth/AuthGoogle").then((m) => ({
  default: m.AuthGoogle
})));
const AuthPrivacy = lazy(() => import("@pages/auth/AuthPrivacy").then((m) => ({
  default: m.AuthPrivacy
})));

// calendar ----------------------------------------------------------------------------------------
const CalendarList = lazy(() => import("@pages/calendar/CalendarList").then((m) => ({
  default: m.CalendarList
})));
const CalendarDetail = lazy(() => import("@pages/calendar/CalendarDetail").then((m) => ({
  default: m.CalendarDetail
})));

// exercise ----------------------------------------------------------------------------------------
const ExerciseChart = lazy(() => import("@pages/exercise/chart/ExerciseChart").then((m) => ({
  default: m.ExerciseChart
})));
const ExerciseGoalList = lazy(() => import("@pages/exercise/goal/ExerciseGoalList").then((m) => ({
  default: m.ExerciseGoalList
})));
const ExerciseGoalDetail = lazy(() => import("@pages/exercise/goal/ExerciseGoalDetail").then((m) => ({
  default: m.ExerciseGoalDetail
})));
const ExerciseRecordList = lazy(() => import("@pages/exercise/record/ExerciseRecordList").then((m) => ({
  default: m.ExerciseRecordList
})));
const ExerciseRecordDetail = lazy(() => import("@pages/exercise/record/ExerciseRecordDetail").then((m) => ({
  default: m.ExerciseRecordDetail
})));

// food --------------------------------------------------------------------------------------------
const FoodChart = lazy(() => import("@pages/food/chart/FoodChart").then((m) => ({
  default: m.FoodChart
})));
const FoodGoalList = lazy(() => import("@pages/food/goal/FoodGoalList").then((m) => ({
  default: m.FoodGoalList
})));
const FoodGoalDetail = lazy(() => import("@pages/food/goal/FoodGoalDetail").then((m) => ({
  default: m.FoodGoalDetail
})));
const FoodFindList = lazy(() => import("@pages/food/find/FoodFindList").then((m) => ({
  default: m.FoodFindList
})));
const FoodFavoriteList = lazy(() => import("@pages/food/find/FoodFavoriteList").then((m) => ({
  default: m.FoodFavoriteList
})));
const FoodRecordList = lazy(() => import("@pages/food/record/FoodRecordList").then((m) => ({
  default: m.FoodRecordList
})));
const FoodRecordDetail = lazy(() => import("@pages/food/record/FoodRecordDetail").then((m) => ({
  default: m.FoodRecordDetail
})));

// money ------------------------------------------------------------------------------------------
const MoneyChart = lazy(() => import("@pages/money/chart/MoneyChart").then((m) => ({
  default: m.MoneyChart
})));
const MoneyGoalList = lazy(() => import("@pages/money/goal/MoneyGoalList").then((m) => ({
  default: m.MoneyGoalList
})));
const MoneyGoalDetail = lazy(() => import("@pages/money/goal/MoneyGoalDetail").then((m) => ({
  default: m.MoneyGoalDetail
})));
const MoneyRecordList = lazy(() => import("@pages/money/record/MoneyRecordList").then((m) => ({
  default: m.MoneyRecordList
})));
const MoneyRecordDetail = lazy(() => import("@pages/money/record/MoneyRecordDetail").then((m) => ({
  default: m.MoneyRecordDetail
})));

// sleep ------------------------------------------------------------------------------------------
const SleepChart = lazy(() => import("@pages/sleep/chart/SleepChart").then((m) => ({
  default: m.SleepChart
})));
const SleepGoalList = lazy(() => import("@pages/sleep/goal/SleepGoalList").then((m) => ({
  default: m.SleepGoalList
})));
const SleepGoalDetail = lazy(() => import("@pages/sleep/goal/SleepGoalDetail").then((m) => ({
  default: m.SleepGoalDetail
})));
const SleepRecordList = lazy(() => import("@pages/sleep/record/SleepRecordList").then((m) => ({
  default: m.SleepRecordList
})));
const SleepRecordDetail = lazy(() => import("@pages/sleep/record/SleepRecordDetail").then((m) => ({
  default: m.SleepRecordDetail
})));

// user --------------------------------------------------------------------------------------------
const UserAppSetting = lazy(() => import("@pages/user/UserAppSetting").then((m) => ({
  default: m.UserAppSetting
})));
const UserSignup = lazy(() => import("@pages/user/UserSignup").then((m) => ({
  default: m.UserSignup
})));
const UserLogin = lazy(() => import("@pages/user/UserLogin").then((m) => ({
  default: m.UserLogin
})));
const UserResetPw = lazy(() => import("@pages/user/UserResetPw").then((m) => ({
  default: m.UserResetPw
})));
const UserDetail = lazy(() => import("@pages/user/UserDetail").then((m) => ({
  default: m.UserDetail
})));
const UserDelete = lazy(() => import("@pages/user/UserDelete").then((m) => ({
  default: m.UserDelete
})));
const UserCategory = lazy(() => import("@pages/user/UserCategory").then((m) => ({
  default: m.UserCategory
})));

// 앱 실행 스플래시 ------------------------------------------------------------------------------
const SplashScreen = memo(() => {
  const [visible, setVisible] = useState<boolean>(true);
  const [closing, setClosing] = useState<boolean>(false);

  useEffect(() => {
    const closeTimer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setClosing(true);
    }, 1350);
    const hideTimer: ReturnType<typeof setTimeout> = setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => {
      clearTimeout(closeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return visible ? (
    <div
      aria-label={`lifechange loading`}
      className={`splash-screen${closing ? ` is-closing` : ``}`}
      role={`status`}
    >
      <img
        alt={`LIFECHANGE`}
        className={`splash-logo`}
        decoding={`async`}
        src={lifechangeLogo}
      />
    </div>
  ) : null;
});

// 앱 라우트 ----------------------------------------------------------------------------------
const App = memo(() => {
  const { PATH } = useCommonValue();

  useRoot();
  useScrollTop();
  useFoodSection();
  useLanguageInitialize();
  useLanguageSetting();

  const noneHeader: boolean =
    !PATH.includes(`/user/login`) &&
    !PATH.includes(`/user/signup`) &&
    !PATH.includes(`/user/resetPw`) &&
    !PATH.includes(`/auth/error`) &&
    !PATH.includes(`/auth/privacy`);
  const noneTop: boolean =
    !PATH.includes(`/user`) &&
    !PATH.includes(`/auth/error`) &&
    !PATH.includes(`/auth/privacy`);
  const noneBottom: boolean =
    !PATH.includes(`/user`) &&
    !PATH.includes(`/auth/error`) &&
    !PATH.includes(`/auth/privacy`);

  return (
    <div className={`App`}>
      {noneHeader ? <Header /> : null}
      {noneTop ? <TopNav /> : null}
      <Loader />
      <Alert />
      <Confirm />
      <Suspense fallback={<Loader active={true} />}>
        <Routes>
          {/** home * */}
          <Route path={`/`} element={<div />} />
          {/** admin * */}
          <Route path={`/admin/dashboard/*`} element={<AdminDashboard />} />
          {/** auth * */}
          <Route path={`/auth/error/*`} element={<AuthError />} />
          <Route path={`/auth/google/*`} element={<AuthGoogle />} />
          <Route path={`/auth/privacy/*`} element={<AuthPrivacy />} />
          {/** calendar * */}
          <Route path={`/calendar/list/*`} element={<CalendarList />} />
          <Route path={`/calendar/detail/*`} element={<CalendarDetail />} />
          {/** exercise * */}
          <Route path={`/exercise/chart/list/*`} element={<ExerciseChart />} />
          <Route path={`/exercise/goal/list/*`} element={<ExerciseGoalList />} />
          <Route path={`/exercise/goal/detail/*`} element={<ExerciseGoalDetail />} />
          <Route path={`/exercise/record/list/*`} element={<ExerciseRecordList />} />
          <Route path={`/exercise/record/detail/*`} element={<ExerciseRecordDetail />} />
          {/** food * */}
          <Route path={`/food/chart/list/*`} element={<FoodChart />} />
          <Route path={`/food/goal/list/*`} element={<FoodGoalList />} />
          <Route path={`/food/goal/detail/*`} element={<FoodGoalDetail />} />
          <Route path={`/food/record/list/*`} element={<FoodRecordList />} />
          <Route path={`/food/record/detail/*`} element={<FoodRecordDetail />} />
          <Route path={`/food/favorite/list/*`} element={<FoodFavoriteList />} />
          <Route path={`/food/find/list/*`} element={<FoodFindList />} />
          {/** money * */}
          <Route path={`/money/chart/list/*`} element={<MoneyChart />} />
          <Route path={`/money/goal/list/*`} element={<MoneyGoalList />} />
          <Route path={`/money/goal/detail/*`} element={<MoneyGoalDetail />} />
          <Route path={`/money/record/list/*`} element={<MoneyRecordList />} />
          <Route path={`/money/record/detail/*`} element={<MoneyRecordDetail />} />
          {/** sleep * */}
          <Route path={`/sleep/chart/list/*`} element={<SleepChart />} />
          <Route path={`/sleep/goal/list/*`} element={<SleepGoalList />} />
          <Route path={`/sleep/goal/detail/*`} element={<SleepGoalDetail />} />
          <Route path={`/sleep/record/list/*`} element={<SleepRecordList />} />
          <Route path={`/sleep/record/detail/*`} element={<SleepRecordDetail />} />
          {/** user * */}
          <Route path={`/user/appInfo/*`} element={<AdminAppInfo />} />
          <Route path={`/user/appSetting/*`} element={<UserAppSetting />} />
          <Route path={`/user/signup/*`} element={<UserSignup />} />
          <Route path={`/user/login/*`} element={<UserLogin />} />
          <Route path={`/user/resetPw/*`} element={<UserResetPw />} />
          <Route path={`/user/detail/*`} element={<UserDetail />} />
          <Route path={`/user/delete/*`} element={<UserDelete />} />
          <Route path={`/user/category/*`} element={<UserCategory />} />
        </Routes>
      </Suspense>
      {noneBottom ? <BottomNav /> : null}
    </div>
  );
});

// -------------------------------------------------------------------------------------------------
const fontFamily: string = `'Pretendard Variable', Pretendard, FontAwesome, -apple-system, BlinkMacSystemFont, system-ui, Roboto, 'Helvetica Neue', 'Segoe UI', 'Apple SD Gothic Neo', 'Noto Sans KR', 'Malgun Gothic', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', sans-serif`;

// 테마 팔레트 -----------------------------------------------------------------------------------
const appTheme = createTheme({
  typography: {
    fontFamily: fontFamily
  },
  palette: {
    mode: `light`,
    primary: { main: `#0876b9` },
    secondary: { main: `#005f9e` },
    error: { main: `#f44336` },
    background: {
      default: `#f7f7f7`,
      paper: `#ffffff`,
    },
  },
});

// -------------------------------------------------------------------------------------------------
registerInterceptor();
createRoot(document.querySelector(`#root`) as HTMLElement).render(
  <BrowserRouter basename={`/lifechange`}>
    <ThemeProvider theme={appTheme}>
      <CssBaseline />
      <ErrorBoundary>
        <App />
        <SplashScreen />
      </ErrorBoundary>
    </ThemeProvider>
  </BrowserRouter>,
);
