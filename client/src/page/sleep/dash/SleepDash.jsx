// SleepDash.jsx

import React from "react";
import {SleepDashBarToday} from "./SleepDashBarToday.jsx";
import {SleepDashLineWeek} from "./SleepDashLineWeek.jsx";
import {SleepDashLineMonth} from "./SleepDashLineMonth.jsx";
import {SleepDashAvgWeek} from "./SleepDashAvgWeek.jsx";
import {SleepDashAvgMonth} from "./SleepDashAvgMonth.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {SleepDashBarToday()}
      <br />
      {SleepDashLineWeek()}
      <br />
      {SleepDashLineMonth()}
      <br />
      {SleepDashAvgWeek()}
      <br />
      {SleepDashAvgMonth()}
      <br />
    </React.Fragment>
  );
};