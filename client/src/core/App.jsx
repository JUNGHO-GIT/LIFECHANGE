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
import {FoodList} from "../page/food/FoodList.jsx";
import {FoodDetail} from "../page/food/FoodDetail.jsx";
import {FoodSave} from "../page/food/FoodSave.jsx";

import {MoneyDash} from "../page/money/dash/MoneyDash.jsx";
import {MoneyCompare} from "../page/money/MoneyCompare.jsx";
import {MoneyList} from "../page/money/MoneyList.jsx";
import {MoneyDetail} from "../page/money/MoneyDetail.jsx";
import {MoneySave} from "../page/money/MoneySave.jsx";

import {PlanFoodList} from "../page/plan/PlanFoodList.jsx";
import {PlanFoodDetail} from "../page/plan/PlanFoodDetail.jsx";
import {PlanFoodSave} from "../page/plan/PlanFoodSave.jsx";

import {PlanMoneyList} from "../page/plan/PlanMoneyList.jsx";
/* import {PlanMoneyDetail} from "../page/plan/PlanMoneyDetail.jsx"; */
import {PlanMoneySave} from "../page/plan/PlanMoneySave.jsx";

import {PlanSleepList} from "../page/plan/PlanSleepList.jsx";
/* import {PlanSleepDetail} from "../page/plan/PlanSleepDetail.jsx"; */
import {PlanSleepSave} from "../page/plan/PlanSleepSave.jsx";

import {PlanWorkList} from "../page/plan/PlanWorkList.jsx";
/* import {PlanWorkDetail} from "../page/plan/PlanWorkDetail.jsx"; */
import {PlanWorkSave} from "../page/plan/PlanWorkSave.jsx";

import {SleepDash} from "../page/sleep/dash/SleepDash.jsx";
import {SleepCompare} from "../page/sleep/SleepCompare.jsx";
import {SleepList} from "../page/sleep/SleepList.jsx";
import {SleepDetail} from "../page/sleep/SleepDetail.jsx";
import {SleepSave} from "../page/sleep/SleepSave.jsx";

import {UserLogin} from "../page/user/UserLogin.jsx";
import {UserSave} from "../page/user/UserSave.jsx";
import {UserDetail} from "../page/user/UserDetail.jsx";
import {UserDelete} from "../page/user/UserDelete.jsx";
import {UserList} from "../page/user/UserList";

import {WorkDash} from "../page/work/dash/WorkDash.jsx";
import {WorkCompare} from "../page/work/WorkCompare.jsx";
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
      <Route path="/dash" element={<FoodDash />} />
      <Route path="/compare" element={<FoodCompare />} />
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
      <Route path="/dash" element={<MoneyDash />} />
      <Route path="/compare" element={<MoneyCompare />} />
      <Route path="/list" element={<MoneyList />} />
      <Route path="/detail" element={<MoneyDetail />} />
      <Route path="/save" element={<MoneySave />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Plan = () => {
  return (
    <Routes>
      <Route path="/food/list" element={<PlanFoodList />} />
      <Route path="/food/detail" element={<PlanFoodDetail />} />
      <Route path="/food/save" element={<PlanFoodSave />} />
      <Route path="/money/list" element={<PlanMoneyList />} />
      <Route path="/money/save" element={<PlanMoneySave />} />
      <Route path="/sleep/list" element={<PlanSleepList />} />
      <Route path="/sleep/save" element={<PlanSleepSave />} />
      <Route path="/work/list" element={<PlanWorkList />} />
      <Route path="/work/save" element={<PlanWorkSave />} />
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
      <Route path="/detail" element={<SleepDetail />} />
      <Route path="/save" element={<SleepSave />} />
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
      <Route path="/detail" element={<WorkDetail />} />
      <Route path="/save" element={<WorkSave />} />
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