import React from "react";
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";

import "bootstrap/dist/js/bootstrap.bundle.min.js";

import "./App.css";
import "../assets/css/Custom.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "aos/dist/aos.css";
import "boxicons/css/boxicons.min.css";

import Resize from "../components/Resize";
import Loader from "../components/Loader";
import Header from "../layout/Header";
import Footer from "../layout/Footer";
import Hover from "../components/Hover";

import Main from "../page/user/Main";
import Login from "../page/user/Login";
import SecretKeys from "../assets/ts/SecretKeys";
import UserInfo from "../page/user/UserInfo";
import UserList from "../page/admin/UserList";

// ------------------------------------------------------------------------------------------------>
const App = () => {
  Hover();

  // ---------------------------------------------------------------------------------------------->
  return (
    <div className="App">
      <Loader />
      <Resize />
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SecretKeys />} />
          <Route path="/userInfo" element={<UserInfo />} />
          <Route path="/userList" element={<UserList />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
