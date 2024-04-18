// FoodDash.jsx

import React from "react";
import {DashBarToday} from "./DashBarToday.jsx";
import {DashPieToday} from "./DashPieToday.jsx";
import {DashPieWeek} from "./DashPieWeek.jsx";
import {DashPieMonth} from "./DashPieMonth.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashLineMonth} from "./DashLineMonth.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";
import {DashAvgMonth} from "./DashAvgMonth.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {DashBarToday()}
      <br />
      {DashPieToday()}
      <br />
      {DashPieWeek()}
      <br />
      {DashPieMonth()}
      <br />
      {DashLineWeek()}
      <br />
      {DashLineMonth()}
      <br />
      {DashAvgWeek()}
      <br />
      {DashAvgMonth()}
      <br />
    </React.Fragment>
  );
};