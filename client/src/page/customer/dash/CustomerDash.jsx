// CustomerDash.jsx

import React from "react";
import {FoodDashBarToday} from "./FoodDashBarToday.jsx";
import {MoneyDashBarToday} from "./MoneyDashBarToday.jsx";
import {SleepDashBarToday} from "./SleepDashBarToday.jsx";
import {ExerciseDashBarToday} from "./ExerciseDashBarToday.jsx";

// ------------------------------------------------------------------------------------------------>
export const CustomerDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <div>
          {ExerciseDashBarToday()}
          {FoodDashBarToday()}
        </div>
        <div>
          {MoneyDashBarToday()}
          {SleepDashBarToday()}
        </div>
      </div>
    </React.Fragment>
  );
};