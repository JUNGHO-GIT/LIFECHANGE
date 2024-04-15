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
    <div className={"root-wrapper"}>
      <div className={"container"}>
        <div className={"container-wrapper mb-10"}>
          <h5>오늘 목표/실제 수입/지출</h5>
          {MoneyDashBar()}
        </div>
        <div className={"container-wrapper mb-10"}>
          <h5>오늘 수입/지출</h5>
          {MoneyDashPie()}
        </div>
        <div className={"container-wrapper mb-10"}>
          <h5>주간 수입/지출</h5>
          {MoneyDashLine()}
        </div>
        <div className={"container-wrapper mb-10"}>
          <h5>주간/월간 평균 수입/지출</h5>
          {MoneyDashAvg()}
        </div>
      </div>
    </div>
  );
};
