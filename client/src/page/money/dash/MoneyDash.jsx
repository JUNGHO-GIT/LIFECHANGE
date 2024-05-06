// MoneyDash.jsx

import React from "react";
import {MoneyDashBar} from "./MoneyDashBar.jsx";
import {MoneyDashPie} from "./MoneyDashPie.jsx";
import {MoneyDashLine} from "./MoneyDashLine.jsx";
import {MoneyDashAvg} from "./MoneyDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDash = () => {

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {MoneyDashBar()}
      {MoneyDashPie()}
      {MoneyDashLine()}
      {MoneyDashAvg()}
    </React.Fragment>
  );
};