// FoodDash.jsx

import React from "react";
import {Header} from "page/architecture/Header";
import {NavBar} from "page/architecture/NavBar";
import {FoodDashBar} from "./FoodDashBar";
import {FoodDashPie} from "./FoodDashPie";
import {FoodDashLine} from "./FoodDashLine";
import {FoodDashAvg} from "./FoodDashAvg";

// ------------------------------------------------------------------------------------------------>
export const FoodDash = () => {

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {Header()}
      {NavBar()}
      {FoodDashBar()}
      {FoodDashPie()}
      {FoodDashLine()}
      {FoodDashAvg()}
    </React.Fragment>
  );
};