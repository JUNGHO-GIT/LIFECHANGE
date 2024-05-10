// FoodDash.jsx

import {React} from "../../../import/ImportReacts";
import {Header, NavBar} from "../../../import/ImportLayouts";
import {FoodDashBar} from "./FoodDashBar";
import {FoodDashPie} from "./FoodDashPie";
import {FoodDashLine} from "./FoodDashLine";
import {FoodDashAvg} from "./FoodDashAvg";

// ------------------------------------------------------------------------------------------------>
export const FoodDash = () => {

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      {Header()}
      {NavBar()}
      {FoodDashBar()}
      {FoodDashPie()}
      {FoodDashLine()}
      {FoodDashAvg()}
    </React.Fragment>
  );
};