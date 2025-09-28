// ExerciseChart.tsx

import { memo } from "@importReacts";
import { ExerciseChartPie } from "./ExerciseChartPie";
import { ExerciseChartLine } from "./ExerciseChartLine";
import { ExerciseChartAvg } from "./ExerciseChartAvg";

// -------------------------------------------------------------------------------------------------
export const ExerciseChart = memo(() => (
  <>
    <ExerciseChartPie />
    <ExerciseChartLine />
    <ExerciseChartAvg />
  </>
));
