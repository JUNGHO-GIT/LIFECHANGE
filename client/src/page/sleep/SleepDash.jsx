// Dash.jsx

import React from "react";
import {DashBar} from "./dash/DashBar.jsx";
/* import {DashLine} from "./dash/DashLine.jsx";
import {DashAvg} from "./dash/DashAvg.jsx"; */

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container">
        <div className="container-wrapper mb-10">
          {DashBar()}
        </div>
      </div>
    </div>
  );
};
