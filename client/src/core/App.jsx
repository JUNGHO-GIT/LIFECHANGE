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
import {Dash} from "../page/main/Dash";

import {FoodDash} from "../page/food/dash/FoodDash.jsx";
import {FoodCompare} from "../page/food/FoodCompare.jsx";
import {FoodSearch} from "../page/food/FoodSearch.jsx";
import {FoodListReal} from "../page/food/FoodList.jsx";
import {FoodDetailReal} from "../page/food/FoodDetail.jsx";
import {FoodSaveReal} from "../page/food/FoodSave.jsx";

import {MoneyDash} from "../page/money/dash/MoneyDash.jsx";
import {MoneyCompare} from "../page/money/MoneyCompare.jsx";
import {MoneyListReal} from "../page/money/MoneyList.jsx";
import {MoneyDetailReal} from "../page/money/MoneyDetail.jsx";
import {MoneySaveReal} from "../page/money/MoneySave.jsx";

import {PlanListFood} from "../page/plan/PlanListFood.jsx";
import {PlanSaveFood} from "../page/plan/PlanSaveFood.jsx";
import {PlanListMoney} from "../page/plan/PlanListMoney.jsx";
import {PlanSaveMoney} from "../page/plan/PlanSaveMoney.jsx";
import {PlanListSleep} from "../page/plan/PlanListSleep.jsx";
import {PlanSaveSleep} from "../page/plan/PlanSaveSleep.jsx";
import {PlanListWork} from "../page/plan/PlanListWork.jsx";
import {PlanSaveWork} from "../page/plan/PlanSaveWork.jsx";

import {SleepDash} from "../page/sleep/dash/SleepDash.jsx";
import {SleepCompare} from "../page/sleep/SleepCompare.jsx";
import {SleepListReal} from "../page/sleep/SleepList.jsx";
import {SleepDetailReal} from "../page/sleep/SleepDetail.jsx";
import {SleepSaveReal} from "../page/sleep/SleepSave.jsx";

import {UserLogin} from "../page/user/UserLogin.jsx";
import {UserSave} from "../page/user/UserSave.jsx";
import {UserDetail} from "../page/user/UserDetail.jsx";
import {UserDelete} from "../page/user/UserDelete.jsx";
import {UserList} from "../page/user/UserList";

import {WorkDash} from "../page/work/dash/WorkDash.jsx";
import {WorkCompare} from "../page/work/WorkCompare.jsx";
import {WorkListReal} from "../page/work/WorkList.jsx";
import {WorkDetailReal} from "../page/work/WorkDetail.jsx";
import {WorkSaveReal} from "../page/work/WorkSave.jsx";

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
      <Route path="/list" element={<FoodListReal />} />
      <Route path="/detail" element={<FoodDetailReal />} />
      <Route path="/save" element={<FoodSaveReal />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Money = () => {
  return (
    <Routes>
      <Route path="/dash" element={<MoneyDash />} />
      <Route path="/compare" element={<MoneyCompare />} />
      <Route path="/list" element={<MoneyListReal />} />
      <Route path="/detail" element={<MoneyDetailReal />} />
      <Route path="/save" element={<MoneySaveReal />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Plan = () => {
  return (
    <Routes>
      <Route path="/list/food" element={<PlanListFood />} />
      <Route path="/save/food" element={<PlanSaveFood />} />
      <Route path="/list/money" element={<PlanListMoney />} />
      <Route path="/save/money" element={<PlanSaveMoney />} />
      <Route path="/list/sleep" element={<PlanListSleep />} />
      <Route path="/save/sleep" element={<PlanSaveSleep />} />
      <Route path="/list/work" element={<PlanListWork />} />
      <Route path="/save/work" element={<PlanSaveWork />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Sleep = () => {
  return (
    <Routes>
      <Route path="/dash" element={<SleepDash />} />
      <Route path="/compare" element={<SleepCompare />} />
      <Route path="/list" element={<SleepListReal />} />
      <Route path="/detail" element={<SleepDetailReal />} />
      <Route path="/save" element={<SleepSaveReal />} />
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
      <Route path="/list" element={<WorkListReal />} />
      <Route path="/detail" element={<WorkDetailReal />} />
      <Route path="/save" element={<WorkSaveReal />} />
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
            <Route path="/plan/*" element={<Plan />} />
            <Route path="/sleep/*" element={<Sleep />} />
            <Route path="/user/*" element={<User />} />
            <Route path="/work/*" element={<Work />} />
          </Routes>
        <Footer />
      </DeveloperModeProvider>
    </div>
  );
};