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
import {TestList} from "../page/main/TestList";
import {TestSave} from "../page/main/TestSave";

import {UserLogin} from "../page/user/UserLogin.jsx";
import {UserSave} from "../page/user/UserSave.jsx";
import {UserDetail} from "../page/user/UserDetail.jsx";
import {UserDelete} from "../page/user/UserDelete.jsx";
import {UserList} from "../page/user/UserList";

import {CalendarList} from "../page/calendar/CalendarList.jsx";
import {CalendarDetail} from "../page/calendar/CalendarDetail";

import {FoodSave} from "../page/food/FoodSave.jsx";
import {FoodDetail} from "../page/food/FoodDetail.jsx";
import {FoodSearchList} from "../page/food/FoodSearchList.jsx";
import {FoodSearchResult} from "../page/food/FoodSearchResult.jsx";
import {FoodList} from "../page/food/FoodList.jsx";

import {WorkSave} from "../page/work/WorkSave.jsx";
import {WorkDetail} from "../page/work/WorkDetail.jsx";
import {WorkList} from "../page/work/WorkList.jsx";

import {SleepSave} from "../page/sleep/SleepSave.jsx";
import {SleepDetail} from "../page/sleep/SleepDetail.jsx";
import {SleepDash} from "../page/sleep/SleepDash.jsx";
import {SleepList} from "../page/sleep/SleepList";

import {MoneySave} from "../page/money/MoneySave.jsx";
import {MoneyDetail} from "../page/money/MoneyDetail.jsx";
import {MoneyList} from "../page/money/MoneyList.jsx";

// ------------------------------------------------------------------------------------------------>
const Common = () => {
  return (
    <Routes>
      <Route path="/" element={<Dash />} />
      <Route path="/test/list" element={<TestList />} />
      <Route path="/test/save" element={<TestSave />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const User = () => {
  return (
    <Routes>
      <Route path="/login" element={<UserLogin />} />
      <Route path="/save" element={<UserSave />} />
      <Route path="/detail" element={<UserDetail />} />
      <Route path="/list" element={<UserList />} />
      <Route path="/delete" element={<UserDelete />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Calendar = () => {
  return (
    <Routes>
      <Route path="/list" element={<CalendarList />} />
      <Route path="/detail" element={<CalendarDetail />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Food = () => {
  return (
    <Routes>
      <Route path="/list" element={<FoodList />} />
      <Route path="/save" element={<FoodSave />} />
      <Route path="/detail" element={<FoodDetail />} />
      <Route path="/search/list" element={<FoodSearchList />} />
      <Route path="/search/result" element={<FoodSearchResult />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Work = () => {
  return (
    <Routes>
      <Route path="/list" element={<WorkList />} />
      <Route path="/save" element={<WorkSave />} />
      <Route path="/detail" element={<WorkDetail />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Money = () => {
  return (
    <Routes>
      <Route path="/save" element={<MoneySave />} />
      <Route path="/detail" element={<MoneyDetail />} />
      <Route path="/list/day" element={<MoneyList />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Sleep = () => {
  return (
    <Routes>
      <Route path="dash" element={<SleepDash />} />
      <Route path="list" element={<SleepList />} />
      <Route path="save" element={<SleepSave />} />
      <Route path="detail" element={<SleepDetail />} />
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
            <Route path="/calendar/*" element={<Calendar />} />
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