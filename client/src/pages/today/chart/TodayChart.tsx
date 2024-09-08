// TodayChart.tsx

import { TodayChartExercise } from "./TodayChartExercise";
import { TodayChartFood } from "./TodayChartFood";
import { TodayChartMoney } from "./TodayChartMoney";
import { TodayChartSleep } from "./TodayChartSleep";

// -------------------------------------------------------------------------------------------------
export const TodayChart = () => {

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {TodayChartExercise()}
      {TodayChartFood()}
      {TodayChartMoney()}
      {TodayChartSleep()}
    </>
  );
};