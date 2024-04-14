// FoodDash.jsx

import React from "react";
import {FoodDashBar} from "./FoodDashBar.jsx";
import {FoodDashPie} from "./FoodDashPie.jsx";
import {FoodDashLine} from "./FoodDashLine.jsx";
import {FoodDashAvg} from "./FoodDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <div className="root-wrapper">
      <div className="container">
        <div className="container-wrapper mb-10">
          <h5 className="container-title">오늘 목표/실제 영양소</h5>
          {FoodDashBar()}
        </div>
        <div className="container-wrapper mb-10">
          <h5 className="container-title">오늘 영양소</h5>
          {FoodDashPie()}
        </div>
        <div className="container-wrapper mb-10">
          <h5 className="container-title">주간 영양소</h5>
          {/* {FoodDashLine()} */}
        </div>
        <div className="container-wrapper mb-10">
          <h5 className="container-title">주간/월간 평균 영양소</h5>
          {/* {FoodDashAvg()} */}
        </div>
      </div>
    </div>
  );
};
