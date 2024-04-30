// FoodDash.jsx

import React from "react";
import {FoodDashBar} from "./FoodDashBar.jsx";
import {FoodDashPie} from "./FoodDashPie.jsx";
import {FoodDashLine} from "./FoodDashLine.jsx";
import {FoodDashAvg} from "./FoodDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"mb-10"}>
        {FoodDashBar()}
      </div>
      <div className={"mb-10"}>
        {FoodDashPie()}
      </div>
      <div className={"mb-10"}>
        {FoodDashLine()}
      </div>
      <div>
        {FoodDashAvg()}
      </div>
    </React.Fragment>
  );
};