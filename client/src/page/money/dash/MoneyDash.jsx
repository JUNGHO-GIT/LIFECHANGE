// MoneyDash.jsx

import React from "react";
import {MoneyDashBar} from "./MoneyDashBar.jsx";
import {MoneyDashPie} from "./MoneyDashPie.jsx";
import {MoneyDashLine} from "./MoneyDashLine.jsx";
import {MoneyDashAvg} from "./MoneyDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"d-block"}>
        {MoneyDashBar()}
        {MoneyDashPie()}
        {MoneyDashLine()}
        {MoneyDashAvg()}
      </div>
    </React.Fragment>
  );
};