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
      {FoodDashBar()}
      <br />
      {FoodDashPie()}
      <br />
      {FoodDashLine()}
      <br />
      {FoodDashAvg()}
      <br />
    </React.Fragment>
  );
};