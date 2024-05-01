// SleepDash.jsx

import React from "react";
import {SleepDashBar} from "./SleepDashBar.jsx";
import {SleepDashLine} from "./SleepDashLine.jsx";
import {SleepDashAvg} from "./SleepDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {SleepDashBar()}
      <br/>
      {SleepDashLine()}
      <br/>
      {SleepDashAvg()}
    </React.Fragment>
  );
};