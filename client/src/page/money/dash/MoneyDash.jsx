// MoneyDash.jsx

import React from "react";
import {Header} from "../../architecture/Header";
import {NavBar} from "../../architecture/NavBar";
import {MoneyDashBar} from "./MoneyDashBar";
import {MoneyDashPie} from "./MoneyDashPie";
import {MoneyDashLine} from "./MoneyDashLine";
import {MoneyDashAvg} from "./MoneyDashAvg";

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