// FoodChartPie.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreLoading } from "@importHooks";
import { FoodPie } from "@importSchemas";
import { axios } from "@importLibs";
import { Select, PopUp } from "@importContainers";
import { Div, Img, Br } from "@importComponents";
import { Paper, MenuItem, Grid, Card } from "@importMuis";
import { FormGroup, FormControlLabel, Switch } from "@importMuis";
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
export const FoodChartPie = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, chartColors, sessionId } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [TYPE, setTYPE] = useStorageLocal(
    "type", "pie", PATH, {
      section: "week",
      line: "kcal",
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
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
  const [OBJECT_KCAL_WEEK, setOBJECT_KCAL_WEEK] = useState<any>([FoodPie]);
  const [OBJECT_NUT_WEEK, setOBJECT_NUT_WEEK] = useState<any>([FoodPie]);
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState<any>([FoodPie]);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState<any>([FoodPie]);
  const [OBJECT_KCAL_YEAR, setOBJECT_KCAL_YEAR] = useState<any>([FoodPie]);
  const [OBJECT_NUT_YEAR, setOBJECT_NUT_YEAR] = useState<any>([FoodPie]);

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
      setOBJECT_KCAL_WEEK(
        resWeek.data.result.kcal.length > 0 ? resWeek.data.result.kcal : [FoodPie]
      );
      setOBJECT_NUT_WEEK(
        resWeek.data.result.nut.length > 0 ? resWeek.data.result.nut : [FoodPie]
      );
      setOBJECT_KCAL_MONTH(
        resMonth.data.result.kcal.length > 0 ? resMonth.data.result.kcal : [FoodPie]
      );
      setOBJECT_NUT_MONTH(
        resMonth.data.result.nut.length > 0 ? resMonth.data.result.nut : [FoodPie]
      );
      setOBJECT_KCAL_YEAR(
        resYear.data.result.kcal.length > 0 ? resYear.data.result.kcal : [FoodPie]
      );
      setOBJECT_NUT_YEAR(
        resYear.data.result.nut.length > 0 ? resYear.data.result.nut : [FoodPie]
      );
    }
    catch (err: any) {
      console.error(err);
    }
  })()}, [URL_OBJECT, DATE, sessionId]);

  // 4-1. render -----------------------------------------------------------------------------------
  const renderPie = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {

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
    else if (TYPE.section === "year" && TYPE.line === "kcal") {
      object = OBJECT_KCAL_YEAR;
      endStr = "kcal";
    }
    else if (TYPE.section === "year" && TYPE.line === "nut") {
      object = OBJECT_NUT_YEAR;
      endStr = "g";
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
    else if (TYPE.section === "year" && TYPE.line === "kcal") {
      object = OBJECT_KCAL_YEAR;
      endStr = "kcal";
    }
    else if (TYPE.section === "year" && TYPE.line === "nut") {
      object = OBJECT_NUT_YEAR;
      endStr = "g";
    }

    return (
      <Grid container={true} spacing={2} className={"border-1 radius-2"}>
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
              {`[${translate(TYPE.line)}]`}
            </Div>
          </Grid>
          <Grid size={3} className={"d-row-center"}>
            <PopUp
              type={"chart"}
              position={"bottom"}
              direction={"center"}
              contents={
                ["kcal", "nut"]?.map((key: string, index: number) => (
                  <FormGroup key={index} children={
                    <FormControlLabel label={translate(key)} labelPlacement={"start"} control={
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
                  src={"common3_1.webp"}
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
        <Card className={"d-col-center border-0 shadow-0 radius-0"}>
          {headFragment()}
        </Card>
      );
    };
    // 7-2. chart
    const chartSection = () => (
      <Card className={"d-col-center border-0 shadow-0 radius-0"}>
        {chartPie()}
      </Card>
    );
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min40vh"}>
        {headSection()}
        <Br m={20} />
        {chartSection()}
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
