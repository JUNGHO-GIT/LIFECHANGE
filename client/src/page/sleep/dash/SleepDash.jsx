// SleepDash.jsx

import React from "react";
import {SleepDashBar} from "./SleepDashBar.jsx";
import {SleepDashLine} from "./SleepDashLine.jsx";
import {SleepDashAvg} from "./SleepDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className={"root-wrapper"}>
      <div className="container">
        <div className="container-wrapper mb-10">
          <h5 className="container-title">오늘 목표/실제 수면 데이터</h5>
          {SleepDashBar()}
        </div>
        <div className="container-wrapper mb-10">
          <h5 className="container-title">주간 수면 데이터</h5>
          {SleepDashLine()}
        </div>
        <div className="container-wrapper mb-10">
          <h5 className="container-title">주간/월간 평균 수면 데이터</h5>
          {SleepDashAvg()}
        </div>
      </div>
    </div>
  );
};
