// MoneyDash.jsx

import React from "react";
import {MoneyDashBarToday} from "./MoneyDashBarToday.jsx";
import {MoneyDashPieToday} from "./MoneyDashPieToday.jsx";
import {MoneyDashPieWeek} from "./MoneyDashPieWeek.jsx";
import {MoneyDashPieMonth} from "./MoneyDashPieMonth.jsx";
import {MoneyDashLineWeek} from "./MoneyDashLineWeek.jsx";
import {MoneyDashLineMonth} from "./MoneyDashLineMonth.jsx";
import {MoneyDashAvgWeek} from "./MoneyDashAvgWeek.jsx";
import {MoneyDashAvgMonth} from "./MoneyDashAvgMonth.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {MoneyDashBarToday()}
      <br />
      {MoneyDashPieToday()}
      <br />
      {MoneyDashPieWeek()}
      <br />
      {MoneyDashPieMonth()}
      <br />
      {MoneyDashLineWeek()}
      <br />
      {MoneyDashLineMonth()}
      <br />
      {MoneyDashAvgWeek()}
      <br />
      {MoneyDashAvgMonth()}
      <br />
    </React.Fragment>
  );
};