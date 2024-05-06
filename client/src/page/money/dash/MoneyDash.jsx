// MoneyDash.jsx

import React from "react";
import {Header} from "../../../layout/Header.jsx";
import {NavBar} from "../../../layout/NavBar.jsx";
import {MoneyDashBar} from "./MoneyDashBar.jsx";
import {MoneyDashPie} from "./MoneyDashPie.jsx";
import {MoneyDashLine} from "./MoneyDashLine.jsx";
import {MoneyDashAvg} from "./MoneyDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const MoneyDash = () => {

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {Header()}
      {NavBar()}
      {MoneyDashBar()}
      {MoneyDashPie()}
      {MoneyDashLine()}
      {MoneyDashAvg()}
    </React.Fragment>
  );
};