// MoneyDash.jsx

import {React} from "../../../import/ImportReacts";
import {Header, NavBar} from "../../../import/ImportLayouts";
import {MoneyDashBar} from "./MoneyDashBar";
import {MoneyDashPie} from "./MoneyDashPie";
import {MoneyDashLine} from "./MoneyDashLine";
import {MoneyDashAvg} from "./MoneyDashAvg";

// ------------------------------------------------------------------------------------------------>
export const MoneyDash = () => {

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Header />
      <NavBar />
      <MoneyDashBar />
      <MoneyDashPie />
      <MoneyDashLine />
      <MoneyDashAvg />
    </React.Fragment>
  );
};