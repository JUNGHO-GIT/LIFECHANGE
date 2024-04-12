// WorkDetailPlan.jsx

import React from "react";
import {DashBar} from "../dash/WorkDashBar.jsx";
import {DashLine} from "../dash/WorkDashLine.jsx";
import {DashAvg} from "../dash/WorkDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkDetailPlan = () => {

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
