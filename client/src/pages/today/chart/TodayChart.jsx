// TodayChart.jsx
// Node -> Section -> Fragment

import { TodayChartExercise } from "./TodayChartExercise.jsx";
import { TodayChartFood } from "./TodayChartFood.jsx";
import { TodayChartMoney } from "./TodayChartMoney.jsx";
import { TodayChartSleep } from "./TodayChartSleep.jsx";

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