// App.jsx

import React, {useEffect} from "react";
import {useLocation} from "react-router-dom";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useScrollTop} from "./assets/hooks/useScrollTop.jsx";
import {useEnhancedTouch} from "./assets/hooks/useEnhancedTouch.jsx";
import {useRoot} from "./assets/hooks/useRoot.jsx";
import {LanguageProvider} from "./assets/hooks/useLanguageProvider.jsx";
import CssBaseline from "@mui/material/CssBaseline";

import "./index.css";
import "moment/locale/ko";
import "react-calendar/dist/Calendar.css";
import "./assets/css/Calendar.css";
import "./assets/css/Dash.css";
import "./assets/css/Mui.css";
import "./assets/css/Components.css";
import "./assets/css/Core.css";
import "./assets/css/Jstyle.css";

import {Header} from "./import/ImportLayouts.jsx";
import {TopNav} from "./import/ImportLayouts.jsx";
import {BottomNav} from "./import/ImportLayouts.jsx";

import {CalendarList} from "./page/calendar/CalendarList.jsx";
import {CalendarSave} from "./page/calendar/CalendarSave.jsx";

import {ExerciseDash} from "./page/exercise/dash/ExerciseDash.jsx";
import {ExerciseDiff} from "./page/exercise/diff/ExerciseDiffList.jsx";
import {ExercisePlanList} from "./page/exercise/plan/ExercisePlanList.jsx";
import {ExercisePlanSave} from "./page/exercise/plan/ExercisePlanSave.jsx";
import {ExerciseList} from "./page/exercise/ExerciseList.jsx";
import {ExerciseSave} from "./page/exercise/ExerciseSave.jsx";

import {FoodDash} from "./page/food/dash/FoodDash.jsx";
import {FoodDiff} from "./page/food/diff/FoodDiffList.jsx";
import {FoodFindList} from "./page/food/find/FoodFindList.jsx";
import {FoodFindSave} from "./page/food/find/FoodFindSave.jsx";
import {FoodPlanList} from "./page/food/plan/FoodPlanList.jsx";
import {FoodPlanSave} from "./page/food/plan/FoodPlanSave.jsx";
import {FoodList} from "./page/food/FoodList.jsx";
import {FoodSave} from "./page/food/FoodSave.jsx";

import {MoneyDash} from "./page/money/dash/MoneyDash.jsx";
import {MoneyDiff} from "./page/money/diff/MoneyDiffList.jsx";
import {MoneyPlanList} from "./page/money/plan/MoneyPlanList.jsx";
import {MoneyPlanSave} from "./page/money/plan/MoneyPlanSave.jsx";
import {MoneyList} from "./page/money/MoneyList.jsx";
import {MoneySave} from "./page/money/MoneySave.jsx";

import {SleepDash} from "./page/sleep/dash/SleepDash.jsx";
import {SleepDiff} from "./page/sleep/diff/SleepDiffList.jsx";
import {SleepPlanList} from "./page/sleep/plan/SleepPlanList.jsx";
import {SleepPlanSave} from "./page/sleep/plan/SleepPlanSave.jsx";
import {SleepList} from "./page/sleep/SleepList.jsx";
import {SleepSave} from "./page/sleep/SleepSave.jsx";

import {UserDataCategory} from "./page/user/data/UserDataCategory.jsx";
import {UserDataDetail} from "./page/user/data/UserDataDetail.jsx";
import {UserDataList} from "./page/user/data/UserDataList.jsx";
import {UserSetting} from "./page/user/UserSetting.jsx";
import {UserInfo} from "./page/user/UserInfo.jsx";
import {UserSignup} from "./page/user/UserSignup.jsx";
import {UserLogin} from "./page/user/UserLogin.jsx";

// ------------------------------------------------------------------------------------------------>
const Calendar = () => (
  <Routes>
    <Route path="/list" element={<CalendarList />} />
    <Route path="/save" element={<CalendarSave />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Exercise = () =>  (
  <Routes>
    <Route path="/dash/list" element={<ExerciseDash />} />
    <Route path="/diff/list" element={<ExerciseDiff />} />
    <Route path="/plan/list" element={<ExercisePlanList />} />
    <Route path="/plan/save" element={<ExercisePlanSave />} />
    <Route path="/list" element={<ExerciseList />} />
    <Route path="/save" element={<ExerciseSave />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Food = () => (
  <Routes>
    <Route path="/dash/list" element={<FoodDash />} />
    <Route path="/diff/list" element={<FoodDiff />} />
    <Route path="/find/list" element={<FoodFindList />} />
    <Route path="/find/save" element={<FoodFindSave />} />
    <Route path="/plan/list" element={<FoodPlanList />} />
    <Route path="/plan/save" element={<FoodPlanSave />} />
    <Route path="/list" element={<FoodList />} />
    <Route path="/save" element={<FoodSave />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Money = () =>  (
  <Routes>
    <Route path="/dash/list" element={<MoneyDash />} />
    <Route path="/diff/list" element={<MoneyDiff />} />
    <Route path="/plan/list" element={<MoneyPlanList />} />
    <Route path="/plan/save" element={<MoneyPlanSave />} />
    <Route path="/list" element={<MoneyList />} />
    <Route path="/save" element={<MoneySave />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Sleep = () => (
  <Routes>
    <Route path="/dash/list" element={<SleepDash />} />
    <Route path="/diff/list" element={<SleepDiff />} />
    <Route path="/plan/list" element={<SleepPlanList />} />
    <Route path="/plan/save" element={<SleepPlanSave />} />
    <Route path="/list" element={<SleepList />} />
    <Route path="/save" element={<SleepSave />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const User = () => (
  <Routes>
    <Route path="/data/category" element={<UserDataCategory />} />
    <Route path="/data/detail" element={<UserDataDetail />} />
    <Route path="/data/list" element={<UserDataList />} />
    <Route path="/setting" element={<UserSetting />} />
    <Route path="/info" element={<UserInfo />} />
    <Route path="/signup" element={<UserSignup />} />
    <Route path="/login" element={<UserLogin />} />
  </Routes>
);

// ------------------------------------------------------------------------------------------------>
const App = () => {
  const location = useLocation();
  const noneHeader = (
    location.pathname === "/user/login" ||
    location.pathname === "/user/signup"
  );
  const noneTop = (
    location.pathname === "/user/login" ||
    location.pathname === "/user/signup" ||
    location.pathname === "/user/info" ||
    location.pathname === "/user/setting" ||
    location.pathname === "/user/data/detail" ||
    location.pathname === "/user/data/category" ||
    location.pathname === "/user/data/list"
  );
  const noneBottom = (
    location.pathname === "/user/login" ||
    location.pathname === "/user/signup" ||
    location.pathname === "/user/info" ||
    location.pathname === "/user/setting" ||
    location.pathname === "/user/data/detail" ||
    location.pathname === "/user/data/category" ||
    location.pathname === "/user/data/list"
  );

  useRoot();
  useScrollTop();
  useEnhancedTouch();

  return (
    <div className={"App"}>
      {!noneHeader && <Header />}
      {!noneTop && <TopNav />}
      <Routes>
        <Route path="/calendar/*" element={<Calendar />} />
        <Route path="/exercise/*" element={<Exercise />} />
        <Route path="/food/*" element={<Food />} />
        <Route path="/money/*" element={<Money />} />
        <Route path="/sleep/*" element={<Sleep />} />
        <Route path="/user/*" element={<User />} />
      </Routes>
      {!noneBottom && <BottomNav />}
    </div>
  );
};

// ------------------------------------------------------------------------------------------------>
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