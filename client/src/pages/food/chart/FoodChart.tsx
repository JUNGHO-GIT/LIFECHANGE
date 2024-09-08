// FoodChart.tsx

import { FoodChartPie } from "./FoodChartPie";
import { FoodChartLine } from "./FoodChartLine";
import { FoodChartAvg } from "./FoodChartAvg";

// -------------------------------------------------------------------------------------------------
export const FoodChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {FoodChartPie()}
      {FoodChartLine()}
      {FoodChartAvg()}
    </>
  );
};