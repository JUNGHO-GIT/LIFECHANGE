// WorkDash.jsx

import React from "react";
import {DashScatterWeek} from "./DashScatterWeek.jsx";
import {DashScatterMonth} from "./DashScatterMonth.jsx";
import {DashPieWeek} from "./DashPieWeek.jsx";
import {DashPieMonth} from "./DashPieMonth.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashLineMonth} from "./DashLineMonth.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";
import {DashAvgMonth} from "./DashAvgMonth.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {DashScatterWeek()}
      <br />
      {DashScatterMonth()}
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
