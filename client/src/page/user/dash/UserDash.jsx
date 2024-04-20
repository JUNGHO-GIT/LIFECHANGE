// UserDash.jsx

import React from "react";
import {DashPieWeek} from "./DashPieWeek.jsx";
import {DashPieMonth} from "./DashPieMonth.jsx";
import {DashLineWeek} from "./DashLineWeek.jsx";
import {DashLineMonth} from "./DashLineMonth.jsx";
import {DashAvgWeek} from "./DashAvgWeek.jsx";
import {DashAvgMonth} from "./DashAvgMonth.jsx";

// ------------------------------------------------------------------------------------------------>
export const UserDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
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