// SleepDash.jsx

import React from "react";
import {Header} from "../../../layout/Header.jsx";
import {NavBar} from "../../../layout/NavBar.jsx";
import {SleepDashBar} from "./SleepDashBar.jsx";
import {SleepDashLine} from "./SleepDashLine.jsx";
import {SleepDashAvg} from "./SleepDashAvg.jsx";

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