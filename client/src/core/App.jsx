// App.jsx

import React from "react";
import {Routes, Route} from "react-router-dom";
import {DeveloperModeProvider} from "../assets/hooks/useDeveloperMode.jsx";
import CssBaseline from "@mui/material/CssBaseline";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "boxicons/css/boxicons.min.css";
import "react-day-picker/dist/style.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-resizable/css/styles.css";
import "react-calendar/dist/Calendar.css";

import "../assets/css/fragments/DatePicker.css";
import "../assets/css/fragments/TimePicker.css";
import "../assets/css/fragments/DayPicker.css";
import "../assets/css/fragments/Calendar.css";

import "../assets/css/custom/Mui.css";
import "../assets/css/custom/Chart.css";
import "../assets/css/custom/Custom.css";
import "../assets/css/custom/Jstyle.css";

import "../assets/css/layout/Header.css";
import "../assets/css/layout/Loader.css";
import "../assets/css/layout/NavBar.css";
import "../assets/css/layout/SideBar.css";

import {Loader} from "../layout/Loader.jsx";
import {Header} from "../layout/Header.jsx";
import {NavBar} from "../layout/NavBar.jsx";

import {CustomerSignup} from "../page/customer/CustomerSignup.jsx";
import {CustomerLogin} from "../page/customer/CustomerLogin.jsx";
import {CustomerDataset} from "../page/customer/CustomerDataset.jsx";
import {CustomerTest} from "../page/customer/CustomerTest.jsx";

import {DiaryList} from "../page/diary/DiaryList.jsx";
import {DiaryDetail} from "../page/diary/DiaryDetail.jsx";

import {ExercisePlanList} from "../page/exercise/ExercisePlanList.jsx";
import {ExercisePlanDetail} from "../page/exercise/ExercisePlanDetail.jsx";
import {ExercisePlanSave} from "../page/exercise/ExercisePlanSave.jsx";
import {ExerciseDash} from "../page/exercise/dash/ExerciseDash.jsx";
import {ExerciseList} from "../page/exercise/ExerciseList.jsx";
import {ExerciseDetail} from "../page/exercise/ExerciseDetail.jsx";
import {ExerciseSave} from "../page/exercise/ExerciseSave.jsx";

import {FoodPlanList} from "../page/food/FoodPlanList.jsx";
import {FoodPlanDetail} from "../page/food/FoodPlanDetail.jsx";
import {FoodPlanSave} from "../page/food/FoodPlanSave.jsx";
import {FoodDash} from "../page/food/dash/FoodDash.jsx";
import {FoodSearch} from "../page/food/FoodSearch.jsx";
import {FoodList} from "../page/food/FoodList.jsx";
import {FoodDetail} from "../page/food/FoodDetail.jsx";
import {FoodSave} from "../page/food/FoodSave.jsx";

import {MoneyPlanList} from "../page/money/MoneyPlanList.jsx";
import {MoneyPlanDetail} from "../page/money/MoneyPlanDetail.jsx";
import {MoneyPlanSave} from "../page/money/MoneyPlanSave.jsx";
import {MoneyDash} from "../page/money/dash/MoneyDash.jsx";
import {MoneyList} from "../page/money/MoneyList.jsx";
import {MoneyDetail} from "../page/money/MoneyDetail.jsx";
import {MoneySave} from "../page/money/MoneySave.jsx";

import {SleepPlanList} from "../page/sleep/SleepPlanList.jsx";
import {SleepPlanDetail} from "../page/sleep/SleepPlanDetail.jsx";
import {SleepPlanSave} from "../page/sleep/SleepPlanSave.jsx";
import {SleepDash} from "../page/sleep/dash/SleepDash.jsx";
import {SleepList} from "../page/sleep/SleepList.jsx";
import {SleepDetail} from "../page/sleep/SleepDetail.jsx";
import {SleepSave} from "../page/sleep/SleepSave.jsx";

// ------------------------------------------------------------------------------------------------>
const Customer = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/signup" element={<CustomerSignup />} />
        <Route path="/login" element={<CustomerLogin />} />
        <Route path="/dataset" element={<CustomerDataset />} />
        <Route path="/test" element={<CustomerTest />} />
      </Routes>
    </React.Fragment>
  );
};

// ------------------------------------------------------------------------------------------------>
const Diary = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/list" element={<DiaryList />} />
        <Route path="/detail" element={<DiaryDetail />} />
      </Routes>
    </React.Fragment>
  );
};

// ------------------------------------------------------------------------------------------------>
const Exercise = () => {
  return (
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
};

// ------------------------------------------------------------------------------------------------>
const Food = () => {
  return (
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
};

// ------------------------------------------------------------------------------------------------>
const Money = () => {
  return (
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
};

// ------------------------------------------------------------------------------------------------>
const Sleep = () => {
  return (
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
};

// ------------------------------------------------------------------------------------------------>
export const App = () => {
  return (
    <React.Fragment>
      <div className={"App"}>
        <DeveloperModeProvider>
          <CssBaseline />
          <Loader />
          <Header />
          <NavBar />
          <Routes>
            <Route path="/customer/*" element={<Customer />} />
            <Route path="/diary/*" element={<Diary />} />
            <Route path="/exercise/*" element={<Exercise />} />
            <Route path="/food/*" element={<Food />} />
            <Route path="/money/*" element={<Money />} />
            <Route path="/sleep/*" element={<Sleep />} />
          </Routes>
        </DeveloperModeProvider>
      </div>
    </React.Fragment>
  );
};