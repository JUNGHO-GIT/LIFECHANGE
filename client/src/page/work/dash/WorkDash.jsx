// Dash.jsx

import React from "react";
import {DashBar} from "./WorkDashBar.jsx";
import {DashLine} from "./WorkDashLine.jsx";
import {DashAvg} from "./WorkDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkDash = () => {

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
