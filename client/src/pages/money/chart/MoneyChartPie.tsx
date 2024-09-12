// MoneyChartPie.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { MoneyPie } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportLibs";
import { Loading } from "@imports/ImportLayouts";
import { Div, Img, Select} from "@imports/ImportComponents";
import { PopUp } from "@imports/ImportContainers";
import { Paper, Card, MenuItem, Grid } from "@imports/ImportMuis";
import { FormGroup, FormControlLabel, Switch } from "@imports/ImportMuis";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

// -------------------------------------------------------------------------------------------------
declare interface PieProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  value: number;
  index: number;
}

// -------------------------------------------------------------------------------------------------
export const MoneyChartPie = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    translate,
  } = useTranslate();
  const {
    dayFmt,
    weekStartFmt, weekEndFmt,
    monthStartFmt, monthEndFmt,
    yearStartFmt, yearEndFmt,
  } = useCommonDate();
  const {
    URL_OBJECT, sessionId, COLORS,
  } = useCommonValue();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(true);
  const [radius, setRadius] = useState<number>(120);
  const [SECTION, setSECTION] = useState<string>("today");
  const [LINE, setLINE] = useState<string>("income");
  const [DATE, setDATE] = useState<any>({
    dateType: "",
    dateStart: dayFmt,
    dateEnd: dayFmt,
    weekStartFmt: weekStartFmt,
    weekEndFmt: weekEndFmt,
    monthStartFmt: monthStartFmt,
    monthEndFmt: monthEndFmt,
    yearStartFmt: yearStartFmt,
    yearEndFmt: yearEndFmt,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const [OBJECT_IN_TODAY, setOBJECT_IN_TODAY] = useState<any>([MoneyPie]);
  const [OBJECT_OUT_TODAY, setOBJECT_OUT_TODAY] = useState<any>([MoneyPie]);
  const [OBJECT_IN_WEEK, setOBJECT_IN_WEEK] = useState<any>([MoneyPie]);
  const [OBJECT_OUT_WEEK, setOBJECT_OUT_WEEK] = useState<any>([MoneyPie]);
  const [OBJECT_IN_MONTH, setOBJECT_IN_MONTH] = useState<any>([MoneyPie]);
  const [OBJECT_OUT_MONTH, setOBJECT_OUT_MONTH] = useState<any>([MoneyPie]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    const params = {
      user_id: sessionId,
      DATE: DATE,
    };
    const [resToday, resWeek, resMonth] = await Promise.all([
      axios.get(`${URL_OBJECT}/chart/pie/today`, {
        params: params,
      }),
      axios.get(`${URL_OBJECT}/chart/pie/week`, {
        params: params,
      }),
      axios.get(`${URL_OBJECT}/chart/pie/month`, {
        params: params,
      }),
    ]);
    setOBJECT_IN_TODAY(
      resToday.data.result.income.length > 0 ? resToday.data.result.income : [MoneyPie]
    );
    setOBJECT_OUT_TODAY(
      resToday.data.result.expense.length > 0 ? resToday.data.result.expense : [MoneyPie]
    );
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
    setLOADING(false);
  })()}, [sessionId]);

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

  // 4-1. render -----------------------------------------------------------------------------------
  const renderInToday = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_IN_TODAY[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  };

  // 4-2. render -----------------------------------------------------------------------------------
  const renderExpenseToday = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_OUT_TODAY[index]?.name).substring(0, 5)} ${Number(value).toLocaleString()}`}
      </text>
    );
  }

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
  }

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartIncomeToday = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_IN_TODAY}
          cx={"50%"}
          cy={"50%"}
          label={renderInToday}
          labelLine={false}
          outerRadius={radius}
          fill={"#8884d8"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_IN_TODAY?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any, props: any) => {
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
  );

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartExpenseToday = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_OUT_TODAY}
          cx={"50%"}
          cy={"50%"}
          label={renderExpenseToday}
          labelLine={false}
          outerRadius={radius}
          fill={"#82ca9d"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_OUT_TODAY?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any, props: any) => {
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
  );

  // 5-3. chart ------------------------------------------------------------------------------------
  const chartIncomeWeek = () => (
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
          {OBJECT_IN_WEEK?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any, props: any) => {
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
  );

  // 5-4. chart ------------------------------------------------------------------------------------
  const chartExpenseWeek = () => (
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
          {OBJECT_OUT_WEEK?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any, props: any) => {
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
  );

  // 5-5. chart ------------------------------------------------------------------------------------
  const chartIncomeMonth = () =>  (
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
          {OBJECT_IN_MONTH?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any, props: any) => {
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
  );

  // 5-6. chart ------------------------------------------------------------------------------------
  const chartExpenseMonth = () => (
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
          {OBJECT_OUT_MONTH?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any, props: any) => {
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
  );

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleFragment = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("chartPie")}
        </Div>
      );
      const selectFragment1 = () => (
        <Select
          value={SECTION}
          onChange={(e: any) => (
            setSECTION(e.target.value)
          )}
        >
          <MenuItem value={"today"}>{translate("today")}</MenuItem>
          <MenuItem value={"week"}>{translate("week")}</MenuItem>
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
        </Select>
      );
      const selectFragment2 = () => (
        <PopUp
          type={"chart"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}: any) => (
            ["income", "expense"]?.map((key, index) => (
              <FormGroup key={index}>
                <FormControlLabel
                  label={translate(key)}
                  labelPlacement={"start"}
                  control={
                    <Switch
                      checked={LINE === key}
                      onChange={() => {
                        if (LINE === key) {
                          return;
                        }
                        else {
                          setLINE(key);
                        }
                      }}
                    />
                  }
                />
              </FormGroup>
            ))
          )}
        >
          {(popTrigger: any) => (
            <Img
              key={"common3_1"}
              src={"common3_1"}
              className={"w-24 h-24 pointer"}
              onClick={(e: any) => {
                popTrigger.openPopup(e.currentTarget)
              }}
            />
          )}
        </PopUp>
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={2}>
            <Grid size={3} className={"d-left"}>
              {selectFragment1()}
            </Grid>
            <Grid size={6} className={"d-center"}>
              {titleFragment()}
            </Grid>
            <Grid size={3} className={"d-right"}>
              {selectFragment2()}
            </Grid>
          </Grid>
        </Card>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const chartFragment1 = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          {chartIncomeToday()}
        </Card>
      );
      const chartFragment2 = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          {chartExpenseToday()}
        </Card>
      );
      const chartFragment3 = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          {chartIncomeWeek()}
        </Card>
      );
      const chartFragment4 = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          {chartExpenseWeek()}
        </Card>
      );
      const chartFragment5 = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          {chartIncomeMonth()}
        </Card>
      );
      const chartFragment6 = (i: number) => (
        <Card className={"border radius p-20"} key={i}>
          {chartExpenseMonth()}
        </Card>
      );
      if (SECTION === "today" && LINE === "income") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
      else if (SECTION === "today" && LINE === "expense") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
      else if (SECTION === "week" && LINE === "income") {
        return LOADING ? <Loading /> : chartFragment3(0);
      }
      else if (SECTION === "week" && LINE === "expense") {
        return LOADING ? <Loading /> : chartFragment4(0);
      }
      else if (SECTION === "month" && LINE === "income") {
        return LOADING ? <Loading /> : chartFragment5(0);
      }
      else if (SECTION === "month" && LINE === "expense") {
        return LOADING ? <Loading /> : chartFragment6(0);
      }
    }
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min40vh"}>
        <Grid container spacing={2}>
          <Grid size={12}>
            {headSection()}
          </Grid>
          <Grid size={12}>
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
