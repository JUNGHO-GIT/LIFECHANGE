// FoodChart.tsx
// Node -> Section -> Fragment

import { FoodChartBar } from "./FoodChartBar";
import { FoodChartPie } from "./FoodChartPie";
import { FoodChartLine } from "./FoodChartLine";
import { FoodChartAvg } from "./FoodChartAvg";

// -------------------------------------------------------------------------------------------------
export const FoodChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {/* {FoodChartBar()} */}
      {FoodChartPie()}
      {FoodChartLine()}
      {FoodChartAvg()}
    </>
  );
};