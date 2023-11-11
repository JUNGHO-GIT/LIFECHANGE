// index.tsx
import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./core/App";
import { useDynamicStyle } from "./assets/ts/useDynamicStyle";
import { reportWebVitals } from "./settings/reportWebVitals";

const RootComponent= () => {
  useDynamicStyle(document);
  return (
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );
};

ReactDOM.render (
  <RootComponent />,
  document.getElementById("root")
);

reportWebVitals(console.log);
