// SleepChartPie.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate, useTranslate } from "@imports/ImportHooks";
import { SleepPie } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportLibs";
import { Loading } from "@imports/ImportLayouts";
import { Select } from "@imports/ImportContainers";
import { Div, Img } from "@imports/ImportComponents";
import { Paper, Card, MenuItem, Grid } from "@imports/ImportMuis";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend} from 'recharts';

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
export const SleepChartPie = () => {

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
  const [SECTION, setSECTION] = useState<string>("week");
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
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState<any>([SleepPie]);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState<any>([SleepPie]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
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
    setOBJECT_WEEK(
      (resWeek.data.result.length > 0) &&
      (resWeek.data.result[0].value !== 0) &&
      (resWeek.data.result[1].value !== 0) &&
      (resWeek.data.result[2].value !== 0)
      ? resWeek.data.result
      : [SleepPie]
    );
    setOBJECT_MONTH(
      (resMonth.data.result.length > 0) &&
      (resMonth.data.result[0].value !== 0) &&
      (resMonth.data.result[1].value !== 0) &&
      (resMonth.data.result[2].value !== 0)
      ? resMonth.data.result
      : [SleepPie]
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

  // 4-2. render -----------------------------------------------------------------------------------
  const renderWeek = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // ex. wakeTime -> wake , bedTime -> bed
    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_WEEK[index]?.name)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  };

  // 4-3. render -----------------------------------------------------------------------------------
  const renderMonth = (
    { cx, cy, midAngle, innerRadius, outerRadius, value, index }: PieProps
  ) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) / 2;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    // ex. wakeTime -> wake , bedTime -> bed
    return (
      <text x={x} y={y} fill="white" textAnchor={"middle"} dominantBaseline={"central"}
      className={"fs-0-6rem"}>
        {`${translate(OBJECT_MONTH[index]?.name)} ${Number(value).toLocaleString()} %`}
      </text>
    );
  };

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartWeek = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_WEEK}
          cx={"50%"}
          cy={"50%"}
          label={renderWeek}
          labelLine={false}
          outerRadius={radius}
          fill={"#8884d8"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_WEEK?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any, props: any) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}%`, customName];
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
  const chartMonth = () => (
    <ResponsiveContainer width={"100%"} height={350}>
      <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
        <Pie
          data={OBJECT_MONTH}
          cx={"50%"}
          cy={"50%"}
          label={renderMonth}
          labelLine={false}
          outerRadius={radius}
          fill={"#8884d8"}
          dataKey={"value"}
          minAngle={15}
        >
          {OBJECT_MONTH?.map((entry: any, index: number) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          formatter={(value: any, name: any, props: any) => {
            const customName = translate(name);
            return [`${Number(value).toLocaleString()}%`, customName];
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
        <Div className={"d-center"}>
          <Div className={"fs-1-0rem fw-600"}>
            {translate("chartPie")}
          </Div>
        </Div>
      );
      const selectFragment1 = () => (
        <Select
          value={SECTION}
          onChange={(e: any) => {
            setSECTION(e.target.value)
          }}
        >
          <MenuItem value={"week"}>{translate("week")}</MenuItem>
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
        </Select>
      );
      const selectFragment2 = () => (
        <Img
        	key={"common3_2"}
        	src={"common3_2"}
        	className={"w-24 h-24 me-10"}
        />
      );
      return (
        <Card className={"p-0"}>
          <Grid container spacing={2}>
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
        </Card>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const chartFragment1 = (i: number) => (
        <Card className={"border-1 radius-1 p-20"} key={i}>
          {chartWeek()}
        </Card>
      );
      const chartFragment2 = (i: number) => (
        <Card className={"border-1 radius-1 p-20"} key={i}>
          {chartMonth()}
        </Card>
      );
      if (SECTION === "week") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
      else if (SECTION === "month") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
    }
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 h-min40vh"}>
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
