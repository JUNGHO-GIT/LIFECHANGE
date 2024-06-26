// App.jsx

import React from "react";
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
import {Ad} from "./import/ImportLayouts.jsx";
import {BottomNav} from "./import/ImportLayouts.jsx";

import {CalendarList} from "./page/calendar/CalendarList.jsx";
import {CalendarSave} from "./page/calendar/CalendarSave.jsx";

import {ExerciseDash} from "./page/exercise/dash/ExerciseDash.jsx";
import {ExerciseDiff} from "./page/exercise/diff/ExerciseDiffList.jsx";
import {ExerciseGoalList} from "./page/exercise/goal/ExerciseGoalList.jsx";
import {ExerciseGoalSave} from "./page/exercise/goal/ExerciseGoalSave.jsx";
import {ExerciseList} from "./page/exercise/ExerciseList.jsx";
import {ExerciseSave} from "./page/exercise/ExerciseSave.jsx";

import {FoodDash} from "./page/food/dash/FoodDash.jsx";
import {FoodDiff} from "./page/food/diff/FoodDiffList.jsx";
import {FoodFindList} from "./page/food/find/FoodFindList.jsx";
import {FoodFindSave} from "./page/food/find/FoodFindSave.jsx";
import {FoodGoalList} from "./page/food/goal/FoodGoalList.jsx";
import {FoodGoalSave} from "./page/food/goal/FoodGoalSave.jsx";
import {FoodList} from "./page/food/FoodList.jsx";
import {FoodSave} from "./page/food/FoodSave.jsx";

import {MoneyDash} from "./page/money/dash/MoneyDash.jsx";
import {MoneyDiff} from "./page/money/diff/MoneyDiffList.jsx";
import {MoneyGoalList} from "./page/money/goal/MoneyGoalList.jsx";
import {MoneyGoalSave} from "./page/money/goal/MoneyGoalSave.jsx";
import {MoneyList} from "./page/money/MoneyList.jsx";
import {MoneySave} from "./page/money/MoneySave.jsx";

import {SleepDash} from "./page/sleep/dash/SleepDash.jsx";
import {SleepDiff} from "./page/sleep/diff/SleepDiffList.jsx";
import {SleepGoalList} from "./page/sleep/goal/SleepGoalList.jsx";
import {SleepGoalSave} from "./page/sleep/goal/SleepGoalSave.jsx";
import {SleepList} from "./page/sleep/SleepList.jsx";
import {SleepSave} from "./page/sleep/SleepSave.jsx";

import {UserDataCategory} from "./page/user/data/UserDataCategory.jsx";
import {UserDataDetail} from "./page/user/data/UserDataDetail.jsx";
import {UserDataList} from "./page/user/data/UserDataList.jsx";
import {UserSetting} from "./page/user/UserSetting.jsx";
import {UserDeletes} from "./page/user/UserDeletes.jsx";
import {UserInfo} from "./page/user/UserInfo.jsx";
import {UserSignup} from "./page/user/UserSignup.jsx";
import {UserLogin} from "./page/user/UserLogin.jsx";

// -------------------------------------------------------------------------------------------------
const Calendar = () => (
  <Routes>
    <Route path="/list" element={<CalendarList />} />
    <Route path="/save" element={<CalendarSave />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Exercise = () =>  (
  <Routes>
    <Route path="/dash/list" element={<ExerciseDash />} />
    <Route path="/diff/list" element={<ExerciseDiff />} />
    <Route path="/goal/list" element={<ExerciseGoalList />} />
    <Route path="/goal/save" element={<ExerciseGoalSave />} />
    <Route path="/list" element={<ExerciseList />} />
    <Route path="/save" element={<ExerciseSave />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Food = () => (
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
);
// -------------------------------------------------------------------------------------------------
const Money = () =>  (
  <Routes>
    <Route path="/dash/list" element={<MoneyDash />} />
    <Route path="/diff/list" element={<MoneyDiff />} />
    <Route path="/goal/list" element={<MoneyGoalList />} />
    <Route path="/goal/save" element={<MoneyGoalSave />} />
    <Route path="/list" element={<MoneyList />} />
    <Route path="/save" element={<MoneySave />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const Sleep = () => (
  <Routes>
    <Route path="/dash/list" element={<SleepDash />} />
    <Route path="/diff/list" element={<SleepDiff />} />
    <Route path="/goal/list" element={<SleepGoalList />} />
    <Route path="/goal/save" element={<SleepGoalSave />} />
    <Route path="/list" element={<SleepList />} />
    <Route path="/save" element={<SleepSave />} />
  </Routes>
);
// -------------------------------------------------------------------------------------------------
const User = () => (
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
  const noneAd = (
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
      {!noneAd && <Ad />}
      {!noneBottom && <BottomNav />}
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