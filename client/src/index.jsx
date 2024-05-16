// App.jsx

import React from "react";
import ReactDOM from 'react-dom/client';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import {useScrollTop} from "./assets/hooks/useScrollTop";
import CssBaseline from "@mui/material/CssBaseline";

import "./index.css";
import "moment/locale/ko";
import "react-calendar/dist/Calendar.css";
import "./assets/css/Loading.css";
import "./assets/css/Calendar.css";
import "./assets/css/SideBar.css";
import "./assets/css/Table.css";
import "./assets/css/ScrollBar.css";
import "./assets/css/Btn.css";
import "./assets/css/DataSet.css";
import "./assets/css/Dash.css";
import "./assets/css/Mui.css";
import "./assets/css/Core.css";
import "./assets/css/Jstyle.css";

import {Header} from "./import/ImportLayouts.jsx";
import {NavBar} from "./import/ImportLayouts.jsx";
import {TabBar} from "./import/ImportLayouts.jsx";
import {Navigation} from "./import/ImportLayouts.jsx";

import {CalendarList} from "./page/calendar/CalendarList";
import {CalendarDetail} from "./page/calendar/CalendarDetail";

import {ExerciseDash} from "./page/exercise/dash/ExerciseDash";
import {ExerciseDiff} from "./page/exercise/diff/ExerciseDiff";
import {ExerciseList} from "./page/exercise/ExerciseList";
import {ExerciseListPlan} from "./page/exercise/ExerciseListPlan";
import {ExerciseDetail} from "./page/exercise/ExerciseDetail";
import {ExerciseDetailPlan} from "./page/exercise/ExerciseDetailPlan";
import {ExerciseSave} from "./page/exercise/ExerciseSave";
import {ExerciseSavePlan} from "./page/exercise/ExerciseSavePlan";

import {FoodDash} from "./page/food/dash/FoodDash";
import {FoodDiff} from "./page/food/diff/FoodDiff";
import {FoodFindList} from "./page/food/find/FoodFindList";
import {FoodFindSave} from "./page/food/find/FoodFindSave";
import {FoodList} from "./page/food/FoodList";
import {FoodListPlan} from "./page/food/FoodListPlan";
import {FoodDetail} from "./page/food/FoodDetail";
import {FoodDetailPlan} from "./page/food/FoodDetailPlan";
import {FoodSave} from "./page/food/FoodSave";
import {FoodSavePlan} from "./page/food/FoodSavePlan";

import {MoneyDash} from "./page/money/dash/MoneyDash";
import {MoneyDiff} from "./page/money/diff/MoneyDiff";
import {MoneyList} from "./page/money/MoneyList";
import {MoneyListPlan} from "./page/money/MoneyListPlan";
import {MoneyDetail} from "./page/money/MoneyDetail";
import {MoneyDetailPlan} from "./page/money/MoneyDetailPlan";
import {MoneySave} from "./page/money/MoneySave";
import {MoneySavePlan} from "./page/money/MoneySavePlan";

import {SleepDash} from "./page/sleep/dash/SleepDash";
import {SleepDiff} from "./page/sleep/diff/SleepDiff";
import {SleepList} from "./page/sleep/SleepList";
import {SleepListPlan} from "./page/sleep/SleepListPlan";
import {SleepDetail} from "./page/sleep/SleepDetail";
import {SleepDetailPlan} from "./page/sleep/SleepDetailPlan";
import {SleepSave} from "./page/sleep/SleepSave";
import {SleepSavePlan} from "./page/sleep/SleepSavePlan";

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
    <Route path="/list/plan" element={<ExerciseListPlan />} />
    <Route path="/detail" element={<ExerciseDetail />} />
    <Route path="/detail/plan" element={<ExerciseDetailPlan />} />
    <Route path="/save" element={<ExerciseSave />} />
    <Route path="/save/plan" element={<ExerciseSavePlan />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Food = () => (
  <Routes>
    <Route path="/dash" element={<FoodDash />} />
    <Route path="/diff" element={<FoodDiff />} />
    <Route path="/find/list" element={<FoodFindList />} />
    <Route path="/find/save" element={<FoodFindSave />} />
    <Route path="/list" element={<FoodList />} />
    <Route path="/list/plan" element={<FoodListPlan />} />
    <Route path="/detail" element={<FoodDetail />} />
    <Route path="/detail/plan" element={<FoodDetailPlan />} />
    <Route path="/save" element={<FoodSave />} />
    <Route path="/save/plan" element={<FoodSavePlan />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Money = () =>  (
  <Routes>
    <Route path="/dash" element={<MoneyDash />} />
    <Route path="/diff" element={<MoneyDiff />} />
    <Route path="/list" element={<MoneyList />} />
    <Route path="/list/plan" element={<MoneyListPlan />} />
    <Route path="/detail" element={<MoneyDetail />} />
    <Route path="/detail/plan" element={<MoneyDetailPlan />} />
    <Route path="/save" element={<MoneySave />} />
    <Route path="/save/plan" element={<MoneySavePlan />} />
  </Routes>
);
// ------------------------------------------------------------------------------------------------>
const Sleep = () => (
  <Routes>
    <Route path="/dash" element={<SleepDash />} />
    <Route path="/diff" element={<SleepDiff />} />
    <Route path="/list" element={<SleepList />} />
    <Route path="/list/plan" element={<SleepListPlan />} />
    <Route path="/detail" element={<SleepDetail />} />
    <Route path="/detail/plan" element={<SleepDetailPlan />} />
    <Route path="/save" element={<SleepSave />} />
    <Route path="/save/plan" element={<SleepSavePlan />} />
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
  useScrollTop();
  return (
    <div className={"App"}>
      <Header />
      <NavBar />
      <TabBar />
      <Routes>
        <Route path="/" element={<CalendarList />} />
        <Route path="/calendar/*" element={<Calendar />} />
        <Route path="/exercise/*" element={<Exercise />} />
        <Route path="/food/*" element={<Food />} />
        <Route path="/money/*" element={<Money />} />
        <Route path="/sleep/*" element={<Sleep />} />
        <Route path="/user/*" element={<User />} />
      </Routes>
      <Navigation />
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