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
import {FoodListPlan} from "../page/food/plan/FoodListPlan.jsx";
import {FoodDetail} from "../page/food/main/FoodDetail.jsx";
import {FoodDetailPlan} from "../page/food/plan/FoodDetailPlan.jsx";
import {FoodSave} from "../page/food/main/FoodSave.jsx";
import {FoodSavePlan} from "../page/food/plan/FoodSavePlan.jsx";

import {MoneyDash} from "../page/money/dash/MoneyDash.jsx";
import {MoneyCompare} from "../page/money/main/MoneyCompare.jsx";
import {MoneyList} from "../page/money/main/MoneyList.jsx";
import {MoneyListPlan} from "../page/money/plan/MoneyListPlan.jsx";
import {MoneyDetail} from "../page/money/main/MoneyDetail.jsx";
import {MoneyDetailPlan} from "../page/money/plan/MoneyDetailPlan.jsx";
import {MoneySave} from "../page/money/main/MoneySave.jsx";
import {MoneySavePlan} from "../page/money/plan/MoneySavePlan.jsx";

import {SleepDash} from "../page/sleep/dash/SleepDash.jsx";
import {SleepCompare} from "../page/sleep/main/SleepCompare.jsx";
import {SleepList} from "../page/sleep/main/SleepList.jsx";
import {SleepListPlan} from "../page/sleep/plan/SleepListPlan.jsx";
import {SleepDetail} from "../page/sleep/main/SleepDetail.jsx";
import {SleepDetailPlan} from "../page/sleep/plan/SleepDetailPlan.jsx";
import {SleepSave} from "../page/sleep/main/SleepSave.jsx";
import {SleepSavePlan} from "../page/sleep/plan/SleepSavePlan.jsx";

import {UserLogin} from "../page/user/main/UserLogin.jsx";
import {UserSave} from "../page/user/main/UserSave.jsx";
import {UserDetail} from "../page/user/main/UserDetail.jsx";
import {UserDelete} from "../page/user/main/UserDelete.jsx";
import {UserList} from "../page/user/main/UserList";

import {WorkDash} from "../page/work/dash/WorkDash.jsx";
import {WorkCompare} from "../page/work/main/WorkCompare.jsx";
import {WorkList} from "../page/work/main/WorkList.jsx";
import {WorkListPlan} from "../page/work/plan/WorkListPlan.jsx";
import {WorkDetail} from "../page/work/main/WorkDetail.jsx";
import {WorkDetailPlan} from "../page/work/plan/WorkDetailPlan.jsx";
import {WorkSave} from "../page/work/main/WorkSave.jsx";
import {WorkSavePlan} from "../page/work/plan/WorkSavePlan.jsx";

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
      <Route path="/list/plan" element={<FoodListPlan />} />
      <Route path="/detail" element={<FoodDetail />} />
      <Route path="/detail/plan" element={<FoodDetailPlan />} />
      <Route path="/save" element={<FoodSave />} />
      <Route path="/save/plan" element={<FoodSavePlan />} />
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
      <Route path="/list/plan" element={<MoneyListPlan />} />
      <Route path="/detail" element={<MoneyDetail />} />
      <Route path="/detail/plan" element={<MoneyDetailPlan />} />
      <Route path="/save" element={<MoneySave />} />
      <Route path="/save/plan" element={<MoneySavePlan />} />
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
      <Route path="/list/plan" element={<SleepListPlan />} />
      <Route path="/detail" element={<SleepDetail />} />
      <Route path="/detail/plan" element={<SleepDetailPlan />} />
      <Route path="/save" element={<SleepSave />} />
      <Route path="/save/plan" element={<SleepSavePlan />} />
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
      <Route path="/list/plan" element={<WorkListPlan />} />
      <Route path="/detail" element={<WorkDetail />} />
      <Route path="/detail/plan" element={<WorkDetailPlan />} />
      <Route path="/save" element={<WorkSave />} />
      <Route path="/save/plan" element={<WorkSavePlan />} />
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