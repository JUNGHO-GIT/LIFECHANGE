// App.jsx

import React from "react";
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import "moment/locale/ko";
import "react-calendar/dist/Calendar.css";
import "./index.css";

import "./assets/css/Calendar.css";
import "./assets/css/Header.css";
import "./assets/css/NavBar.css";
import "./assets/css/SideBar.css";
import "./assets/css/Table.css";
import "./assets/css/ScrollBar.css";
import "./assets/css/Btn.css";
import "./assets/css/DataSet.css";
import "./assets/css/Dash.css";
import "./assets/css/Mui.css";
import "./assets/css/Custom.css";
import "./assets/css/Core.css";
import "./assets/css/Jstyle.css";

import {CalendarList} from "./page/calendar/CalendarList";
import {CalendarDetail} from "./page/calendar/CalendarDetail";

import {ExerciseDash} from "./page/exercise/dash/ExerciseDash";
import {ExerciseDiff} from "./page/exercise/ExerciseDiff";
import {ExerciseList} from "./page/exercise/ExerciseList";
import {ExerciseDetail} from "./page/exercise/ExerciseDetail";
import {ExerciseSave} from "./page/exercise/ExerciseSave";
import {ExercisePlanList} from "./page/exercise/ExercisePlanList";
import {ExercisePlanDetail} from "./page/exercise/ExercisePlanDetail";
import {ExercisePlanSave} from "./page/exercise/ExercisePlanSave";

import {FoodDash} from "./page/food/dash/FoodDash";
import {FoodDiff} from "./page/food/FoodDiff";
import {FoodSearch} from "./page/food/FoodSearch";
import {FoodList} from "./page/food/FoodList";
import {FoodDetail} from "./page/food/FoodDetail";
import {FoodSave} from "./page/food/FoodSave";
import {FoodPlanList} from "./page/food/FoodPlanList";
import {FoodPlanDetail} from "./page/food/FoodPlanDetail";
import {FoodPlanSave} from "./page/food/FoodPlanSave";

import {MoneyDash} from "./page/money/dash/MoneyDash";
import {MoneyDiff} from "./page/money/MoneyDiff";
import {MoneyList} from "./page/money/MoneyList";
import {MoneyDetail} from "./page/money/MoneyDetail";
import {MoneySave} from "./page/money/MoneySave";
import {MoneyPlanList} from "./page/money/MoneyPlanList";
import {MoneyPlanDetail} from "./page/money/MoneyPlanDetail";
import {MoneyPlanSave} from "./page/money/MoneyPlanSave";

import {SleepDash} from "./page/sleep/dash/SleepDash";
import {SleepDiff} from "./page/sleep/SleepDiff";
import {SleepList} from "./page/sleep/SleepList";
import {SleepDetail} from "./page/sleep/SleepDetail";
import {SleepSave} from "./page/sleep/SleepSave";
import {SleepPlanList} from "./page/sleep/SleepPlanList";
import {SleepPlanDetail} from "./page/sleep/SleepPlanDetail";
import {SleepPlanSave} from "./page/sleep/SleepPlanSave";

import {UserSignup} from "./page/user/UserSignup";
import {UserLogin} from "./page/user/UserLogin";
import {UserDataset} from "./page/user/UserDataset";
import {UserList} from "./page/user/UserList";

// ------------------------------------------------------------------------------------------------>
const Calendar = () => (
  <Routes>
    <Route path="/list" element={<CalendarList />} />
    <Route path="/detail" element={<CalendarDetail />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Exercise = () =>  (
  <Routes>
    <Route path="/dash" element={<ExerciseDash />} />
    <Route path="/diff" element={<ExerciseDiff />} />
    <Route path="/list" element={<ExerciseList />} />
    <Route path="/detail" element={<ExerciseDetail />} />
    <Route path="/save" element={<ExerciseSave />} />
    <Route path="/list/plan" element={<ExercisePlanList />} />
    <Route path="/detail/plan" element={<ExercisePlanDetail />} />
    <Route path="/save/plan" element={<ExercisePlanSave />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Food = () => (
  <Routes>
    <Route path="/dash" element={<FoodDash />} />
    <Route path="/search" element={<FoodSearch />} />
    <Route path="/diff" element={<FoodDiff />} />
    <Route path="/list" element={<FoodList />} />
    <Route path="/detail" element={<FoodDetail />} />
    <Route path="/save" element={<FoodSave />} />
    <Route path="/list/plan" element={<FoodPlanList />} />
    <Route path="/detail/plan" element={<FoodPlanDetail />} />
    <Route path="/save/plan" element={<FoodPlanSave />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Money = () =>  (
  <Routes>
    <Route path="/dash" element={<MoneyDash />} />
    <Route path="/diff" element={<MoneyDiff />} />
    <Route path="/list" element={<MoneyList />} />
    <Route path="/detail" element={<MoneyDetail />} />
    <Route path="/save" element={<MoneySave />} />
    <Route path="/list/plan" element={<MoneyPlanList />} />
    <Route path="/detail/plan" element={<MoneyPlanDetail />} />
    <Route path="/save/plan" element={<MoneyPlanSave />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Sleep = () => (
  <Routes>
    <Route path="/dash" element={<SleepDash />} />
    <Route path="/diff" element={<SleepDiff />} />
    <Route path="/list" element={<SleepList />} />
    <Route path="/detail" element={<SleepDetail />} />
    <Route path="/save" element={<SleepSave />} />
    <Route path="/list/plan" element={<SleepPlanList />} />
    <Route path="/detail/plan" element={<SleepPlanDetail />} />
    <Route path="/save/plan" element={<SleepPlanSave />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const User = () => (
  <Routes>
    <Route path="/signup" element={<UserSignup />} />
    <Route path="/login" element={<UserLogin />} />
    <Route path="/dataset" element={<UserDataset />} />
    <Route path="/list" element={<UserList />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const App = () => {
  return (
    <div className={"App"}>
      <Routes>
        <Route path="/" element={<CalendarList />} />
        <Route path="/calendar/*" element={<Calendar />} />
        <Route path="/exercise/*" element={<Exercise />} />
        <Route path="/food/*" element={<Food />} />
        <Route path="/money/*" element={<Money />} />
        <Route path="/sleep/*" element={<Sleep />} />
        <Route path="/user/*" element={<User />} />
      </Routes>
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
    <CssBaseline />
    <App />
  </BrowserRouter>
);