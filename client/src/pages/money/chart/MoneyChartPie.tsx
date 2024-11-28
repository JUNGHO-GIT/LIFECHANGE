// MoneyChartPie.tsx

import { useState, useEffect } from "@importReacts";
import { useCommonValue, useCommonDate, useStorageLocal } from "@importHooks";
import { useStoreLanguage, useStoreLoading, useStoreAlert } from "@importStores";
import { MoneyPie } from "@importSchemas";
import { axios } from "@importLibs";
import { PopUp, Select } from "@importContainers";
import { Div, Img, Br, Paper, Card, Grid } from "@importComponents";
import { FormGroup, FormControlLabel, Switch, MenuItem } from "@importMuis";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// -------------------------------------------------------------------------------------------------
declare type PieProps = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  index: number;
};

// -------------------------------------------------------------------------------------------------
export const MoneyChartPie = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, PATH, chartColors, sessionId } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useStoreLanguage();
  const { setALERT } = useStoreAlert();
  const { setLOADING } = useStoreLoading();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [TYPE, setTYPE] = useStorageLocal(
    "type", "pie", PATH, {
      section: "week",
      line: "income",
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
  const [OBJECT_INCOME_WEEK, setOBJECT_INCOME_WEEK] = useState<any>([MoneyPie]);
  const [OBJECT_EXPENSE_WEEK, setOBJECT_EXPENSE_WEEK] = useState<any>([MoneyPie]);
  const [OBJECT_INCOME_MONTH, setOBJECT_INCOME_MONTH] = useState<any>([MoneyPie]);
  const [OBJECT_EXPENSE_MONTH, setOBJECT_EXPENSE_MONTH] = useState<any>([MoneyPie]);
  const [OBJECT_INCOME_YEAR, setOBJECT_INCOME_YEAR] = useState<any>([MoneyPie]);
  const [OBJECT_EXPENSE_YEAR, setOBJECT_EXPENSE_YEAR] = useState<any>([MoneyPie]);

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
      setOBJECT_INCOME_WEEK(
        resWeek.data.result.income.length > 0 ? resWeek.data.result.income : [MoneyPie]
      );
      setOBJECT_EXPENSE_WEEK(
        resWeek.data.result.expense.length > 0 ? resWeek.data.result.expense : [MoneyPie]
      );
      setOBJECT_INCOME_MONTH(
        resMonth.data.result.income.length > 0 ? resMonth.data.result.income : [MoneyPie]
      );
      setOBJECT_EXPENSE_MONTH(
        resMonth.data.result.expense.length > 0 ? resMonth.data.result.expense : [MoneyPie]
      );
      setOBJECT_INCOME_YEAR(
        resYear.data.result.income.length > 0 ? resYear.data.result.income : [MoneyPie]
      );
      setOBJECT_EXPENSE_YEAR(
        resYear.data.result.expense.length > 0 ? resYear.data.result.expense : [MoneyPie]
      );
    }
    catch (err: any) {
      setLOADING(false);
      setALERT({
        open: true,
        msg: translate(err.response.data.msg),
        severity: "error",
      });
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
    if (TYPE.section === "week" && TYPE.line === "income") {
      object = OBJECT_INCOME_WEEK;
    }
    else if (TYPE.section === "week" && TYPE.line === "expense") {
      object = OBJECT_EXPENSE_WEEK;
    }
    else if (TYPE.section === "month" && TYPE.line === "income") {
      object = OBJECT_INCOME_MONTH;
    }
    else if (TYPE.section === "month" && TYPE.line === "expense") {
      object = OBJECT_EXPENSE_MONTH;
    }
    else if (TYPE.section === "year" && TYPE.line === "income") {
      object = OBJECT_INCOME_YEAR;
    }
    else if (TYPE.section === "year" && TYPE.line === "expense") {
      object = OBJECT_EXPENSE_YEAR;
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
          {`${Number(value).toLocaleString()}`}
        </tspan>
      </text>
    );
  };

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartPie = () => {

    let object = null;
    let endStr = "";
    if (TYPE.section === "week" && TYPE.line === "income") {
      object = OBJECT_INCOME_WEEK;
      endStr = "";
    }
    else if (TYPE.section === "week" && TYPE.line === "expense") {
      object = OBJECT_EXPENSE_WEEK;
      endStr = "";
    }
    else if (TYPE.section === "month" && TYPE.line === "income") {
      object = OBJECT_INCOME_MONTH;
      endStr = "";
    }
    else if (TYPE.section === "month" && TYPE.line === "expense") {
      object = OBJECT_EXPENSE_MONTH;
      endStr = "";
    }
    else if (TYPE.section === "year" && TYPE.line === "income") {
      object = OBJECT_INCOME_YEAR;
      endStr = "";
    }
    else if (TYPE.section === "year" && TYPE.line === "expense") {
      object = OBJECT_EXPENSE_YEAR;
      endStr = "";
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
            <Div className={"fs-1-0rem fw-500 grey ml-10px"}>
              {`[${translate(TYPE.line)}]`}
            </Div>
          </Grid>
          <Grid size={3} className={"d-row-center"}>
            <PopUp
              type={"chart"}
              position={"bottom"}
              direction={"center"}
              contents={
                ["income", "expense"]?.map((key: string, index: number) => (
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
      <Paper className={"content-wrapper border-1 radius-2 shadow-1 h-min-40vh"}>
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
