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

import Main from "../page/Main";
import Login from "../page/Login";
import SecretKey from "../assets/ts/SecretKey";
import UserInfo from "../page/UserInfo";

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
          <Route path="/signup" element={<SecretKey />} />
          <Route path="/userInfo" element={<UserInfo />} />
        </Routes>
        <Footer />
      </Router>
    </div>
  );
};

export default App;
