// index.jsx

import "./index.css";
import "moment/locale/ko";
import "react-calendar/dist/Calendar.css";
import "./assets/css/Calendar.css";
import "./assets/css/Dash.css";
import "./assets/css/Mui.css";
import "./assets/css/Components.css";
import "./assets/css/Core.css";
import "./assets/css/Jstyle.css";

import React, { Suspense, lazy } from "react";
import { useLocation } from "react-router-dom";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useScrollTop } from "./assets/hooks/useScrollTop.jsx";
import { useEnhancedTouch } from "./assets/hooks/useEnhancedTouch.jsx";
import { useRoot } from "./assets/hooks/useRoot.jsx";
import { LanguageProvider } from "./assets/hooks/useLanguageProvider.jsx";
import CssBaseline from "@mui/material/CssBaseline";

// Lazy loading components -------------------------------------------------------------------------
const Header = lazy(() => (
  import("./import/ImportLayouts.jsx").then(module => ({
    default: module.Header
  }))
));
const TopNav = lazy(() => (
  import("./import/ImportLayouts.jsx").then(module => ({
    default: module.TopNav
  }))
));
const BottomNav = lazy(() => (
  import("./import/ImportLayouts.jsx").then(module => ({
    default: module.BottomNav
  }))
));

const CalendarList = lazy(() => (
  import("./page/calendar/CalendarList.jsx").then(module => ({
    default: module.CalendarList
  }))
));
const CalendarSave = lazy(() => (
  import("./page/calendar/CalendarSave.jsx").then(module => ({
    default: module.CalendarSave
  }))
));

const ExerciseDash = lazy(() => (
  import("./page/exercise/dash/ExerciseDash.jsx").then(module => ({
    default: module.ExerciseDash
  }))
));
const ExerciseDiff = lazy(() => (
  import("./page/exercise/diff/ExerciseDiffList.jsx").then(module => ({
    default: module.ExerciseDiff
  }))
));
const ExerciseGoalList = lazy(() => (
  import("./page/exercise/goal/ExerciseGoalList.jsx").then(module => ({
    default: module.ExerciseGoalList
  }))
));
const ExerciseGoalSave = lazy(() => (
  import("./page/exercise/goal/ExerciseGoalSave.jsx").then(module => ({
    default: module.ExerciseGoalSave
  }))
));
const ExerciseList = lazy(() => (
  import("./page/exercise/ExerciseList.jsx").then(module => ({
    default: module.ExerciseList
  }))
));
const ExerciseSave = lazy(() => (
  import("./page/exercise/ExerciseSave.jsx").then(module => ({
    default: module.ExerciseSave
  }))
));

const FoodDash = lazy(() => (
  import("./page/food/dash/FoodDash.jsx").then(module => ({
    default: module.FoodDash
  }))
));
const FoodDiff = lazy(() => (
  import("./page/food/diff/FoodDiffList.jsx").then(module => ({
    default: module.FoodDiff
  }))
));
const FoodFindList = lazy(() => (
  import("./page/food/find/FoodFindList.jsx").then(module => ({
    default: module.FoodFindList
  }))
));
const FoodFindSave = lazy(() => (
  import("./page/food/find/FoodFindSave.jsx").then(module => ({
    default: module.FoodFindSave
  }))
));
const FoodGoalList = lazy(() => (
  import("./page/food/goal/FoodGoalList.jsx").then(module => ({
    default: module.FoodGoalList
  }))
));
const FoodGoalSave = lazy(() => (
  import("./page/food/goal/FoodGoalSave.jsx").then(module => ({
    default: module.FoodGoalSave
  }))
));
const FoodList = lazy(() => (
  import("./page/food/FoodList.jsx").then(module => ({
    default: module.FoodList
  }))
));
const FoodSave = lazy(() => (
  import("./page/food/FoodSave.jsx").then(module => ({
    default: module.FoodSave
  }))
));

const MoneyDash = lazy(() => (
  import("./page/money/dash/MoneyDash.jsx").then(module => ({
    default: module.MoneyDash
  }))
));
const MoneyDiff = lazy(() => (
  import("./page/money/diff/MoneyDiffList.jsx").then(module => ({
    default: module.MoneyDiff
  }))
));
const MoneyGoalList = lazy(() => (
  import("./page/money/goal/MoneyGoalList.jsx").then(module => ({
    default: module.MoneyGoalList
  }))
));
const MoneyGoalSave = lazy(() => (
  import("./page/money/goal/MoneyGoalSave.jsx").then(module => ({
    default: module.MoneyGoalSave
  }))
));
const MoneyList = lazy(() => (
  import("./page/money/MoneyList.jsx").then(module => ({
    default: module.MoneyList
  }))
));
const MoneySave = lazy(() => (
  import("./page/money/MoneySave.jsx").then(module => ({
    default: module.MoneySave
  }))
));

const SleepDash = lazy(() => (
  import("./page/sleep/dash/SleepDash.jsx").then(module => ({
    default: module.SleepDash
  }))
));
const SleepDiff = lazy(() => (
  import("./page/sleep/diff/SleepDiffList.jsx").then(module => ({
    default: module.SleepDiff
  }))
));
const SleepGoalList = lazy(() => (
  import("./page/sleep/goal/SleepGoalList.jsx").then(module => ({
    default: module.SleepGoalList
  }))
));
const SleepGoalSave = lazy(() => (
  import("./page/sleep/goal/SleepGoalSave.jsx").then(module => ({
    default: module.SleepGoalSave
  }))
));
const SleepList = lazy(() => (
  import("./page/sleep/SleepList.jsx").then(module => ({
    default: module.SleepList
  }))
));
const SleepSave = lazy(() => (
  import("./page/sleep/SleepSave.jsx").then(module => ({
    default: module.SleepSave
  }))
));

const UserDataCategory = lazy(() => (
  import("./page/user/data/UserDataCategory.jsx").then(module => ({
    default: module.UserDataCategory
  }))
));
const UserDataDetail = lazy(() => (
  import("./page/user/data/UserDataDetail.jsx").then(module => ({
    default: module.UserDataDetail
  }))
));
const UserDataList = lazy(() => (
  import("./page/user/data/UserDataList.jsx").then(module => ({
    default: module.UserDataList
  }))
));
const UserSetting = lazy(() => (
  import("./page/user/UserSetting.jsx").then(module => ({
    default: module.UserSetting
  }))
));
const UserDeletes = lazy(() => (
  import("./page/user/UserDeletes.jsx").then(module => ({
    default: module.UserDeletes
  }))
));
const UserInfo = lazy(() => (
  import("./page/user/UserInfo.jsx").then(module => ({
    default: module.UserInfo
  }))
));
const UserSignup = lazy(() => (
  import("./page/user/UserSignup.jsx").then(module => ({
    default: module.UserSignup
  }))
));
const UserLogin = lazy(() => (
  import("./page/user/UserLogin.jsx").then(module => ({
    default: module.UserLogin
  }))
));

// -------------------------------------------------------------------------------------------------
const Calendar = () => (
  <Suspense>
    <Routes>
      <Route path="/list" element={<CalendarList />} />
      <Route path="/save" element={<CalendarSave />} />
    </Routes>
  </Suspense>
);

// -------------------------------------------------------------------------------------------------
const Exercise = () => (
  <Suspense>
    <Routes>
      <Route path="/dash/list" element={<ExerciseDash />} />
      <Route path="/diff/list" element={<ExerciseDiff />} />
      <Route path="/goal/list" element={<ExerciseGoalList />} />
      <Route path="/goal/save" element={<ExerciseGoalSave />} />
      <Route path="/list" element={<ExerciseList />} />
      <Route path="/save" element={<ExerciseSave />} />
    </Routes>
  </Suspense>
);

// -------------------------------------------------------------------------------------------------
const Food = () => (
  <Suspense>
    <Routes>
      <Route path="/dash/list" element={<FoodDash />} />
      <Route path="/diff/list" element={<FoodDiff />} />
      <Route path="/find/list" element={<FoodFindList />} />
      <Route path="/find/save" element={<FoodFindSave />} />
      <Route path="/goal/list" element={<FoodGoalList />} />
      <Route path="/goal/save" element={<FoodGoalSave />} />
      <Route path="/list" element={<FoodList />} />
      <Route path="/save" element={<FoodSave />} />
    </Routes>
  </Suspense>
);

// -------------------------------------------------------------------------------------------------
const Money = () => (
  <Suspense>
    <Routes>
      <Route path="/dash/list" element={<MoneyDash />} />
      <Route path="/diff/list" element={<MoneyDiff />} />
      <Route path="/goal/list" element={<MoneyGoalList />} />
      <Route path="/goal/save" element={<MoneyGoalSave />} />
      <Route path="/list" element={<MoneyList />} />
      <Route path="/save" element={<MoneySave />} />
    </Routes>
  </Suspense>
);

// -------------------------------------------------------------------------------------------------
const Sleep = () => (
  <Suspense>
    <Routes>
      <Route path="/dash/list" element={<SleepDash />} />
      <Route path="/diff/list" element={<SleepDiff />} />
      <Route path="/goal/list" element={<SleepGoalList />} />
      <Route path="/goal/save" element={<SleepGoalSave />} />
      <Route path="/list" element={<SleepList />} />
      <Route path="/save" element={<SleepSave />} />
    </Routes>
  </Suspense>
);

// -------------------------------------------------------------------------------------------------
const User = () => (
  <Suspense>
    <Routes>
      <Route path="/data/category" element={<UserDataCategory />} />
      <Route path="/data/detail" element={<UserDataDetail />} />
      <Route path="/data/list" element={<UserDataList />} />
      <Route path="/setting" element={<UserSetting />} />
      <Route path="/info" element={<UserInfo />} />
      <Route path="/deletes" element={<UserDeletes />} />
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/login" element={<UserLogin />} />
    </Routes>
  </Suspense>
);

// -------------------------------------------------------------------------------------------------
const App = () => {
  const location = useLocation();
  const noneHeader = (
    location.pathname === "/user/login" ||
    location.pathname === "/user/signup"
  );
  const noneTop = (
    location.pathname.indexOf("/user") > -1
  );
  const noneBottom = (
    location.pathname.indexOf("/user") > -1
  );

  useRoot();
  useScrollTop();
  useEnhancedTouch();

  return (
    <div className={"App"}>
      {!noneHeader && (
        <Suspense>
          <Header />
        </Suspense>
      )}
      {!noneTop && (
        <Suspense>
          <TopNav />
        </Suspense>
      )}
      <Routes>
        <Route path="/calendar/*" element={<Calendar />} />
        <Route path="/exercise/*" element={<Exercise />} />
        <Route path="/food/*" element={<Food />} />
        <Route path="/money/*" element={<Money />} />
        <Route path="/sleep/*" element={<Sleep />} />
        <Route path="/user/*" element={<User />} />
      </Routes>
      {!noneBottom && (
        <Suspense>
          <BottomNav />
        </Suspense>
      )}
    </div>
  );
};

// -------------------------------------------------------------------------------------------------
const rootElement = document.getElementById("root");
if (rootElement === null) {
  throw new Error("root element is null");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <LanguageProvider>
      <CssBaseline />
      <App />
    </LanguageProvider>
  </BrowserRouter>
);
