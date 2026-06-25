/**
 * @file FoodChart.tsx
 * @description foo
 * @author Jungho
 * @since 2025-12-26
 */

import { memo } from "@exportReacts";
import { useCommonValue, useStorageLocal } from "@exportHooks";
import { useStoreLanguage } from "@exportStores";
import { FoodChartPie } from "./FoodChartPie";
import { FoodChartLine } from "./FoodChartLine";
import { FoodChartAvg } from "./FoodChartAvg";
import { Select } from "@exportContainers";
import { Paper, Grid, Br } from "@exportComponents";
import { MenuItem } from "@exportMuis";

// ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
export const FoodChart = memo(() => {

  // 1. common ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const { PATH } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 2-1. useStorageLocal ―――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const [ TYPE_PIE, setTYPE_PIE ] = useStorageLocal(
    `type`, `pie`, PATH, {
      section: `week`,
      line: `kcal`,
    }
  );
  const [ TYPE_LINE, setTYPE_LINE ] = useStorageLocal(
    `type`, `line`, PATH, {
      section: `week`,
      line: `kcal`,
    }
  );
  const [ TYPE_AVG, setTYPE_AVG ] = useStorageLocal(
    `type`, `avg`, PATH, {
      section: `week`,
      line: `kcal`,
    }
  );

  // 7. chart ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  const chartNode = () => {

    // 7-1. pie
    const pieSection = () => (
      <Grid container={true} spacing={0} className={`w-100p border-1 radius-2 shadow-1`}>
        <Grid size={12} className={`d-col-center p-10px border-bottom-1 radius-top-2 shadow-bottom-2`}>
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
            <Grid size={4} className={`d-row-center fs-1-1rem fw-bolder`}>
              {translate(`chartPie`)}
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
                <MenuItem value={`kcal`}>{translate(`kcal`)}</MenuItem>
                <MenuItem value={`nut`}>{translate(`nut`)}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12} className={`d-col-center p-5px h-max-60vh`}>
          <FoodChartPie TYPE={TYPE_PIE} setTYPE={setTYPE_PIE} />
        </Grid>
      </Grid>
    );

    // 7-2. line
    const lineSection = () => (
      <Grid container={true} spacing={0} className={`w-100p border-1 radius-2 shadow-1`}>
        <Grid size={12} className={`d-col-center p-10px border-bottom-1 radius-top-2 shadow-bottom-2`}>
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
            <Grid size={4} className={`d-row-center fs-1-1rem fw-bolder`}>
              {translate(`chartLine`)}
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
                <MenuItem value={`kcal`}>{translate(`kcal`)}</MenuItem>
                <MenuItem value={`nut`}>{translate(`nut`)}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12} className={`d-col-center p-5px h-max-60vh`}>
          <FoodChartLine TYPE={TYPE_LINE} setTYPE={setTYPE_LINE} />
        </Grid>
      </Grid>
    );

    // 7-3. avg
    const avgSection = () => (
      <Grid container={true} spacing={0} className={`w-100p border-1 radius-2 shadow-1`}>
        <Grid size={12} className={`d-col-center p-10px border-bottom-1 radius-top-2 shadow-bottom-2`}>
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
            <Grid size={4} className={`d-row-center fs-1-1rem fw-bolder`}>
              {translate(`chartAvg`)}
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
                <MenuItem value={`kcal`}>{translate(`kcal`)}</MenuItem>
                <MenuItem value={`nut`}>{translate(`nut`)}</MenuItem>
              </Select>
            </Grid>
          </Grid>
        </Grid>
        <Grid size={12} className={`d-col-center p-5px h-max-60vh`}>
          <FoodChartAvg TYPE={TYPE_AVG} setTYPE={setTYPE_AVG} />
        </Grid>
      </Grid>
    );

    // 9. return
    return (
      <Paper className={`w-100p radius-2 border-1 shadow-1 p-20px`}>
        {pieSection()}
        <Br m={30} />
        {lineSection()}
        <Br m={30} />
        {avgSection()}
      </Paper>
    );
  };

  // 10. return ――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――――
  return (
    <>
      {chartNode()}
    </>
  );
});
