// index.jsx

import React from "react";
import ReactDOM from "react-dom";
import {BrowserRouter} from "react-router-dom";
import {reportWebVitals} from "./settings/reportWebVitals";
import {App} from "./core/App";
import "./index.css";

ReactDOM.render (
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById("root")
);

reportWebVitals(console.log);
