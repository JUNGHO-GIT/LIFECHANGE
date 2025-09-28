// FoodChart.tsx

import { memo } from "@importReacts";
import { FoodChartPie } from "./FoodChartPie";
import { FoodChartLine } from "./FoodChartLine";
import { FoodChartAvg } from "./FoodChartAvg";

// -------------------------------------------------------------------------------------------------
export const FoodChart = memo(() => (
  <>
    <FoodChartPie />
    <FoodChartLine />
    <FoodChartAvg />
  </>
));