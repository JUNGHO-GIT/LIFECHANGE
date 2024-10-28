// ExerciseChartPie.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useStorageLocal, useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { ExercisePie } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Select, PopUp } from "@imports/ImportContainers";
import { Div, Img, Br } from "@imports/ImportComponents";
import { Paper, MenuItem, Grid, Card } from "@imports/ImportMuis";
import { FormGroup, FormControlLabel, Switch } from "@imports/ImportMuis";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts";

// -------------------------------------------------------------------------------------------------
declare type PieProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  index: number;
}

// -------------------------------------------------------------------------------------------------
export const ExerciseChartPie = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, chartColors, sessionId } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [TYPE, setTYPE] = useStorageLocal(
    "type", "pie", PATH, {
      section: "week",
      line: "part",
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
  const [OBJECT_PART_WEEK, setOBJECT_PART_WEEK] = useState<any>([ExercisePie]);
  const [OBJECT_TITLE_WEEK, setOBJECT_TITLE_WEEK] = useState<any>([ExercisePie]);
  const [OBJECT_PART_MONTH, setOBJECT_PART_MONTH] = useState<any>([ExercisePie]);
  const [OBJECT_TITLE_MONTH, setOBJECT_TITLE_MONTH] = useState<any>([ExercisePie]);
  const [OBJECT_PART_YEAR, setOBJECT_PART_YEAR] = useState<any>([ExercisePie]);
  const [OBJECT_TITLE_YEAR, setOBJECT_TITLE_YEAR] = useState<any>([ExercisePie]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    try {
      const params = {
        user_id: sessionId,
        DATE: DATE,
      };
      const [resWeek, resMonth, resYear] = await Promise.all([
        axios.get(`${URL_OBJECT}/chart/pie/week`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/chart/pie/month`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/chart/pie/year`, {
          params: params,
        }),
      ]);
      setOBJECT_PART_WEEK(
        resWeek.data.result.part.length > 0 ? resWeek.data.result.part : [ExercisePie]
      );
      setOBJECT_TITLE_WEEK(
        resWeek.data.result.title.length > 0 ? resWeek.data.result.title : [ExercisePie]
      );
      setOBJECT_PART_MONTH(
        resMonth.data.result.part.length > 0 ? resMonth.data.result.part : [ExercisePie]
      );
      setOBJECT_TITLE_MONTH(
        resMonth.data.result.title.length > 0 ? resMonth.data.result.title : [ExercisePie]
      );
      setOBJECT_PART_YEAR(
        resYear.data.result.part.length > 0 ? resYear.data.result.part : [ExercisePie]
      );
      setOBJECT_TITLE_YEAR(
        resYear.data.result.title.length > 0 ? resYear.data.result.title : [ExercisePie]
      );
    }
    catch (err: any) {
      console.error(err);
    }
    finally {
      setLOADING(false);
    }
  })()}, [URL_OBJECT, DATE, sessionId]);

  // 4-1. render -----------------------------------------------------------------------------------
  const renderPie = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {

    let object = null;
    let endStr = "";
    if (TYPE.section === "week" && TYPE.line === "part") {
      object = OBJECT_PART_WEEK;
      endStr = "%";
    }
    else if (TYPE.section === "week" && TYPE.line === "title") {
      object = OBJECT_TITLE_WEEK;
      endStr = "%";
    }
    else if (TYPE.section === "month" && TYPE.line === "part") {
      object = OBJECT_PART_MONTH;
      endStr = "%";
    }
    else if (TYPE.section === "month" && TYPE.line === "title") {
      object = OBJECT_TITLE_MONTH;
      endStr = "%";
    }
    else if (TYPE.section === "year" && TYPE.line === "part") {
      object = OBJECT_PART_YEAR;
      endStr = "%";
    }
    else if (TYPE.section === "year" && TYPE.line === "title") {
      object = OBJECT_TITLE_YEAR;
      endStr = "%";
    }

    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill={"white"}
        textAnchor={"middle"}
        dominantBaseline={"central"}
        className={"fs-0-6rem"}
      >
        <tspan x={x} dy={"-0.5em"} dx={"0.4em"}>
          {translate(object[index]?.name)}
        </tspan>
        <tspan x={x} dy={"1.4em"} dx={"0.4em"}>
          {`${Number(value).toLocaleString()} ${endStr}`}
        </tspan>
      </text>
    );
  };

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartPie = () => {

    let object = null;
    let endStr = "";
    if (TYPE.section === "week" && TYPE.line === "part") {
      object = OBJECT_PART_WEEK;
      endStr = "%";
    }
    else if (TYPE.section === "week" && TYPE.line === "title") {
      object = OBJECT_TITLE_WEEK;
      endStr = "%";
    }
    else if (TYPE.section === "month" && TYPE.line === "part") {
      object = OBJECT_PART_MONTH;
      endStr = "%";
    }
    else if (TYPE.section === "month" && TYPE.line === "title") {
      object = OBJECT_TITLE_MONTH;
      endStr = "%";
    }
    else if (TYPE.section === "year" && TYPE.line === "part") {
      object = OBJECT_PART_YEAR;
      endStr = "%";
    }
    else if (TYPE.section === "year" && TYPE.line === "title") {
      object = OBJECT_TITLE_YEAR;
      endStr = "%";
    }

    return (
      <Grid container={true} spacing={2} className={"border-1 radius-1"}>
        <Grid size={12} className={"d-col-center"}>
          <ResponsiveContainer width={"100%"} height={350}>
            <PieChart margin={{top: 40, right: 20, bottom: 20, left: 20}}>
              <Pie
                data={object}
                cx={"50%"}
                cy={"50%"}
                label={renderPie}
                labelLine={false}
                outerRadius={110}
                fill={"#8884d8"}
                dataKey={"value"}
                isAnimationActive={true}
                animationBegin={0}
                animationDuration={400}
                animationEasing={"linear"}
              >
                {object?.map((_entry: any, index: number) => (
                  <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: any, name: any) => {
                  const customName = translate(name);
                  return [`${Number(value).toLocaleString()} ${endStr}`, customName];
                }}
                contentStyle={{
                  backgroundColor:"rgba(255, 255, 255, 0.8)",
                  border:"none",
                  borderRadius:"10px"
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
                  lineHeight:"40px",
                  paddingTop:"40px",
                  fontSize:"12px"
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Grid>
      </Grid>
    );
  };

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const headFragment = () => (
        <Grid container={true} spacing={2}>
          <Grid size={3} className={"d-row-center"}>
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
              <MenuItem value={"year"}>{translate("year")}</MenuItem>
            </Select>
          </Grid>
          <Grid size={6} className={"d-row-center"}>
            <Div className={"fs-1-0rem fw-600"}>
              {translate("chartPie")}
            </Div>
            <Div className={"fs-1-0rem fw-500 grey ms-10"}>
              {`[${translate(`exercise${TYPE.line.charAt(0).toUpperCase() + TYPE.line.slice(1)}`)}]`}
            </Div>
          </Grid>
          <Grid size={3} className={"d-row-center"}>
            <PopUp
              type={"chart"}
              position={"bottom"}
              direction={"center"}
              contents={
                ["part", "title"]?.map((key: string, index: number) => (
                  <FormGroup key={index} children={
                    <FormControlLabel label={translate(`exercise${key.charAt(0).toUpperCase() + key.slice(1)}`)} labelPlacement={"start"} control={
                      <Switch checked={TYPE.line === key} onChange={() => {
                        if (TYPE.line === key) {
                          return;
                        }
                        else {
                          setTYPE((prev: any) => ({
                            ...prev,
                            line: key,
                          }));
                        }
                      }}/>
                    }/>
                  }/>
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
          </Grid>
        </Grid>
      );
      return (
        <Card className={"d-col-center"}>
          {headFragment()}
        </Card>
      );
    };
    // 7-2. chart
    const chartSection = () => (
      <Card className={"d-col-center"}>
        {chartPie()}
      </Card>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min40vh"}>
        {headSection()}
        <Br px={20} />
        {LOADING ? <Loading /> : chartSection()}
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
