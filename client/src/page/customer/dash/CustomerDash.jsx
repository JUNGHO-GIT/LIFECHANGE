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
        <div style={{display: "flex", flexDirection: "row"}}>
          {ExerciseDashBarToday()}
          {FoodDashBarToday()}
        </div>
        <div style={{display: "flex", flexDirection: "row"}}>
          {MoneyDashBarToday()}
          {SleepDashBarToday()}
        </div>
      </div>
    </React.Fragment>
  );
};