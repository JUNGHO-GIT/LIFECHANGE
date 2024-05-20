// App.jsx

import React from "react";
import {useLocation} from "react-router-dom";
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route, Navigate} from "react-router-dom";
import {useScrollTop} from "./assets/hooks/useScrollTop.jsx";
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
import {NavBar} from "./import/ImportLayouts.jsx";
import {TopNav} from "./import/ImportLayouts.jsx";
import {BottomNav} from "./import/ImportLayouts.jsx";

import {CalendarList} from "./page/calendar/CalendarList";
import {CalendarSave} from "./page/calendar/CalendarSave";

import {ExerciseDash} from "./page/exercise/dash/ExerciseDash";
import {ExerciseDiff} from "./page/exercise/diff/ExerciseDiffList.jsx";
import {ExercisePlanList} from "./page/exercise/plan/ExercisePlanList";
import {ExercisePlanSave} from "./page/exercise/plan/ExercisePlanSave";
import {ExerciseList} from "./page/exercise/ExerciseList";
import {ExerciseSave} from "./page/exercise/ExerciseSave";

import {FoodDash} from "./page/food/dash/FoodDash";
import {FoodDiff} from "./page/food/diff/FoodDiffList.jsx";
import {FoodFindList} from "./page/food/find/FoodFindList";
import {FoodFindSave} from "./page/food/find/FoodFindSave";
import {FoodPlanList} from "./page/food/plan/FoodPlanList";
import {FoodPlanSave} from "./page/food/plan/FoodPlanSave";
import {FoodList} from "./page/food/FoodList";
import {FoodSave} from "./page/food/FoodSave";

import {MoneyDash} from "./page/money/dash/MoneyDash";
import {MoneyDiff} from "./page/money/diff/MoneyDiffList.jsx";
import {MoneyPlanList} from "./page/money/plan/MoneyPlanList";
import {MoneyPlanSave} from "./page/money/plan/MoneyPlanSave";
import {MoneyList} from "./page/money/MoneyList";
import {MoneySave} from "./page/money/MoneySave";

import {SleepDash} from "./page/sleep/dash/SleepDash";
import {SleepDiff} from "./page/sleep/diff/SleepDiffList.jsx";
import {SleepPlanList} from "./page/sleep/plan/SleepPlanList";
import {SleepPlanSave} from "./page/sleep/plan/SleepPlanSave";
import {SleepList} from "./page/sleep/SleepList";
import {SleepSave} from "./page/sleep/SleepSave";

import {UserDataSet} from "./page/user/data/UserDataSet";
import {UserDataList} from "./page/user/data/UserDataList";
import {UserSignup} from "./page/user/UserSignup";
import {UserLogin} from "./page/user/UserLogin";

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
    <Route path="/data/set" element={<UserDataSet />} />
    <Route path="/data/list" element={<UserDataList />} />
    <Route path="/signup" element={<UserSignup />} />
    <Route path="/login" element={<UserLogin />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const App = () => {
  useScrollTop();
  const location = useLocation();
  const isRoot = location.pathname === '/';
  const isLogin = location.pathname === '/user/login';
  const isSignup = location.pathname === '/user/signup';
  return (
    <div className={"App"}>
      {!isLogin && !isSignup && <Header />}
      {!isLogin && !isSignup && <NavBar />}
      {!isLogin && !isSignup && <TopNav />}
      <Routes>
        {isRoot && <Route path="/" element={<Navigate to="/user/login" replace />} />}
        <Route path="/calendar/*" element={<Calendar />} />
        <Route path="/exercise/*" element={<Exercise />} />
        <Route path="/food/*" element={<Food />} />
        <Route path="/money/*" element={<Money />} />
        <Route path="/sleep/*" element={<Sleep />} />
        <Route path="/user/*" element={<User />} />
      </Routes>
      {!isLogin && !isSignup && <BottomNav />}
    </div>
  );
};
// ------------------------------------------------------------------------------------------------>
const rootElement = document.getElementById('root');

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