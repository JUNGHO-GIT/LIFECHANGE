// FoodDash.jsx

import React from "react";
import {FoodDashBarToday} from "./FoodDashBarToday.jsx";
import {FoodDashPieToday} from "./FoodDashPieToday.jsx";
import {FoodDashPieWeek} from "./FoodDashPieWeek.jsx";
import {FoodDashPieMonth} from "./FoodDashPieMonth.jsx";
import {FoodDashLineWeek} from "./FoodDashLineWeek.jsx";
import {FoodDashLineMonth} from "./FoodDashLineMonth.jsx";
import {FoodDashAvgWeek} from "./FoodDashAvgWeek.jsx";
import {FoodDashAvgMonth} from "./FoodDashAvgMonth.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {FoodDashBarToday()}
      <br />
      {FoodDashPieToday()}
      <br />
      {FoodDashPieWeek()}
      <br />
      {FoodDashPieMonth()}
      <br />
      {FoodDashLineWeek()}
      <br />
      {FoodDashLineMonth()}
      <br />
      {FoodDashAvgWeek()}
      <br />
      {FoodDashAvgMonth()}
      <br />
    </React.Fragment>
  );
};