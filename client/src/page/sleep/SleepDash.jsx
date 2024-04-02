// Dash.jsx

import React from "react";
import {DashBar} from "./DashBar.jsx";
import {DashLine} from "./DashLine.jsx";
import {DashAvg} from "./DashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container">
        <div className="container-wrapper mb-10">
          {DashBar()}
        </div>
        <div className="container-wrapper mb-10">
          {DashLine()}
        </div>
        <div className="container-wrapper mb-10">
          {DashAvg()}
        </div>
      </div>
    </div>
  );
};
