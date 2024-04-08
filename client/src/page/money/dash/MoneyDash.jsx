// Dash.jsx

import React from "react";
import {DashBar} from "./MoneyDashBar.jsx";
import {DashLine} from "./MoneyDashLine.jsx";
import {DashAvg} from "./MoneyDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDash = () => {

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
