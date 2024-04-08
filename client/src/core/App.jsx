// App.jsx

import React from "react";
import {Routes, Route} from "react-router-dom";
import {DeveloperModeProvider} from "../assets/js/useDeveloperMode";

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

import {Loader} from "../components/Loader.jsx";
import {Header} from "../layout/Header.jsx";
import {Footer} from "../layout/Footer";

import {Dash} from "../page/main/Dash";

import {UserLogin} from "../page/user/UserLogin.jsx";
import {UserSave} from "../page/user/UserSave.jsx";
import {UserDetail} from "../page/user/UserDetail.jsx";
import {UserDelete} from "../page/user/UserDelete.jsx";
import {UserList} from "../page/user/UserList";

import {FoodList} from "../page/food/FoodList.jsx";
import {FoodCompare} from "../page/food/FoodCompare.jsx";
import {FoodDetail} from "../page/food/FoodDetail.jsx";
import {FoodSearch} from "../page/food/FoodSearch.jsx";
import {FoodSavePlan} from "../page/food/FoodSavePlan.jsx";
import {FoodSaveReal} from "../page/food/FoodSaveReal.jsx";

import {WorkDash} from "../page/work/WorkDash.jsx";
import {WorkCompare} from "../page/work/WorkCompare.jsx";
import {WorkListPlan} from "../page/work/WorkListPlan.jsx";
import {WorkListReal} from "../page/work/WorkListReal.jsx";
import {WorkDetailPlan} from "../page/work/WorkDetailPlan.jsx";
import {WorkDetailReal} from "../page/work/WorkDetailReal.jsx";
import {WorkSavePlan} from "../page/work/WorkSavePlan.jsx";
import {WorkSaveReal} from "../page/work/WorkSaveReal.jsx";

import {SleepDash} from "../page/sleep/SleepDash.jsx";
import {SleepCompare} from "../page/sleep/SleepCompare.jsx";
import {SleepListPlan} from "../page/sleep/SleepListPlan.jsx";
import {SleepListReal} from "../page/sleep/SleepListReal.jsx";
import {SleepDetailReal} from "../page/sleep/SleepDetailReal.jsx";
import {SleepDetailPlan} from "../page/sleep/SleepDetailPlan.jsx";
import {SleepSavePlan} from "../page/sleep/SleepSavePlan.jsx";
import {SleepSaveReal} from "../page/sleep/SleepSaveReal.jsx";

import {MoneyList} from "../page/money/MoneyList.jsx";
import {MoneyDetail} from "../page/money/MoneyDetail.jsx";
import {MoneySavePlan} from "../page/money/MoneySavePlan.jsx";
import {MoneySaveReal} from "../page/money/MoneySaveReal.jsx";

// ------------------------------------------------------------------------------------------------>
const Common = () => {
  return (
    <Routes>
      <Route path="/" element={<Dash />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const User = () => {
  return (
    <Routes>
      <Route path="/list" element={<UserList />} />
      <Route path="/login" element={<UserLogin />} />
      <Route path="/save/real" element={<UserSave />} />
      <Route path="/detail" element={<UserDetail />} />
      <Route path="/delete" element={<UserDelete />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Food = () => {
  return (
    <Routes>
      <Route path="/list" element={<FoodList />} />
      <Route path="/compare" element={<FoodCompare />} />
      <Route path="/detail" element={<FoodDetail />} />
      <Route path="/search" element={<FoodSearch />} />
      <Route path="/save/plan" element={<FoodSavePlan />} />
      <Route path="/save/real" element={<FoodSaveReal />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Work = () => {
  return (
    <Routes>
      <Route path="/dash" element={<WorkDash />} />
      <Route path="/compare" element={<WorkCompare />} />
      <Route path="/list/plan" element={<WorkListPlan />} />
      <Route path="/list/real" element={<WorkListReal />} />
      <Route path="/detail/plan" element={<WorkDetailPlan />} />
      <Route path="/detail/real" element={<WorkDetailReal />} />
      <Route path="/save/plan" element={<WorkSavePlan />} />
      <Route path="/save/real" element={<WorkSaveReal />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Money = () => {
  return (
    <Routes>
      <Route path="/list" element={<MoneyList />} />
      <Route path="/detail" element={<MoneyDetail />} />
      <Route path="/save/plan" element={<MoneySavePlan />} />
      <Route path="/save/real" element={<MoneySaveReal />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Sleep = () => {
  return (
    <Routes>
      <Route path="/dash" element={<SleepDash />} />
      <Route path="/compare" element={<SleepCompare />} />
      <Route path="/list/plan" element={<SleepListPlan />} />
      <Route path="/list/real" element={<SleepListReal />} />
      <Route path="/detail/plan" element={<SleepDetailPlan />} />
      <Route path="/detail/real" element={<SleepDetailReal />} />
      <Route path="/save/plan" element={<SleepSavePlan />} />
      <Route path="/save/real" element={<SleepSaveReal />} />
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
            <Route path="/user/*" element={<User />} />
            <Route path="/food/*" element={<Food />} />
            <Route path="/work/*" element={<Work />} />
            <Route path="/sleep/*" element={<Sleep />} />
            <Route path="/money/*" element={<Money />} />
          </Routes>
        <Footer />
      </DeveloperModeProvider>
    </div>
  );
};