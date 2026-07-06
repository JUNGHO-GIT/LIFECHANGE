/**
 * @file ExerciseChart.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { memo } from "@exportReacts";
import { useCommonValue, useStorageLocal } from "@exportHooks";
import { useStoreLanguage } from "@exportStores";
import { ExerciseChartPie } from "./ExerciseChartPie";
import { ExerciseChartLine } from "./ExerciseChartLine";
import { ExerciseChartAvg } from "./ExerciseChartAvg";
import { Select } from "@exportContainers";
import { Paper, Grid, Br } from "@exportComponents";
import { MenuItem } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const ExerciseChart = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { PATH } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [ TYPE_PIE, setTYPE_PIE ] = useStorageLocal(
    `type`, `pie`, PATH, {
      section: `week`,
      line: `part`,
    }
  );
  const [ TYPE_LINE, setTYPE_LINE ] = useStorageLocal(
    `type`, `line`, PATH, {
      section: `week`,
      line: `volume`,
    }
  );
  const [ TYPE_AVG, setTYPE_AVG ] = useStorageLocal(
    `type`, `avg`, PATH, {
      section: `week`,
      line: `volume`
    }
  );
  const [ VIEW, setVIEW ] = useStorageLocal(
    `type`, `view`, PATH, {
      metric: `pie`,
    }
  );

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    const TYPE_PIE_SAFE: any = {
      ...TYPE_PIE,
      line: TYPE_PIE.line === `title` ? `title` : `part`,
    };

    // 7-1. pie
    const pieSection = () => (
      <Grid container={true} spacing={0} className={`w-100p radius-3 border-light-1 shadow-1`}>
        <Grid size={12} className={`d-col-center p-10px radius-top-2 border-bottom-1 shadow-0`}>
          <Grid container={true} spacing={1} className={`d-row-between`}>
            <Grid size={4} className={`d-row-center`}>
              <Select
                value={TYPE_PIE_SAFE.section ?? `week`}
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
            <Grid size={4} className={`d-row-center`}>
              <Select
                value={VIEW.metric ?? `pie`}
                onChange={(e: any) => {
                  setVIEW((prev: any) => ({
                    ...prev,
                    metric: e.target.value,
                  }));
                }}
              >
                <MenuItem value={`pie`}>{translate(`chartPie`)}</MenuItem>
                <MenuItem value={`line`}>{translate(`chartLine`)}</MenuItem>
                <MenuItem value={`avg`}>{translate(`chartAvg`)}</MenuItem>
              </Select>
            </Grid>
            <Grid size={4} className={`d-row-center`}>
              <Select
                value={TYPE_PIE_SAFE.line}
                onChange={(e: any) => {
                  setTYPE_PIE((prev: any) => ({
                    ...prev,
                    line: e.target.value,
                  }));
                }}
              >
                <MenuItem value={`part`}>{translate(`part`)}</MenuItem>
                <MenuItem value={`title`}>{translate(`title`)}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12} className={`d-col-center p-5px h-max-60vh`}>
          <ExerciseChartPie TYPE={TYPE_PIE_SAFE} setTYPE={setTYPE_PIE} />
        </Grid>
      </Grid>
    );

    // 7-2. line
    const lineSection = () => (
      <Grid container={true} spacing={0} className={`w-100p radius-3 border-light-1 shadow-1`}>
        <Grid size={12} className={`d-col-center p-10px radius-top-3 border-bottom-1 shadow-0`}>
          <Grid container={true} spacing={1} className={`d-row-between`}>
            <Grid size={4} className={`d-row-center`}>
              <Select
                value={TYPE_LINE.section ?? `week`}
                onChange={(e: any) => {
                  setTYPE_LINE((prev: any) => ({
                    ...prev,
                    section: e.target.value,
                  }));
                }}
              >
                <MenuItem value={`week`}>{translate(`week`)}</MenuItem>
                <MenuItem value={`month`}>{translate(`month`)}</MenuItem>
              </Select>
            </Grid>
            <Grid size={4} className={`d-row-center`}>
              <Select
                value={VIEW.metric ?? `pie`}
                onChange={(e: any) => {
                  setVIEW((prev: any) => ({
                    ...prev,
                    metric: e.target.value,
                  }));
                }}
              >
                <MenuItem value={`pie`}>{translate(`chartPie`)}</MenuItem>
                <MenuItem value={`line`}>{translate(`chartLine`)}</MenuItem>
                <MenuItem value={`avg`}>{translate(`chartAvg`)}</MenuItem>
              </Select>
            </Grid>
            <Grid size={4} className={`d-row-center`}>
              <Select
                value={TYPE_LINE.line}
                onChange={(e: any) => {
                  setTYPE_LINE((prev: any) => ({
                    ...prev,
                    line: e.target.value,
                  }));
                }}
              >
                <MenuItem value={`volume`}>{translate(`volume`)}</MenuItem>
                <MenuItem value={`cardio`}>{translate(`cardio`)}</MenuItem>
                <MenuItem value={`scale`}>{translate(`scale`)}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12} className={`d-col-center p-5px h-max-60vh`}>
          <ExerciseChartLine TYPE={TYPE_LINE} setTYPE={setTYPE_LINE} />
        </Grid>
      </Grid>
    );

    // 7-3. avg
    const avgSection = () => (
      <Grid container={true} spacing={0} className={`w-100p radius-3 border-light-1 shadow-1`}>
        <Grid size={12} className={`d-col-center p-10px radius-top-3 border-bottom-1 shadow-0`}>
          <Grid container={true} spacing={1} className={`d-row-between`}>
            <Grid size={4} className={`d-row-center`}>
              <Select
                value={TYPE_AVG.section ?? `week`}
                onChange={(e: any) => {
                  setTYPE_AVG((prev: any) => ({
                    ...prev,
                    section: e.target.value,
                  }));
                }}
              >
                <MenuItem value={`week`}>{translate(`week`)}</MenuItem>
                <MenuItem value={`month`}>{translate(`month`)}</MenuItem>
              </Select>
            </Grid>
            <Grid size={4} className={`d-row-center`}>
              <Select
                value={VIEW.metric ?? `pie`}
                onChange={(e: any) => {
                  setVIEW((prev: any) => ({
                    ...prev,
                    metric: e.target.value,
                  }));
                }}
              >
                <MenuItem value={`pie`}>{translate(`chartPie`)}</MenuItem>
                <MenuItem value={`line`}>{translate(`chartLine`)}</MenuItem>
                <MenuItem value={`avg`}>{translate(`chartAvg`)}</MenuItem>
              </Select>
            </Grid>
            <Grid size={4} className={`d-row-center`}>
              <Select
                value={TYPE_AVG.line}
                onChange={(e: any) => {
                  setTYPE_AVG((prev: any) => ({
                    ...prev,
                    line: e.target.value,
                  }));
                }}
              >
                <MenuItem value={`volume`}>{translate(`volume`)}</MenuItem>
                <MenuItem value={`cardio`}>{translate(`cardio`)}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12} className={`d-col-center p-5px h-max-60vh`}>
          <ExerciseChartAvg TYPE={TYPE_AVG} setTYPE={setTYPE_AVG} />
        </Grid>
      </Grid>
    );

    // 9. return
    return (
      <Paper className={`w-100p radius-3 border-light-1 shadow-1 p-20px`}>
        {VIEW.metric === `pie` && pieSection()}
        {VIEW.metric === `line` && lineSection()}
        {VIEW.metric === `avg` && avgSection()}
      </Paper>
    );
  };

  // 10. return ----------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
});
