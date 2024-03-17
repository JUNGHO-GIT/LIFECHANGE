// App.tsx

import React from "react";
import {Routes, Route, useLocation} from "react-router-dom";
import {DeveloperModeProvider} from "../assets/ts/useDeveloperMode";

import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "boxicons/css/boxicons.min.css";
import "react-day-picker/dist/style.css";
import "react-datepicker/dist/react-datepicker.css";
import "../assets/css/Custom.css";
import "../assets/css/Jstyle.css";
import "../assets/css/DatePicker.css";
import "../assets/css/TimePicker.css";
import "../assets/css/DayPicker.css";

import {Resize} from "../components/Resize";
import {Loader} from "../components/Loader";
import {Header} from "../layout/Header";
import {Footer} from "../layout/Footer";
import {Hover} from "../components/Hover";

import {UserLogin} from "../page/user/UserLogin";
import {UserInsert} from "../page/user/UserInsert";
import {UserDetail} from "../page/user/UserDetail";
import {UserUpdate} from "../page/user/UserUpdate";
import {UserDelete} from "../page/user/UserDelete";
import {UserList} from "../page/user/UserList";

import {BoardList} from "../page/board/BoardList";
import {BoardInsert} from "../page/board/BoardInsert";
import {BoardDetail} from "../page/board/BoardDetail";
import {BoardUpdate} from "../page/board/BoardUpdate";

import {CalendarList} from "../page/calendar/CalendarList";
import {CalendarDetail} from "../page/calendar/CalendarDetail";

import {FoodInsert} from "../page/food/FoodInsert";
import {FoodDetail} from "../page/food/FoodDetail";
import {FoodUpdate} from "../page/food/FoodUpdate";
import {FoodSearchList} from "../page/food/FoodSearchList";
import {FoodSearchResult} from "../page/food/FoodSearchResult";
import {FoodListDay} from "../page/food/FoodListDay";
import {FoodListWeek} from "../page/food/FoodListWeek";
import {FoodListMonth} from "../page/food/FoodListMonth";
import {FoodListYear} from "../page/food/FoodListYear";
import {FoodListSelect} from "../page/food/FoodListSelect";

import {WorkInsert} from "../page/work/WorkInsert";
import {WorkDetail} from "../page/work/WorkDetail";
import {WorkUpdate} from "../page/work/WorkUpdate";
import {WorkListDay} from "../page/work/WorkListDay";
import {WorkListWeek} from "../page/work/WorkListWeek";
import {WorkListMonth} from "../page/work/WorkListMonth";
import {WorkListYear} from "../page/work/WorkListYear";
import {WorkListSelect} from "../page/work/WorkListSelect";

import {SleepInsert} from "../page/sleep/SleepInsert";
import {SleepDetail} from "../page/sleep/SleepDetail";
import {SleepUpdate} from "../page/sleep/SleepUpdate";
import {SleepListDay} from "../page/sleep/SleepListDay";
import {SleepListWeek} from "../page/sleep/SleepListWeek";
import {SleepListMonth} from "../page/sleep/SleepListMonth";
import {SleepListYear} from "../page/sleep/SleepListYear";
import {SleepListSelect} from "../page/sleep/SleepListSelect";

import {MoneyInsert} from "../page/money/MoneyInsert";
import {MoneyDetail} from "../page/money/MoneyDetail";
import {MoneyUpdate} from "../page/money/MoneyUpdate";
import {MoneyListDay} from "../page/money/MoneyListDay";
import {MoneyListWeek} from "../page/money/MoneyListWeek";
import {MoneyListMonth} from "../page/money/MoneyListMonth";
import {MoneyListYear} from "../page/money/MoneyListYear";
import {MoneyListSelect} from "../page/money/MoneyListSelect";

// ------------------------------------------------------------------------------------------------>
const App = () => {

  return (
    <div className="App">
    <DeveloperModeProvider>
      <Loader />
      <Resize />
      <Hover />
      <Header />
      <Routes>

        <Route path="/" element={<CalendarList />} />
        <Route path="/calendarList" element={<CalendarList />} />
        <Route path="/calendarDetail" element={<CalendarDetail />} />

        <Route path="/userLogin" element={<UserLogin />} />
        <Route path="/userInsert" element={<UserInsert />} />
        <Route path="/userDetail" element={<UserDetail />} />
        <Route path="/userList" element={<UserList />} />
        <Route path="/userUpdate" element={<UserUpdate />} />
        <Route path="/userDelete" element={<UserDelete />} />

        <Route path="/boardList" element={<BoardList />} />
        <Route path="/boardInsert" element={<BoardInsert />} />
        <Route path="/boardDetail" element={<BoardDetail />} />
        <Route path="/boardUpdate" element={<BoardUpdate />} />

        <Route path="/foodInsert" element={<FoodInsert />} />
        <Route path="/foodDetail" element={<FoodDetail />} />
        <Route path="/foodUpdate" element={<FoodUpdate />} />
        <Route path="/foodSearchList" element={<FoodSearchList />} />
        <Route path="/foodSearchResult" element={<FoodSearchResult />} />
        <Route path="/foodListDay" element={<FoodListDay />} />
        <Route path="/foodListWeek" element={<FoodListWeek />} />
        <Route path="/foodListMonth" element={<FoodListMonth />} />
        <Route path="/foodListYear" element={<FoodListYear />} />
        <Route path="/foodListSelect" element={<FoodListSelect />} />

        <Route path="/workInsert" element={<WorkInsert />} />
        <Route path="/workDetail" element={<WorkDetail />} />
        <Route path="/workUpdate" element={<WorkUpdate />} />
        <Route path="/workListDay" element={<WorkListDay />} />
        <Route path="/workListWeek" element={<WorkListWeek />} />
        <Route path="/workListMonth" element={<WorkListMonth />} />
        <Route path="/workListYear" element={<WorkListYear />} />
        <Route path="/workListSelect" element={<WorkListSelect />} />

        <Route path="/sleepInsert" element={<SleepInsert />} />
        <Route path="/sleepDetail" element={<SleepDetail />} />
        <Route path="/sleepUpdate" element={<SleepUpdate />} />
        <Route path="/sleepListDay" element={<SleepListDay />} />
        <Route path="/sleepListWeek" element={<SleepListWeek />} />
        <Route path="/sleepListMonth" element={<SleepListMonth />} />
        <Route path="/sleepListYear" element={<SleepListYear />} />
        <Route path="/sleepListSelect" element={<SleepListSelect />} />

        <Route path="/moneyInsert" element={<MoneyInsert />} />
        <Route path="/moneyDetail" element={<MoneyDetail />} />
        <Route path="/moneyUpdate" element={<MoneyUpdate />} />
        <Route path="/moneyListDay" element={<MoneyListDay />} />
        <Route path="/moneyListWeek" element={<MoneyListWeek />} />
        <Route path="/moneyListMonth" element={<MoneyListMonth />} />
        <Route path="/moneyListYear" element={<MoneyListYear />} />
        <Route path="/moneyListSelect" element={<MoneyListSelect />} />

      </Routes>
      <Footer />
      </DeveloperModeProvider>
    </div>
  );
};

export default App;
