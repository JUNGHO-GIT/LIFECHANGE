// FoodChart.tsx

import { memo, useState, useEffect } from "@importReacts";
import { useCommonValue, useStorageLocal } from "@importHooks";
import { useStoreLanguage } from "@importStores";
import { FoodChartPie } from "./FoodChartPie";
import { FoodChartLine } from "./FoodChartLine";
import { FoodChartAvg } from "./FoodChartAvg";
import { Select } from "@importContainers";
import { Br, Paper, Grid } from "@importComponents";
import { MenuItem } from "@importMuis";

// -------------------------------------------------------------------------------------------------
export const FoodChart = memo(() => {

  // 1. common ----------------------------------------------------------------------------------
  const { PATH } = useCommonValue();
  const { translate } = useStoreLanguage();

  // 2-1. useStorageLocal -----------------------------------------------------------------------
  const [TYPE_PIE, setTYPE_PIE] = useStorageLocal(
    "type", "pie", PATH, {
      section: "week",
      line: "kcal",
    }
  );
  const [TYPE_LINE, setTYPE_LINE] = useStorageLocal(
    "type", "line", PATH, {
      section: "week",
      line: "kcal",
    }
  );
  const [TYPE_AVG, setTYPE_AVG] = useStorageLocal(
    "type", "avg", PATH, {
      section: "week",
      line: "kcal",
    }
  );

  // 2-2. useState ------------------------------------------------------------------------------
  const [curView, setCurView] = useState("pie");
  const [curSection, setCurSection] = useState(TYPE_PIE.section || "week");
  const [curSetType, setCurSetType] = useState(() => setTYPE_PIE);
  const [curValue, setCurValue] = useState(TYPE_PIE.line || "kcal");

  // 3. useEffect -------------------------------------------------------------------------------
  useEffect(() => {
    if (curView === "pie") {
      setCurSetType(() => setTYPE_PIE);
      setCurSection(TYPE_PIE.section || "week");
      setCurValue(TYPE_PIE.line || "kcal");
    } else if (curView === "line") {
      setCurSetType(() => setTYPE_LINE);
      setCurSection(TYPE_LINE.section || "week");
      setCurValue(TYPE_LINE.line || "kcal");
    } else if (curView === "avg") {
      setCurSetType(() => setTYPE_AVG);
      setCurSection(TYPE_AVG.section || "week");
      setCurValue(TYPE_AVG.line || "kcal");
    }
  }, [curView, TYPE_PIE, TYPE_LINE, TYPE_AVG]);

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    const headSection = () => (
      <Grid container={true} spacing={2} className={"d-row-between"}>
        <Grid size={4} className={"d-row-center"}>
          <Select
            value={curSection}
            onChange={(e: any) => {
              setCurSection(e.target.value);
              curSetType((prev: any) => ({
                ...prev,
                section: e.target.value,
              }));
            }}
          >
            <MenuItem value={"week"}>{translate("week")}</MenuItem>
            <MenuItem value={"month"}>{translate("month")}</MenuItem>
            {curView === "pie" && <MenuItem value={"year"}>{translate("year")}</MenuItem>}
          </Select>
        </Grid>
        <Grid size={4} className={"d-row-center"}>
          <Select
            value={curView}
            onChange={(e: any) => {
              setCurView(e.target.value);
            }}
          >
            <MenuItem value={"pie"}>{translate("chartPie")}</MenuItem>
            <MenuItem value={"line"}>{translate("chartLine")}</MenuItem>
            <MenuItem value={"avg"}>{translate("chartAvg")}</MenuItem>
          </Select>
        </Grid>
        <Grid size={4} className={"d-row-center"}>
          <Select
            value={curValue}
            onChange={(e: any) => {
              setCurValue(e.target.value);
              curSetType((prev: any) => ({
                ...prev,
                line: e.target.value,
              }));
            }}
          >
            <MenuItem value={"kcal"}>{translate("kcal")}</MenuItem>
            <MenuItem value={"nut"}>{translate("nut")}</MenuItem>
          </Select>
        </Grid>
      </Grid>
    );
    return (
      <Paper className={"content-wrapper radius-2 border-1 shadow-1 h-min-40vh"}>
        <Grid container={true} spacing={2} className={"border-0 radius-0"}>
          <Grid size={12} className={"d-col-center p-0px"}>
            {headSection()}
          </Grid>
        </Grid>
        <Br m={10} />
        <Grid container={true} spacing={2} className={"border-1 radius-2"}>
          <Grid size={12} className={"d-col-center p-5px"}>
            {curView === "pie" && <FoodChartPie TYPE={TYPE_PIE} setTYPE={setTYPE_PIE} />}
            {curView === "line" && <FoodChartLine TYPE={TYPE_LINE} setTYPE={setTYPE_LINE} />}
            {curView === "avg" && <FoodChartAvg TYPE={TYPE_AVG} setTYPE={setTYPE_AVG} />}
          </Grid>
        </Grid>
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