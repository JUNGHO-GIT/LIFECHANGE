// FoodDash.jsx

import {React} from "../../../import/ImportReacts.jsx";
import {FoodDashBar} from "./FoodDashBar.jsx";
import {FoodDashPie} from "./FoodDashPie.jsx";
import {FoodDashLine} from "./FoodDashLine.jsx";
import {FoodDashAvg} from "./FoodDashAvg.jsx";

// ------------------------------------------------------------------------------------------------>
export const FoodDash = () => {

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {FoodDashBar()}
      {FoodDashPie()}
      {FoodDashLine()}
      {FoodDashAvg()}
    </>
  );
};