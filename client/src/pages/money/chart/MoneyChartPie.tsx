// MoneyChartPie.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useStorageLocal, useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { MoneyPie } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { PopUp, Select } from "@imports/ImportContainers";
import { Div, Img, Br } from "@imports/ImportComponents";
import { Paper, MenuItem, Grid } from "@imports/ImportMuis";
import { FormGroup, FormControlLabel, Switch } from "@imports/ImportMuis";
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
  const { URL_OBJECT, TITLE, PATH, chartColors, sessionId } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-1. useStorageLocal --------------------------------------------------------------------------
  const [TYPE, setTYPE] = useStorageLocal(
    TITLE, PATH, "type_pie", {
      section: "week",
      line: "income",
    }
  );

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(true);
  const [radius, setRadius] = useState<number>(120);
  const [DATE, setDATE] = useState<any>({
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
  const [OBJECT_IN_WEEK, setOBJECT_IN_WEEK] = useState<any>([MoneyPie]);
  const [OBJECT_OUT_WEEK, setOBJECT_OUT_WEEK] = useState<any>([MoneyPie]);
  const [OBJECT_IN_MONTH, setOBJECT_IN_MONTH] = useState<any>([MoneyPie]);
  const [OBJECT_OUT_MONTH, setOBJECT_OUT_MONTH] = useState<any>([MoneyPie]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    try {
      const params = {
        user_id: sessionId,
        DATE: DATE,
      };
      const [resWeek, resMonth] = await Promise.all([
        axios.get(`${URL_OBJECT}/chart/pie/week`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/chart/pie/month`, {
          params: params,
        }),
      ]);
      setOBJECT_IN_WEEK(
        resWeek.data.result.income.length > 0 ? resWeek.data.result.income : [MoneyPie]
      );
      setOBJECT_OUT_WEEK(
        resWeek.data.result.expense.length > 0 ? resWeek.data.result.expense : [MoneyPie]
      );
      setOBJECT_IN_MONTH(
        resMonth.data.result.income.length > 0 ? resMonth.data.result.income : [MoneyPie]
      );
      setOBJECT_OUT_MONTH(
        resMonth.data.result.expense.length > 0 ? resMonth.data.result.expense : [MoneyPie]
      );
    }
    catch (err: any) {
      console.error(err);
    }
    finally {
      setLOADING(false);
    }
  })()}, [URL_OBJECT, DATE, sessionId]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {
    const updateRadius = () => {
      // lg
      if (window.innerWidth >= 1200) {
        setRadius(120);
      }
      // md
      else if (window.innerWidth >= 992) {
        setRadius(110);
      }
      // sm
      else if (window.innerWidth >= 768) {
        setRadius(100);
      }
      // xs
      else {
        setRadius(90);
      }
    };

    window.addEventListener('resize', updateRadius);
    updateRadius();

    return () => {
      window.removeEventListener('resize', updateRadius);
    }
  }, []);

  // 4-3. render -----------------------------------------------------------------------------------
  const renderInWeek = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_IN_WEEK[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-4. render -----------------------------------------------------------------------------------
  const renderExpenseWeek = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_OUT_WEEK[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-5. render -----------------------------------------------------------------------------------
  const renderInMonth = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_IN_MONTH[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  }

  // 4-6. render -----------------------------------------------------------------------------------
  const renderExpenseMonth = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_OUT_MONTH[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  };

  // 5-3. chart ------------------------------------------------------------------------------------
  const chartIncomeWeek = () => (
    <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
      <Grid size={12} className={"d-col-center"}>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_IN_WEEK}
              cx={"50%"}
              cy={"50%"}
              label={renderInWeek}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_IN_WEEK?.map((_entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const customName = translate(name);
                return [`${Number(value).toLocaleString()}`, customName];
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
                paddingTop:"10px",
                fontSize:"12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );

  // 5-4. chart ------------------------------------------------------------------------------------
  const chartExpenseWeek = () => (
    <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
      <Grid size={12} className={"d-col-center"}>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_OUT_WEEK}
              cx={"50%"}
              cy={"50%"}
              label={renderExpenseWeek}
              labelLine={false}
              outerRadius={radius}
              fill={"#82ca9d"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_OUT_WEEK?.map((_entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const customName = translate(name);
                return [`${Number(value).toLocaleString()}`, customName];
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
                paddingTop:"10px",
                fontSize:"12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );

  // 5-5. chart ------------------------------------------------------------------------------------
  const chartIncomeMonth = () => (
    <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
      <Grid size={12} className={"d-col-center"}>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_IN_MONTH}
              cx={"50%"}
              cy={"50%"}
              label={renderInMonth}
              labelLine={false}
              outerRadius={radius}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_IN_MONTH?.map((_entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const customName = translate(name);
                return [`${Number(value).toLocaleString()}`, customName];
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
                paddingTop:"10px",
                fontSize:"12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );

  // 5-6. chart ------------------------------------------------------------------------------------
  const chartExpenseMonth = () => (
    <Grid container spacing={0} columns={12} className={"border-1 radius-1"}>
      <Grid size={12} className={"d-col-center"}>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={OBJECT_OUT_MONTH}
              cx={"50%"}
              cy={"50%"}
              label={renderExpenseMonth}
              labelLine={false}
              outerRadius={radius}
              fill={"#82ca9d"}
              dataKey={"value"}
              minAngle={15}
            >
              {OBJECT_OUT_MONTH?.map((_entry: any, index: number) => (
                <Cell key={`cell-${index}`} fill={chartColors[index % chartColors.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: any, name: any) => {
                const customName = translate(name);
                return [`${Number(value).toLocaleString()}`, customName];
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
                paddingTop:"10px",
                fontSize:"12px"
              }}
            />
          </PieChart>
        </ResponsiveContainer>
      </Grid>
    </Grid>
  );

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleFragment = () => (
        <Grid container spacing={0} columns={12}>
          <Grid size={12} className={"d-row-center"}>
            <Div className={"fs-1-0rem fw-600"}>
              {translate("chartPie")}
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
            ["income", "expense"]?.map((key: string, index: number) => (
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
              key={"common3_1"}
              src={"common3_1"}
              className={"w-24 h-24 pointer me-10"}
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
          <Grid size={6} className={"d-row-center"}>
            {titleFragment()}
          </Grid>
          <Grid size={3} className={"d-row-right"}>
            {selectFragment2()}
          </Grid>
        </Grid>
      );
    };
    // 7-2. chart
    const chartSection = () => (
      <Grid container spacing={0} columns={12}>
        <Grid size={12} className={"d-row-center"}>
          {LOADING ? <Loading /> : (
            <>
              {TYPE.section === "week" && TYPE.line === "income" && chartIncomeWeek()}
              {TYPE.section === "week" && TYPE.line === "expense" && chartExpenseWeek()}
              {TYPE.section === "month" && TYPE.line === "income" && chartIncomeMonth()}
              {TYPE.section === "month" && TYPE.line === "expense" && chartExpenseMonth()}
            </>
          )}
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
