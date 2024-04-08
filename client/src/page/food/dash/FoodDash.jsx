// Dash.jsx

import React from "react";
import {DashBar} from "./FoodDashBar.jsx";
import {DashLine} from "./FoodDashLine.jsx";
import {DashAvg} from "./FoodDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDash = () => {

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
