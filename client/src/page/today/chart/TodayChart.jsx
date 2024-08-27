// TodayChart.jsx
// Node -> Section -> Fragment

import { React } from "../../../import/ImportReacts.jsx";
import { TodayChartExercise } from "./TodayChartExercise.jsx";
import { TodayChartFood } from "./TodayChartFood.jsx";
import { TodayChartMoney } from "./TodayChartMoney.jsx";
import { TodayChartSleep } from "./TodayChartSleep.jsx";
import { Br40 } from "../../../import/ImportComponents.jsx";

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