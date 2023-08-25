// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./core/App";
import reportWebVitals from "./settings/reportWebVitals";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root"),
);

reportWebVitals(console.log);
