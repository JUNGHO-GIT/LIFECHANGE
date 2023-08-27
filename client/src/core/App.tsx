// App.tsx
import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import "./App.css";
import "../assets/css/Custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "boxicons/css/boxicons.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

import {Resize} from "../components/Resize";
import {Loader} from "../components/Loader";
import {Header} from "../layout/Header";
import {Footer} from "../layout/Footer";
import {Hover} from "../components/Hover";
import {Main} from "../page/common/Main";

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

import {FoodList} from "../page/food/FoodList";
import {FoodInsert} from "../page/food/FoodInsert";
import {FoodTotal} from "../page/food/FoodTotal";

// ------------------------------------------------------------------------------------------------>
const App = () => {

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="App">
      <Loader />
      <Resize />
      <Hover />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
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
          <Route path="/calendarList" element={<CalendarList />} />
          <Route path="/calendarDetail" element={<CalendarDetail />} />
          <Route path="/foodList" element={<FoodList />} />
          <Route path="/foodInsert" element={<FoodInsert />} />
          <Route path="/foodTotal" element={<FoodTotal />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
