// ImportPages.tsx

import { lazy } from "@importReacts";

// admin -------------------------------------------------------------------------------------------
const AdminDashboard = lazy(() => import("@pages/admin/AdminDashboard").then((module) => ({
  default: module.AdminDashboard
})));

// auth --------------------------------------------------------------------------------------------
const AuthError = lazy(() => import("@pages/auth/AuthError").then((module) => ({
  default: module.AuthError
})));
const AuthGoogle = lazy(() => import("@pages/auth/AuthGoogle").then((module) => ({
  default: module.AuthGoogle
})));
const AuthPrivacy = lazy(() => import("@pages/auth/AuthPrivacy").then((module) => ({
  default: module.AuthPrivacy
})));

// calendar ----------------------------------------------------------------------------------------
const CalendarList = lazy(() => import("@pages/calendar/CalendarList").then((module) => ({
  default: module.CalendarList
})));
const CalendarDetail = lazy(() => import("@pages/calendar/CalendarDetail").then((module) => ({
  default: module.CalendarDetail
})));

// exercise ----------------------------------------------------------------------------------------
const ExerciseChart = lazy(() => import("@pages/exercise/chart/ExerciseChart").then((module) => ({
  default: module.ExerciseChart
})));
const ExerciseGoalList = lazy(() => import("@pages/exercise/goal/ExerciseGoalList").then((module) => ({
  default: module.ExerciseGoalList
})));
const ExerciseGoalDetail = lazy(() => import("@pages/exercise/goal/ExerciseGoalDetail").then((module) => ({
  default: module.ExerciseGoalDetail
})));
const ExerciseList = lazy(() => import("@pages/exercise/ExerciseList").then((module) => ({
  default: module.ExerciseList
})));
const ExerciseDetail = lazy(() => import("@pages/exercise/ExerciseDetail").then((module) => ({
  default: module.ExerciseDetail
})));

// food --------------------------------------------------------------------------------------------
const FoodChart = lazy(() => import("@pages/food/chart/FoodChart").then((module) => ({
  default: module.FoodChart
})));
const FoodGoalList = lazy(() => import("@pages/food/goal/FoodGoalList").then((module) => ({
  default: module.FoodGoalList
})));
const FoodGoalDetail = lazy(() => import("@pages/food/goal/FoodGoalDetail").then((module) => ({
  default: module.FoodGoalDetail
})));
const FoodFindList = lazy(() => import("@pages/food/find/FoodFindList").then((module) => ({
  default: module.FoodFindList
})));
const FoodFavoriteList = lazy(() => import("@pages/food/find/FoodFavoriteList").then((module) => ({
  default: module.FoodFavoriteList
})));
const FoodList = lazy(() => import("@pages/food/FoodList").then((module) => ({
  default: module.FoodList
})));
const FoodDetail = lazy(() => import("@pages/food/FoodDetail").then((module) => ({
  default: module.FoodDetail
})));

// today -------------------------------------------------------------------------------------------
const TodayGoalList = lazy(() => import("@pages/today/TodayGoalList").then((module) => ({
  default: module.TodayGoalList
})));
const TodayList = lazy(() => import("@pages/today/TodayList").then((module) => ({
  default: module.TodayList
})));

// money -------------------------------------------------------------------------------------------
const MoneyChart = lazy(() => import("@pages/money/chart/MoneyChart").then((module) => ({
  default: module.MoneyChart
})));
const MoneyGoalList = lazy(() => import("@pages/money/goal/MoneyGoalList").then((module) => ({
  default: module.MoneyGoalList
})));
const MoneyGoalDetail = lazy(() => import("@pages/money/goal/MoneyGoalDetail").then((module) => ({
  default: module.MoneyGoalDetail
})));
const MoneyList = lazy(() => import("@pages/money/MoneyList").then((module) => ({
  default: module.MoneyList
})));
const MoneyDetail = lazy(() => import("@pages/money/MoneyDetail").then((module) => ({
  default: module.MoneyDetail
})));

// sleep -------------------------------------------------------------------------------------------
const SleepChart = lazy(() => import("@pages/sleep/chart/SleepChart").then((module) => ({
  default: module.SleepChart
})));
const SleepGoalList = lazy(() => import("@pages/sleep/goal/SleepGoalList").then((module) => ({
  default: module.SleepGoalList
})));
const SleepGoalDetail = lazy(() => import("@pages/sleep/goal/SleepGoalDetail").then((module) => ({
  default: module.SleepGoalDetail
})));
const SleepList = lazy(() => import("@pages/sleep/SleepList").then((module) => ({
  default: module.SleepList
})));
const SleepDetail = lazy(() => import("@pages/sleep/SleepDetail").then((module) => ({
  default: module.SleepDetail
})));

// user --------------------------------------------------------------------------------------------
const UserAppInfo = lazy(() => import("@pages/user/UserAppInfo").then((module) => ({
  default: module.UserAppInfo
})));
const UserAppSetting = lazy(() => import("@pages/user/UserAppSetting").then((module) => ({
  default: module.UserAppSetting
})));
const UserSignup = lazy(() => import("@pages/user/UserSignup").then((module) => ({
  default: module.UserSignup
})));
const UserLogin = lazy(() => import("@pages/user/UserLogin").then((module) => ({
  default: module.UserLogin
})));
const UserResetPw = lazy(() => import("@pages/user/UserResetPw").then((module) => ({
  default: module.UserResetPw
})));
const UserDetail = lazy(() => import("@pages/user/UserDetail").then((module) => ({
  default: module.UserDetail
})));
const UserDelete = lazy(() => import("@pages/user/UserDelete").then((module) => ({
  default: module.UserDelete
})));
const UserCategory = lazy(() => import("@pages/user/UserCategory").then((module) => ({
  default: module.UserCategory
})));

// -------------------------------------------------------------------------------------------------
export {
  AdminDashboard,
  AuthError,
  AuthGoogle,
  AuthPrivacy,
  CalendarList,
  CalendarDetail,
  ExerciseChart,
  ExerciseGoalList,
  ExerciseGoalDetail,
  ExerciseList,
  ExerciseDetail,
  FoodChart,
  FoodGoalList,
  FoodGoalDetail,
  FoodFindList,
  FoodFavoriteList,
  FoodList,
  FoodDetail,
  TodayGoalList,
  TodayList,
  MoneyChart,
  MoneyGoalList,
  MoneyGoalDetail,
  MoneyList,
  MoneyDetail,
  SleepChart,
  SleepGoalList,
  SleepGoalDetail,
  SleepList,
  SleepDetail,
  UserAppInfo,
  UserAppSetting,
  UserSignup,
  UserLogin,
  UserResetPw,
  UserDetail,
  UserDelete,
  UserCategory
};