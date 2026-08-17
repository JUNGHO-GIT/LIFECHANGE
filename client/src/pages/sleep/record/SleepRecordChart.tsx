/**
 * @file SleepRecordChart.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { memo } from "@exportReacts";
import { useCommonValue, useStorageLocal } from "@exportHooks";
import { useStoreLanguage } from "@exportStores";
import { SleepRecordChartPie } from "./SleepRecordChartPie";
import { SleepRecordChartLine } from "./SleepRecordChartLine";
import { SleepRecordChartAvg } from "./SleepRecordChartAvg";
import { Select } from "@exportContainers";
import { Paper, Grid, Div, Hr } from "@exportComponents";
import { MenuItem } from "@exportMuis";

// -------------------------------------------------------------------------------------------------
export const SleepRecordChart = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { PATH } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [ TYPE_PIE, setTYPE_PIE ] = useStorageLocal(
    `type`, `pie`, PATH, {
      section: `week`,
      line: `bedTime`,
    }
  );
  const [ TYPE_LINE, setTYPE_LINE ] = useStorageLocal(
    `type`, `line`, PATH, {
      section: `week`,
      line: `bedTime`,
    }
  );
  const [ TYPE_AVG, setTYPE_AVG ] = useStorageLocal(
    `type`, `avg`, PATH, {
      section: `week`,
      line: `bedTime`,
    }
  );
  const [ VIEW, setVIEW ] = useStorageLocal(
    `type`, `view`, PATH, {
      metric: `pie`,
    }
  );

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {

    // 7-1. pie
    const pieSection = () => (
      <Grid container={true} spacing={0} className={`w-100p`}>
        <Grid size={12} className={`d-col-center`}>
          <Grid container={true} spacing={1} className={`d-row-between`}>
            <Grid size={4} className={`d-row-center`}>
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
                value={TYPE_PIE.line}
                onChange={(e: any) => {
                  setTYPE_PIE((prev: any) => ({
                    ...prev,
                    line: e.target.value,
                  }));
                }}
              >
                <MenuItem value={`bedTime`}>{translate(`bedTime`)}</MenuItem>
                <MenuItem value={`wakeTime`}>{translate(`wakeTime`)}</MenuItem>
                <MenuItem value={`sleepTime`}>{translate(`sleepTime`)}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Hr m={20} className={`bg-light`} />
        <Grid size={12} className={`d-col-center`}>
          <Div className={`w-100p h-300px`}>
            <SleepRecordChartPie TYPE={TYPE_PIE} setTYPE={setTYPE_PIE} />
          </Div>
        </Grid>
      </Grid>
    );

    // 7-2. line
    const lineSection = () => (
      <Grid container={true} spacing={0} className={`w-100p`}>
        <Grid size={12} className={`d-col-center`}>
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
                <MenuItem value={`bedTime`}>{translate(`bedTime`)}</MenuItem>
                <MenuItem value={`wakeTime`}>{translate(`wakeTime`)}</MenuItem>
                <MenuItem value={`sleepTime`}>{translate(`sleepTime`)}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Hr m={20} className={`bg-light`} />
        <Grid size={12} className={`d-col-center`}>
          <Div className={`w-100p h-300px`}>
            <SleepRecordChartLine TYPE={TYPE_LINE} setTYPE={setTYPE_LINE} />
          </Div>
        </Grid>
      </Grid>
    );

    // 7-3. avg
    const avgSection = () => (
      <Grid container={true} spacing={0} className={`w-100p`}>
        <Grid size={12} className={`d-col-center`}>
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
                <MenuItem value={`bedTime`}>{translate(`bedTime`)}</MenuItem>
                <MenuItem value={`wakeTime`}>{translate(`wakeTime`)}</MenuItem>
                <MenuItem value={`sleepTime`}>{translate(`sleepTime`)}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Hr m={20} className={`bg-light`} />
        <Grid size={12} className={`d-col-center`}>
          <Div className={`w-100p h-300px`}>
            <SleepRecordChartAvg TYPE={TYPE_AVG} setTYPE={setTYPE_AVG} />
          </Div>
        </Grid>
      </Grid>
    );

    // 9. return
    return (
      <Paper className={`w-100p`}>
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
