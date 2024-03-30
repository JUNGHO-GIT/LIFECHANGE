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

import {DashList} from "../page/dash/Dash";

import {UserLogin} from "../page/user/UserLogin.jsx";
import {UserInsert} from "../page/user/UserInsert.jsx";
import {UserDetail} from "../page/user/UserDetail.jsx";
import {UserUpdate} from "../page/user/UserUpdate.jsx";
import {UserDelete} from "../page/user/UserDelete.jsx";
import {UserList} from "../page/user/UserList";

import {BoardList} from "../page/board/BoardList.jsx";
import {BoardInsert} from "../page/board/BoardInsert.jsx";
import {BoardDetail} from "../page/board/BoardDetail.jsx";
import {BoardUpdate} from "../page/board/BoardUpdate";

import {CalendarList} from "../page/calendar/CalendarList.jsx";
import {CalendarDetail} from "../page/calendar/CalendarDetail";

import {FoodInsert} from "../page/food/FoodInsert.jsx";
import {FoodDetail} from "../page/food/FoodDetail.jsx";
import {FoodUpdate} from "../page/food/FoodUpdate.jsx";
import {FoodSearchList} from "../page/food/FoodSearchList.jsx";
import {FoodSearchResult} from "../page/food/FoodSearchResult.jsx";
import {FoodListDay} from "../page/food/FoodListDay.jsx";

import {WorkInsert} from "../page/work/WorkInsert.jsx";
import {WorkDetail} from "../page/work/WorkDetail.jsx";
import {WorkUpdate} from "../page/work/WorkUpdate.jsx";
import {WorkList} from "../page/work/WorkList.jsx";

import {SleepInsert} from "../page/sleep/SleepInsert.jsx";
import {SleepDetail} from "../page/sleep/SleepDetail.jsx";
import {SleepUpdate} from "../page/sleep/SleepUpdate.jsx";
import {SleepDash} from "../page/sleep/SleepDash.jsx";
import {SleepList} from "../page/sleep/SleepList";

import {MoneyInsert} from "../page/money/MoneyInsert.jsx";
import {MoneyDetail} from "../page/money/MoneyDetail.jsx";
import {MoneyUpdate} from "../page/money/MoneyUpdate.jsx";
import {MoneyListDay} from "../page/money/MoneyListDay.jsx";
import {MoneyListWeek} from "../page/money/MoneyListWeek.jsx";
import {MoneyListMonth} from "../page/money/MoneyListMonth.jsx";
import {MoneyListYear} from "../page/money/MoneyListYear.jsx";
import {MoneyListSelect} from "../page/money/MoneyListSelect";

import {PlanInsert} from "../page/plan/PlanInsert.jsx";
import {PlanDetail} from "../page/plan/PlanDetail.jsx";
import {PlanUpdate} from "../page/plan/PlanUpdate.jsx";
import {PlanList} from "../page/plan/PlanList";

import {Test} from "../page/test/Test";

// ------------------------------------------------------------------------------------------------>
const Common = () => {
  return (
    <Routes>
      <Route path="/" element={<DashList />} />
      <Route path="/test" element={<Test />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const User = () => {
  return (
    <Routes>
      <Route path="/login" element={<UserLogin />} />
      <Route path="/insert" element={<UserInsert />} />
      <Route path="/detail" element={<UserDetail />} />
      <Route path="/list" element={<UserList />} />
      <Route path="/update" element={<UserUpdate />} />
      <Route path="/delete" element={<UserDelete />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Board = () => {
  return (
    <Routes>
      <Route path="/list" element={<BoardList />} />
      <Route path="/insert" element={<BoardInsert />} />
      <Route path="/detail" element={<BoardDetail />} />
      <Route path="/update" element={<BoardUpdate />} />
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
      <Route path="/list" element={<FoodListDay />} />
      <Route path="/insert" element={<FoodInsert />} />
      <Route path="/detail" element={<FoodDetail />} />
      <Route path="/update" element={<FoodUpdate />} />
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
      <Route path="/insert" element={<WorkInsert />} />
      <Route path="/detail" element={<WorkDetail />} />
      <Route path="/update" element={<WorkUpdate />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Money = () => {
  return (
    <Routes>
      <Route path="/insert" element={<MoneyInsert />} />
      <Route path="/detail" element={<MoneyDetail />} />
      <Route path="/update" element={<MoneyUpdate />} />
      <Route path="/list/day" element={<MoneyListDay />} />
      <Route path="/list/week" element={<MoneyListWeek />} />
      <Route path="/list/month" element={<MoneyListMonth />} />
      <Route path="/list/year" element={<MoneyListYear />} />
      <Route path="/list/select" element={<MoneyListSelect />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Plan = () => {
  return (
    <Routes>
      <Route path="/list" element={<PlanList />} />
      <Route path="/insert" element={<PlanInsert />} />
      <Route path="/detail" element={<PlanDetail />} />
      <Route path="/update" element={<PlanUpdate />} />
    </Routes>
  );
};
// ------------------------------------------------------------------------------------------------>
const Sleep = () => {
  return (
    <Routes>
      <Route path="dash" element={<SleepDash />} />
      <Route path="list" element={<SleepList />} />
      <Route path="insert" element={<SleepInsert />} />
      <Route path="detail" element={<SleepDetail />} />
      <Route path="update" element={<SleepUpdate />} />
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
            <Route path="/" element={<Common />} />
            <Route path="/user/*" element={<User />} />
            <Route path="/board/*" element={<Board />} />
            <Route path="/calendar/*" element={<Calendar />} />
            <Route path="/food/*" element={<Food />} />
            <Route path="/work/*" element={<Work />} />
            <Route path="/sleep/*" element={<Sleep />} />
            <Route path="/money/*" element={<Money />} />
            <Route path="/plan/*" element={<Plan />} />
          </Routes>
        <Footer />
      </DeveloperModeProvider>
    </div>
  );
};