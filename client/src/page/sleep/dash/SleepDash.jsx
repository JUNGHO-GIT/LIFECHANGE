// SleepDash.jsx

import React from "react";
import {DashBarToday} from "./DashBarToday.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashLineMonth} from "./DashLineMonth.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";
import {DashAvgMonth} from "./DashAvgMonth.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {DashBarToday()}
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