// ExerciseChartAvg.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useStorageLocal, useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { ExerciseAvgVolume, ExerciseAvgCardio } from "@imports/ImportSchemas";
import { axios, handleY } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Select, PopUp } from "@imports/ImportContainers";
import { Div, Img, Br } from "@imports/ImportComponents";
import { Paper, MenuItem, Grid } from "@imports/ImportMuis";
import { FormGroup, FormControlLabel, Switch } from "@imports/ImportMuis";
import { ComposedChart, Bar } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// -------------------------------------------------------------------------------------------------
export const ExerciseChartAvg = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, sessionId, chartColors, exerciseChartArray } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [TYPE, setTYPE] = useStorageLocal(
    "type", "avg", PATH, {
      section: "week",
      line: "volume"
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
  const [OBJECT_VOLUME_WEEK, setOBJECT_VOLUME_WEEK] = useState<any>([ExerciseAvgVolume]);
  const [OBJECT_CARDIO_WEEK, setOBJECT_CARDIO_WEEK] = useState<any>([ExerciseAvgCardio]);
  const [OBJECT_VOLUME_MONTH, setOBJECT_VOLUME_MONTH] = useState<any>([ExerciseAvgVolume]);
  const [OBJECT_CARDIO_MONTH, setOBJECT_CARDIO_MONTH] = useState<any>([ExerciseAvgCardio]);

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
      setOBJECT_VOLUME_WEEK(
        resWeek.data.result.volume.length > 0 ? resWeek.data.result.volume : [ExerciseAvgVolume]
      );
      setOBJECT_CARDIO_WEEK(
        resWeek.data.result.cardio.length > 0 ? resWeek.data.result.cardio : [ExerciseAvgCardio]
      );
      setOBJECT_VOLUME_MONTH(
        resMonth.data.result.volume.length > 0 ? resMonth.data.result.volume : [ExerciseAvgVolume]
      );
      setOBJECT_CARDIO_MONTH(
        resMonth.data.result.cardio.length > 0 ? resMonth.data.result.cardio : [ExerciseAvgCardio]
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
    if (TYPE.section === "week" && TYPE.line === "volume") {
      object = OBJECT_VOLUME_WEEK;
      endStr = "vol";
    }
    else if (TYPE.section === "week" && TYPE.line === "cardio") {
      object = OBJECT_CARDIO_WEEK;
      endStr = "hr";
    }
    else if (TYPE.section === "month" && TYPE.line === "volume") {
      object = OBJECT_VOLUME_MONTH;
      endStr = "vol";
    }
    else if (TYPE.section === "month" && TYPE.line === "cardio") {
      object = OBJECT_CARDIO_MONTH;
      endStr = "hr";
    }

    const {domain, ticks, formatterY} = handleY(object, exerciseChartArray, "exercise");
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
              {TYPE.line === ("volume") && (
                <>
                  <Bar
                    dataKey={"volume"}
                    fill={chartColors[1]}
                    radius={[10, 10, 0, 0]}
                    minPointSize={1}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={400}
                    animationEasing={"linear"}
                  />
                </>
              )}
              {TYPE.line === ("cardio") && (
                <>
                  <Bar
                    dataKey={"cardio"}
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
            ["volume", "cardio"]?.map((key: string, index: number) => (
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
        >
          {(popTrigger: any) => (
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
        </PopUp>
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