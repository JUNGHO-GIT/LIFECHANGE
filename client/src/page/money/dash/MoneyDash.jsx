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
      <div className={"mb-10"}>
        {MoneyDashBar()}
      </div>
      <div className={"mb-10"}>
        {MoneyDashPie()}
      </div>
      <div className={"mb-10"}>
        {MoneyDashLine()}
      </div>
      <div>
        {MoneyDashAvg()}
      </div>
    </React.Fragment>
  );
};