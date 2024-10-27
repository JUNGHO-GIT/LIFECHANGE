// ExerciseChart.tsx

import { ExerciseChartPie } from "./ExerciseChartPie";
import { ExerciseChartLine } from "./ExerciseChartLine";
import { ExerciseChartAvg } from "./ExerciseChartAvg";

// -------------------------------------------------------------------------------------------------
export const ExerciseChart = () => (
  <>
    {ExerciseChartPie()}
    {ExerciseChartLine()}
    {ExerciseChartAvg()}
  </>
);
