// FoodDash.jsx

import React from "react";
import {Header} from "../../../layout/Header.jsx";
import {NavBar} from "../../../layout/NavBar.jsx";
import {FoodDashBar} from "./FoodDashBar.jsx";
import {FoodDashPie} from "./FoodDashPie.jsx";
import {FoodDashLine} from "./FoodDashLine.jsx";
import {FoodDashAvg} from "./FoodDashAvg.jsx";

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