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

import {FoodDash} from "../page/food/dash/FoodDash.jsx";
import {FoodCompare} from "../page/food/main/FoodCompare.jsx";
import {FoodSearch} from "../page/food/main/FoodSearch.jsx";
import {FoodList} from "../page/food/main/FoodList.jsx";
import {FoodPlanList} from "../page/food/plan/FoodPlanList.jsx";
import {FoodDetail} from "../page/food/main/FoodDetail.jsx";
import {FoodPlanDetail} from "../page/food/plan/FoodPlanDetail.jsx";
import {FoodSave} from "../page/food/main/FoodSave.jsx";
import {FoodPlanSave} from "../page/food/plan/FoodPlanSave.jsx";

import {MoneyDash} from "../page/money/dash/MoneyDash.jsx";
import {MoneyCompare} from "../page/money/main/MoneyCompare.jsx";
import {MoneyList} from "../page/money/main/MoneyList.jsx";
import {MoneyPlanList} from "../page/money/plan/MoneyPlanList.jsx";
import {MoneyDetail} from "../page/money/main/MoneyDetail.jsx";
import {MoneyPlanDetail} from "../page/money/plan/MoneyPlanDetail.jsx";
import {MoneySave} from "../page/money/main/MoneySave.jsx";
import {MoneyPlanSave} from "../page/money/plan/MoneyPlanSave.jsx";

import {SleepDash} from "../page/sleep/dash/SleepDash.jsx";
import {SleepCompare} from "../page/sleep/main/SleepCompare.jsx";
import {SleepList} from "../page/sleep/main/SleepList.jsx";
import {SleepPlanList} from "../page/sleep/plan/SleepPlanList.jsx";
import {SleepDetail} from "../page/sleep/main/SleepDetail.jsx";
import {SleepPlanDetail} from "../page/sleep/plan/SleepPlanDetail.jsx";
import {SleepSave} from "../page/sleep/main/SleepSave.jsx";
import {SleepPlanSave} from "../page/sleep/plan/SleepPlanSave.jsx";

import {UserLogin} from "../page/user/main/UserLogin.jsx";
import {UserSave} from "../page/user/main/UserSave.jsx";
import {UserDetail} from "../page/user/main/UserDetail.jsx";
import {UserDelete} from "../page/user/main/UserDelete.jsx";
import {UserList} from "../page/user/main/UserList";

import {WorkDash} from "../page/work/dash/WorkDash.jsx";
import {WorkCompare} from "../page/work/main/WorkCompare.jsx";
import {WorkList} from "../page/work/main/WorkList.jsx";
import {WorkPlanList} from "../page/work/plan/WorkPlanList.jsx";
import {WorkDetail} from "../page/work/main/WorkDetail.jsx";
import {WorkPlanDetail} from "../page/work/plan/WorkPlanDetail.jsx";
import {WorkSave} from "../page/work/main/WorkSave.jsx";
import {WorkPlanSave} from "../page/work/plan/WorkPlanSave.jsx";

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
      <Route path="/dash" element={<FoodDash />} />
      <Route path="/compare" element={<FoodCompare />} />
      <Route path="/search" element={<FoodSearch />} />
      <Route path="/list" element={<FoodList />} />
      <Route path="/plan/list" element={<FoodPlanList />} />
      <Route path="/detail" element={<FoodDetail />} />
      <Route path="/plan/detail" element={<FoodPlanDetail />} />
      <Route path="/save" element={<FoodSave />} />
      <Route path="/plan/save" element={<FoodPlanSave />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Money = () => {
  return (
    <Routes>
      <Route path="/dash" element={<MoneyDash />} />
      <Route path="/compare" element={<MoneyCompare />} />
      <Route path="/list" element={<MoneyList />} />
      <Route path="/plan/list" element={<MoneyPlanList />} />
      <Route path="/detail" element={<MoneyDetail />} />
      <Route path="/plan/detail" element={<MoneyPlanDetail />} />
      <Route path="/save" element={<MoneySave />} />
      <Route path="/plan/save" element={<MoneyPlanSave />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Sleep = () => {
  return (
    <Routes>
      <Route path="/dash" element={<SleepDash />} />
      <Route path="/compare" element={<SleepCompare />} />
      <Route path="/list" element={<SleepList />} />
      <Route path="/plan/list" element={<SleepPlanList />} />
      <Route path="/detail" element={<SleepDetail />} />
      <Route path="/plan/detail" element={<SleepPlanDetail />} />
      <Route path="/save" element={<SleepSave />} />
      <Route path="/plan/save" element={<SleepPlanSave />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const User = () => {
  return (
    <Routes>
      <Route path="/list" element={<UserList />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/save" element={<UserSave />} />
      <Route path="/detail" element={<UserDetail />} />
      <Route path="/delete" element={<UserDelete />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Work = () => {
  return (
    <Routes>
      <Route path="/dash" element={<WorkDash />} />
      <Route path="/compare" element={<WorkCompare />} />
      <Route path="/list" element={<WorkList />} />
      <Route path="/plan/list" element={<WorkPlanList />} />
      <Route path="/detail" element={<WorkDetail />} />
      <Route path="/plan/detail" element={<WorkPlanDetail />} />
      <Route path="/save" element={<WorkSave />} />
      <Route path="/plan/save" element={<WorkPlanSave />} />
    </Routes>
  );
};

// ------------------------------------------------------------------------------------------------>
export const App = () => {
  return (
    <div className="App">
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