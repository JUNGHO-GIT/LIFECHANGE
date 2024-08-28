// FoodChart.jsx
// Node -> Section -> Fragment

import { React } from "../../../imports/ImportReacts.jsx";
import { FoodChartBar } from "./FoodChartBar.jsx";
import { FoodChartPie } from "./FoodChartPie.jsx";
import { FoodChartLine } from "./FoodChartLine.jsx";
import { FoodChartAvg } from "./FoodChartAvg.jsx";
import { Br40 } from "../../../imports/ImportContainers.jsx";

// -------------------------------------------------------------------------------------------------
export const FoodChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {FoodChartBar()}
      {FoodChartPie()}
      {FoodChartLine()}
      {FoodChartAvg()}
    </>
  );
};