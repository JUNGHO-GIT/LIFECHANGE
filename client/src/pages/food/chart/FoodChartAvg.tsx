// FoodChartAvg.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useStorageLocal, useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { FoodAvgKcal, FoodAvgNut } from "@imports/ImportSchemas";
import { axios, handleY } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Select, PopUp } from "@imports/ImportContainers";
import { Div, Img, Br } from "@imports/ImportComponents";
import { Paper, MenuItem, Grid } from "@imports/ImportMuis";
import { FormGroup, FormControlLabel, Switch } from "@imports/ImportMuis";
import { ComposedChart, Bar } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// -------------------------------------------------------------------------------------------------
export const FoodChartAvg = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, chartColors, foodChartArray } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [TYPE, setTYPE] = useStorageLocal(
    "type", "avg", PATH, {
      section: "week",
      line: "kcal",
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(true);
  const [DATE, _setDATE] = useState<any>({
    dateType: "",
    dateStart: getDayFmt(),
    dateEnd: getDayFmt(),
    weekStartFmt: getWeekStartFmt(),
    weekEndFmt: getWeekEndFmt(),
    monthStartFmt: getMonthStartFmt(),
    monthEndFmt: getMonthEndFmt(),
    yearStartFmt: getYearStartFmt(),
    yearEndFmt: getYearEndFmt(),
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT_KCAL_WEEK, setOBJECT_KCAL_WEEK] = useState<any>([FoodAvgKcal]);
  const [OBJECT_NUT_WEEK, setOBJECT_NUT_WEEK] = useState<any>([FoodAvgNut]);
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState<any>([FoodAvgKcal]);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState<any>([FoodAvgNut]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    try {
      const params = {
        user_id: sessionId,
        DATE: DATE,
      };
      const [resWeek, resMonth] = await Promise.all([
        axios.get(`${URL_OBJECT}/chart/avg/week`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/chart/avg/month`, {
          params: params,
        }),
      ]);
      setOBJECT_KCAL_WEEK(
        resWeek.data.result.kcal.length > 0 ? resWeek.data.result.kcal : [FoodAvgKcal]
      );
      setOBJECT_NUT_WEEK(
        resWeek.data.result.nut.length > 0 ? resWeek.data.result.nut : [FoodAvgNut]
      );
      setOBJECT_KCAL_MONTH(
        resMonth.data.result.kcal.length > 0 ? resMonth.data.result.kcal : [FoodAvgKcal]
      );
      setOBJECT_NUT_MONTH(
        resMonth.data.result.nut.length > 0 ? resMonth.data.result.nut : [FoodAvgNut]
      );
    }
    catch (err: any) {
      console.error(err);
    }
    finally {
      setLOADING(false);
    }
  })()}, [URL_OBJECT, DATE, sessionId]);

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartAvg = () => {

    let object = null;
    let endStr = "";
    if (TYPE.section === "week" && TYPE.line === "kcal") {
      object = OBJECT_KCAL_WEEK;
      endStr = "kcal";
    }
    else if (TYPE.section === "week" && TYPE.line === "nut") {
      object = OBJECT_NUT_WEEK;
      endStr = "g";
    }
    else if (TYPE.section === "month" && TYPE.line === "kcal") {
      object = OBJECT_KCAL_MONTH;
      endStr = "kcal";
    }
    else if (TYPE.section === "month" && TYPE.line === "nut") {
      object = OBJECT_NUT_MONTH;
      endStr = "g";
    }

    const {domain, ticks, formatterY} = handleY(object, foodChartArray, "food");
    return (
      <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
        <Grid size={12} className={"d-col-center"}>
          <ResponsiveContainer width={"100%"} height={350}>
            <ComposedChart
              data={object}
              margin={{top: 30, right: 30, bottom: 20, left: 20}}
              barGap={8}
              barCategoryGap={"20%"}
            >
              <CartesianGrid
                strokeDasharray={"3 3"}
                stroke={"#f5f5f5"}
              />
              <XAxis
                type={"category"}
                dataKey={"name"}
                tickLine={false}
                axisLine={false}
                tick={{fill:"#666", fontSize:14}}
                tickFormatter={(value) => (
                  translate(value)
                )}
              />
              <YAxis
                width={30}
                type={"number"}
                domain={domain}
                tickLine={false}
                axisLine={false}
                ticks={ticks}
                tick={{fill: "#666", fontSize: 14}}
                tickFormatter={formatterY}
              />
              {TYPE.line === ("kcal") && (
                <>
                  <Bar
                    dataKey={"kcal"}
                    fill={chartColors[3]}
                    radius={[10, 10, 0, 0]}
                    minPointSize={1}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={400}
                    animationEasing={"linear"}
                  />
                </>
              )}
              {TYPE.line === ("nut") && (
                <>
                  <Bar
                    dataKey={"carb"}
                    fill={chartColors[1]}
                    radius={[10, 10, 0, 0]}
                    minPointSize={1}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={400}
                    animationEasing={"linear"}
                  />
                  <Bar
                    dataKey={"protein"}
                    fill={chartColors[4]}
                    radius={[10, 10, 0, 0]}
                    minPointSize={1}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={400}
                    animationEasing={"linear"}
                  />
                  <Bar
                    dataKey={"fat"}
                    fill={chartColors[2]}
                    radius={[10, 10, 0, 0]}
                    minPointSize={1}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={400}
                    animationEasing={"linear"}
                  />
                </>
              )}
              <Tooltip
                labelFormatter={(_label: any, payload: any) => {
                  const date = payload.length > 0 ? payload[0]?.payload.date : '';
                  return `${date}`;
                }}
                formatter={(value: any, name: any) => {
                  const customName = translate(name);
                  return [`${Number(value).toLocaleString()} ${endStr}`, customName];
                }}
                cursor={{
                  fill:"rgba(0, 0, 0, 0.1)"
                }}
                contentStyle={{
                  borderRadius:"10px",
                  boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                  padding:"10px",
                  border:"none",
                  background:"#fff",
                  color:"#666"
                }}
              />
              <Legend
                iconType={"circle"}
                verticalAlign={"bottom"}
                align={"center"}
                formatter={(value) => {
                  return translate(value);
                }}
                wrapperStyle={{
                  width:"95%",
                  display:"flex",
                  justifyContent:"center",
                  alignItems:"center",
                  fontSize: "0.8rem",
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    );
  };

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleFragment = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-row-center"}>
            <Div className={"fs-1-0rem fw-600"}>
              {translate("chartAvg")}
            </Div>
            <Div className={"fs-1-0rem fw-500 grey ms-10"}>
              {`[${translate(TYPE.line)}]`}
            </Div>
          </Grid>
        </Grid>
      );
      const selectFragment1 = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-row-center"}>
            <Select
              value={TYPE.section}
              onChange={(e: any) => {
                setTYPE((prev: any) => ({
                  ...prev,
                  section: e.target.value,
                }));
              }}
            >
              <MenuItem value={"week"}>{translate("week")}</MenuItem>
              <MenuItem value={"month"}>{translate("month")}</MenuItem>
            </Select>
          </Grid>
        </Grid>
      );
      const selectFragment2 = () => (
        <PopUp
          type={"chart"}
          position={"bottom"}
          direction={"center"}
          contents={
            ["kcal", "nut"]?.map((key: string, index: number) => (
              <FormGroup
                key={index}
                children={
                  <FormControlLabel
                    label={translate(key)}
                    labelPlacement={"start"}
                    control={
                      <Switch
                        checked={TYPE.line === key}
                        onChange={() => {
                          if (TYPE.line === key) {
                            return;
                          }
                          else {
                            setTYPE((prev: any) => ({
                              ...prev,
                              line: key,
                            }));
                          }
                        }}
                      />
                    }
                  />
                }
              />
            ))
          }
          children={(popTrigger: any) => (
            <Img
              max={24}
              hover={true}
              shadow={false}
              radius={false}
              src={"common3_1"}
              onClick={(e: any) => {
                popTrigger.openPopup(e.currentTarget)
              }}
            />
          )}
        />
      );
      return (
        <Grid container spacing={0} columns={12}>
          <Grid size={3} className={"d-row-left"}>
            {selectFragment1()}
          </Grid>
          <Grid size={7} className={"d-row-center"}>
            {titleFragment()}
          </Grid>
          <Grid size={2} className={"d-row-right"}>
            {selectFragment2()}
          </Grid>
        </Grid>
      );
    };
    // 7-2. chart
    const chartSection = () => (
      <Grid container spacing={0} columns={12}>
        <Grid size={12} className={"d-row-center"}>
          {LOADING ? <Loading /> : chartAvg()}
        </Grid>
      </Grid>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min40vh"}>
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-col-center"}>
            {headSection()}
            <Br px={20} />
            {chartSection()}
          </Grid>
        </Grid>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {chartNode()}
    </>
  );
};
