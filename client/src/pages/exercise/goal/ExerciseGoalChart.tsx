/**
 * @file ExerciseGoalChart.tsx
 * @description exercise goal and record pie comparison
 * @author Jungho
 * @since 2026-08-17
 */

import { memo } from "@exportReacts";
import { useCommonValue, useStorageLocal } from "@exportHooks";
import { useStoreLanguage } from "@exportStores";
import { ExerciseGoalChartPie } from "./ExerciseGoalChartPie";
import { Select } from "@exportContainers";
import { Grid, Hr } from "@exportComponents";
import { MenuItem } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
declare interface ExerciseGoalChartProps {
  DATE?: any;
}

// -------------------------------------------------------------------------------------------------
export const ExerciseGoalChart = memo((props: ExerciseGoalChartProps) => {

  // 1. common ----------------------------------------------------------------------------------
  const { PATH } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [ TYPE_PIE, setTYPE_PIE ] = useStorageLocal(
    `type`, `pie`, PATH, {
      section: `week`,
      metricKey: `count`,
    }
  );

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => (
    <Grid container={true} spacing={0} className={`w-100p`}>
      <Grid size={6} className={`d-row-center`}>
        <Select
          value={TYPE_PIE.section ?? `week`}
          onChange={(e: any) => {
            setTYPE_PIE((prev: any) => ({
              ...prev,
              section: e.target.value,
            }));
          }}
        >
          <MenuItem value={`week`}>{translate(`week`)}</MenuItem>
          <MenuItem value={`month`}>{translate(`month`)}</MenuItem>
          <MenuItem value={`year`}>{translate(`year`)}</MenuItem>
        </Select>
      </Grid>
      <Grid size={6} className={`d-row-center`}>
        <Select
          value={TYPE_PIE.metricKey ?? `count`}
          onChange={(e: any) => {
            setTYPE_PIE((prev: any) => ({
              ...prev,
              metricKey: e.target.value,
            }));
          }}
        >
          <MenuItem value={`count`}>{translate(`count`)}</MenuItem>
          <MenuItem value={`volume`}>{translate(`volume`)}</MenuItem>
          <MenuItem value={`cardio`}>{translate(`cardio`)}</MenuItem>
          <MenuItem value={`scale`}>{translate(`scale`)}</MenuItem>
        </Select>
      </Grid>
      <Hr m={20} className={`bg-light`} />
      <ExerciseGoalChartPie TYPE={TYPE_PIE} setTYPE={setTYPE_PIE} DATE={props?.DATE} />
    </Grid>
  );

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
});
