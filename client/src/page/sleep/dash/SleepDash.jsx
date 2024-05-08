// SleepDash.jsx

import React from "react";
import {Header} from "page/architecture/Header";
import {NavBar} from "page/architecture/NavBar";
import {SleepDashBar} from "./SleepDashBar";
import {SleepDashLine} from "./SleepDashLine";
import {SleepDashAvg} from "./SleepDashAvg";

// ------------------------------------------------------------------------------------------------>
export const SleepDash = () => {

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {Header()}
      {NavBar()}
      {SleepDashBar()}
      {SleepDashLine()}
      {SleepDashAvg()}
    </React.Fragment>
  );
};