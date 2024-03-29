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
import {FoodListWeek} from "../page/food/FoodListWeek.jsx";
import {FoodListMonth} from "../page/food/FoodListMonth.jsx";
import {FoodListYear} from "../page/food/FoodListYear.jsx";
import {FoodListSelect} from "../page/food/FoodListSelect";

import {WorkInsert} from "../page/work/WorkInsert.jsx";
import {WorkDetail} from "../page/work/WorkDetail.jsx";
import {WorkUpdate} from "../page/work/WorkUpdate.jsx";
import {WorkList} from "../page/work/WorkList.jsx";
import {WorkListDay} from "../page/work/WorkListDay.jsx";
import {WorkListWeek} from "../page/work/WorkListWeek.jsx";
import {WorkListMonth} from "../page/work/WorkListMonth.jsx";
import {WorkListYear} from "../page/work/WorkListYear.jsx";
import {WorkListSelect} from "../page/work/WorkListSelect";

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
export const App = () => {

  return (
    <div className="App">
      <DeveloperModeProvider>
        <Loader />
        <Header />
        <Routes>

          <Route path="/" element={<DashList />} />
          <Route path="/test" element={<Test />} />

          <Route path="/calendar/list" element={<CalendarList />} />
          <Route path="/calendar/detail" element={<CalendarDetail />} />

          <Route path="/user/login" element={<UserLogin />} />
          <Route path="/user/insert" element={<UserInsert />} />
          <Route path="/user/detail" element={<UserDetail />} />
          <Route path="/user/list" element={<UserList />} />
          <Route path="/user/update" element={<UserUpdate />} />
          <Route path="/user/delete" element={<UserDelete />} />

          <Route path="/board/list" element={<BoardList />} />
          <Route path="/board/insert" element={<BoardInsert />} />
          <Route path="/board/detail" element={<BoardDetail />} />
          <Route path="/board/update" element={<BoardUpdate />} />

          <Route path="/food/list" element={<FoodListDay />} />
          <Route path="/food/insert" element={<FoodInsert />} />
          <Route path="/food/detail" element={<FoodDetail />} />
          <Route path="/food/update" element={<FoodUpdate />} />
          <Route path="/food/search/list" element={<FoodSearchList />} />
          <Route path="/food/search/result" element={<FoodSearchResult />} />

          <Route path="/work/insert" element={<WorkInsert />} />
          <Route path="/work/detail" element={<WorkDetail />} />
          <Route path="/work/update" element={<WorkUpdate />} />
          <Route path="/work/list" element={<WorkList />} />

          <Route path="/sleep/dash" element={<SleepDash />} />
          <Route path="/sleep/list" element={<SleepList />} />
          <Route path="/sleep/insert" element={<SleepInsert />} />
          <Route path="/sleep/detail" element={<SleepDetail />} />
          <Route path="/sleep/update" element={<SleepUpdate />} />

          <Route path="/money/insert" element={<MoneyInsert />} />
          <Route path="/money/detail" element={<MoneyDetail />} />
          <Route path="/money/update" element={<MoneyUpdate />} />
          <Route path="/moneyListDay" element={<MoneyListDay />} />
          <Route path="/moneyListWeek" element={<MoneyListWeek />} />
          <Route path="/moneyListMonth" element={<MoneyListMonth />} />
          <Route path="/moneyListYear" element={<MoneyListYear />} />
          <Route path="/moneyListSelect" element={<MoneyListSelect />} />

          <Route path="/plan/insert" element={<PlanInsert />} />
          <Route path="/plan/detail" element={<PlanDetail />} />
          <Route path="/plan/update" element={<PlanUpdate />} />
          <Route path="/plan/list" element={<PlanList />} />
        </Routes>
        <Footer />
      </DeveloperModeProvider>
    </div>
  );
};