// WorkDash.jsx

import React from "react";
import {WorkDashBar} from "./WorkDashBar.jsx";
import {WorkDashPie} from "./WorkDashPie.jsx";
import {WorkDashLine} from "./WorkDashLine.jsx";
import {WorkDashAvg} from "./WorkDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const WorkDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container">
        <div className="container-wrapper mb-10">
          <h5 className="container-title">오늘 목표/실제 수입/지출</h5>
          {WorkDashBar()}
        </div>
        <div className="container-wrapper mb-10">
          <h5 className="container-title">오늘 수입/지출</h5>
          {WorkDashPie()}
        </div>
        <div className="container-wrapper mb-10">
          <h5 className="container-title">주간 수입/지출</h5>
          {WorkDashLine()}
        </div>
        <div className="container-wrapper mb-10">
          <h5 className="container-title">주간/월간 평균 수입/지출</h5>
          {WorkDashAvg()}
        </div>
      </div>
    </div>
  );
};
