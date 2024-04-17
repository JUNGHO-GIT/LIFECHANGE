// App.jsx

import React from "react";
import {Routes, Route} from "react-router-dom";
import {DeveloperModeProvider} from "../assets/hooks/useDeveloperMode";

import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "boxicons/css/boxicons.min.css";
import "react-day-picker/dist/style.css";
import "react-datepicker/dist/react-datepicker.css";
import "react-resizable/css/styles.css";

import "../assets/css/Custom.css";
import "../assets/css/Jstyle.css";
import "../assets/css/DatePicker.css";
import "../assets/css/TimePicker.css";
import "../assets/css/DayPicker.css";
import "../assets/css/Header.css";

import {Loader} from "../layout/Loader.jsx";
import {Header} from "../layout/Header.jsx";
import {Footer} from "../layout/Footer";
import {Dash} from "../page/common/Dash.jsx";

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

import {UserSignup} from "../page/user/UserSignup.jsx";
import {UserLogin} from "../page/user/UserLogin.jsx";
import {UserDataset} from "../page/user/UserDataset.jsx";

import {WorkPlanList} from "../page/work/WorkPlanList.jsx";
import {WorkPlanDetail} from "../page/work/WorkPlanDetail.jsx";
import {WorkPlanSave} from "../page/work/WorkPlanSave.jsx";
import {WorkDash} from "../page/work/dash/WorkDash.jsx";
import {WorkList} from "../page/work/WorkList.jsx";
import {WorkDetail} from "../page/work/WorkDetail.jsx";
import {WorkSave} from "../page/work/WorkSave.jsx";

// ------------------------------------------------------------------------------------------------>
const Common = () => {
  return (
    <Routes>
      <Route path="/" element={<Dash />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Food = () => {
  return (
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
  );
};
// ------------------------------------------------------------------------------------------------>
const Money = () => {
  return (
    <Routes>
      <Route path="/plan/list" element={<MoneyPlanList />} />
      <Route path="/plan/detail" element={<MoneyPlanDetail />} />
      <Route path="/plan/save" element={<MoneyPlanSave />} />
      <Route path="/dash" element={<MoneyDash />} />
      <Route path="/list" element={<MoneyList />} />
      <Route path="/detail" element={<MoneyDetail />} />
      <Route path="/save" element={<MoneySave />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Sleep = () => {
  return (
    <Routes>
      <Route path="/plan/list" element={<SleepPlanList />} />
      <Route path="/plan/detail" element={<SleepPlanDetail />} />
      <Route path="/plan/save" element={<SleepPlanSave />} />
      <Route path="/dash" element={<SleepDash />} />
      <Route path="/list" element={<SleepList />} />
      <Route path="/detail" element={<SleepDetail />} />
      <Route path="/save" element={<SleepSave />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const User = () => {
  return (
    <Routes>
      <Route path="/signup" element={<UserSignup />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/dataset" element={<UserDataset />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Work = () => {
  return (
    <Routes>
      <Route path="/plan/list" element={<WorkPlanList />} />
      <Route path="/plan/detail" element={<WorkPlanDetail />} />
      <Route path="/plan/save" element={<WorkPlanSave />} />
      <Route path="/dash" element={<WorkDash />} />
      <Route path="/list" element={<WorkList />} />
      <Route path="/detail" element={<WorkDetail />} />
      <Route path="/save" element={<WorkSave />} />
    </Routes>
  );
};

// ------------------------------------------------------------------------------------------------>
export const App = () => {
  return (
    <div className={"App"}>
      <DeveloperModeProvider>
        <Loader />
        <Header />
        <Routes>
          <Route path="/*" element={<Common />} />
          <Route path="/food/*" element={<Food />} />
          <Route path="/money/*" element={<Money />} />
          <Route path="/sleep/*" element={<Sleep />} />
          <Route path="/user/*" element={<User />} />
          <Route path="/work/*" element={<Work />} />
        </Routes>
        <Footer />
      </DeveloperModeProvider>
    </div>
  );
};