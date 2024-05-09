// App.jsx

import React from "react";
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import CssBaseline from "@mui/material/CssBaseline";

import "moment/locale/ko";
import "boxicons/css/boxicons.min.css";
import "react-calendar/dist/Calendar.css";
import "./index.css";

import "./assets/css/Mui.css";
import "./assets/css/Calendar.css";

import "./assets/css/Header.css";
import "./assets/css/NavBar.css";
import "./assets/css/SideBar.css";
import "./assets/css/Table.css";
import "./assets/css/ScrollBar.css";

import "./assets/css/Dash.css";
import "./assets/css/Custom.css";
import "./assets/css/Core.css";
import "./assets/css/Jstyle.css";

import {CalendarList} from "./page/calendar/CalendarList";
import {CalendarDetail} from "./page/calendar/CalendarDetail";

import {ExercisePlanList} from "./page/exercise/ExercisePlanList";
import {ExercisePlanDetail} from "./page/exercise/ExercisePlanDetail";
import {ExercisePlanSave} from "./page/exercise/ExercisePlanSave";
import {ExerciseDash} from "./page/exercise/dash/ExerciseDash";
import {ExerciseList} from "./page/exercise/ExerciseList";
import {ExerciseDetail} from "./page/exercise/ExerciseDetail";
import {ExerciseSave} from "./page/exercise/ExerciseSave";

import {FoodPlanList} from "./page/food/FoodPlanList";
import {FoodPlanDetail} from "./page/food/FoodPlanDetail";
import {FoodPlanSave} from "./page/food/FoodPlanSave";
import {FoodDash} from "./page/food/dash/FoodDash";
import {FoodSearch} from "./page/food/FoodSearch";
import {FoodList} from "./page/food/FoodList";
import {FoodDetail} from "./page/food/FoodDetail";
import {FoodSave} from "./page/food/FoodSave";

import {MoneyPlanList} from "./page/money/MoneyPlanList";
import {MoneyPlanDetail} from "./page/money/MoneyPlanDetail";
import {MoneyPlanSave} from "./page/money/MoneyPlanSave";
import {MoneyDash} from "./page/money/dash/MoneyDash";
import {MoneyList} from "./page/money/MoneyList";
import {MoneyDetail} from "./page/money/MoneyDetail";
import {MoneySave} from "./page/money/MoneySave";

import {SleepPlanList} from "./page/sleep/SleepPlanList";
import {SleepPlanDetail} from "./page/sleep/SleepPlanDetail";
import {SleepPlanSave} from "./page/sleep/SleepPlanSave";
import {SleepDash} from "./page/sleep/dash/SleepDash";
import {SleepList} from "./page/sleep/SleepList";
import {SleepDetail} from "./page/sleep/SleepDetail";
import {SleepSave} from "./page/sleep/SleepSave";

import {UserSignup} from "./page/user/UserSignup";
import {UserLogin} from "./page/user/UserLogin";

import {TweakDataset} from "./page/tweak/TweakDataset";
import {TweakDemo} from "./page/tweak/TweakDemo";

// ------------------------------------------------------------------------------------------------>
const Calendar = () => (
  <React.Fragment>
    <Routes>
      <Route path="/list" element={<CalendarList />} />
      <Route path="/detail" element={<CalendarDetail />} />
    </Routes>
  </React.Fragment>
);

// ------------------------------------------------------------------------------------------------>
const Exercise = () =>  (
  <React.Fragment>
    <Routes>
      <Route path="/plan/list" element={<ExercisePlanList />} />
      <Route path="/plan/detail" element={<ExercisePlanDetail />} />
      <Route path="/plan/save" element={<ExercisePlanSave />} />
      <Route path="/dash" element={<ExerciseDash />} />
      <Route path="/list" element={<ExerciseList />} />
      <Route path="/detail" element={<ExerciseDetail />} />
      <Route path="/save" element={<ExerciseSave />} />
    </Routes>
  </React.Fragment>
);

// ------------------------------------------------------------------------------------------------>
const Food = () => (
  <React.Fragment>
    <Routes>
      <Route path="/plan/list" element={<FoodPlanList />} />
      <Route path="/plan/detail" element={<FoodPlanDetail />} />
      <Route path="/plan/save" element={<FoodPlanSave />} />
      <Route path="/dash" element={<FoodDash />} />
      <Route path="/search" element={<FoodSearch />} />
      <Route path="/list" element={<FoodList />} />
      <Route path="/detail" element={<FoodDetail />} />
      <Route path="/save" element={<FoodSave />} />
    </Routes>
  </React.Fragment>
);

// ------------------------------------------------------------------------------------------------>
const Money = () =>  (
  <React.Fragment>
    <Routes>
      <Route path="/plan/list" element={<MoneyPlanList />} />
      <Route path="/plan/detail" element={<MoneyPlanDetail />} />
      <Route path="/plan/save" element={<MoneyPlanSave />} />
      <Route path="/dash" element={<MoneyDash />} />
      <Route path="/list" element={<MoneyList />} />
      <Route path="/detail" element={<MoneyDetail />} />
      <Route path="/save" element={<MoneySave />} />
    </Routes>
  </React.Fragment>
);

// ------------------------------------------------------------------------------------------------>
const Sleep = () => (
  <React.Fragment>
    <Routes>
      <Route path="/plan/list" element={<SleepPlanList />} />
      <Route path="/plan/detail" element={<SleepPlanDetail />} />
      <Route path="/plan/save" element={<SleepPlanSave />} />
      <Route path="/dash" element={<SleepDash />} />
      <Route path="/list" element={<SleepList />} />
      <Route path="/detail" element={<SleepDetail />} />
      <Route path="/save" element={<SleepSave />} />
    </Routes>
  </React.Fragment>
);

// ------------------------------------------------------------------------------------------------>
const User = () => (
  <React.Fragment>
    <Routes>
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/login" element={<UserLogin />} />
    </Routes>
  </React.Fragment>
);

// ------------------------------------------------------------------------------------------------>
const Tweak = () => (
  <React.Fragment>
    <Routes>
      <Route path="/dataset" element={<TweakDataset />} />
      <Route path="/demo" element={<TweakDemo />} />
    </Routes>
  </React.Fragment>
);

// ------------------------------------------------------------------------------------------------>
const App = () => {
  return (
    <React.Fragment>
      <div className={"App"}>
        <Routes>
          <Route path="/" element={<CalendarList />} />
          <Route path="/calendar/*" element={<Calendar />} />
          <Route path="/exercise/*" element={<Exercise />} />
          <Route path="/food/*" element={<Food />} />
          <Route path="/money/*" element={<Money />} />
          <Route path="/sleep/*" element={<Sleep />} />
          <Route path="/tweak/*" element={<Tweak />} />
          <Route path="/user/*" element={<User />} />
        </Routes>
      </div>
    </React.Fragment>
  );
};

// ------------------------------------------------------------------------------------------------>
const rootElement = document.getElementById('root');
if (rootElement === null) {
  throw new Error("Root element not found");
}
const root = ReactDOM.createRoot(rootElement);
root.render(
  <BrowserRouter>
    <CssBaseline />
    <App />
  </BrowserRouter>
);