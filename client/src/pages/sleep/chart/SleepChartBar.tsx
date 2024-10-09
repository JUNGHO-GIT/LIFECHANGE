// SleepChartBar.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { SleepBar } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { handlerY } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Input } from "@imports/ImportContainers";
import { Div, Img, Br } from "@imports/ImportComponents";
import { Paper, Card, Grid } from "@imports/ImportMuis";
import { Bar, Line, ComposedChart, ReferenceLine } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// -------------------------------------------------------------------------------------------------
export const SleepChartBar = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId, chartColors, barChartArray } = useCommonValue();
  const { getDayFmt, getWeekStartFmt, getWeekEndFmt } = useCommonDate();
  const { getMonthStartFmt, getMonthEndFmt, getYearStartFmt, getYearEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(true);
  const [SECTION, setSECTION] = useState<string>("today");
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
  const [OBJECT_TODAY, setOBJECT_TODAY] = useState<any>([SleepBar]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    try {
      const params = {
        user_id: sessionId,
        DATE: DATE,
      };
      const [resToday] = await Promise.all([
        axios.get(`${URL_OBJECT}/chart/bar/today`, {
          params: params,
        }),
      ]);
      setOBJECT_TODAY(
        resToday.data.result.length > 0 ? resToday.data.result : [SleepBar]
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
  const chartToday = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_TODAY, barChartArray, "sleep");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart
          data={OBJECT_TODAY}
          margin={{top: 20, right: 20, bottom: 20, left: 20}}
          barGap={20}
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
          <Bar
            dataKey={"real"}
            fill={chartColors[2]}
            radius={[10, 10, 0, 0]}
            minPointSize={1}
            barSize={20}
          />
          <ReferenceLine
            y={OBJECT_TODAY[0]?.goal}
            stroke={chartColors[0]}
            strokeDasharray={"3 3"}
          />
          <Line
            dataKey={"goal"}
            stroke={chartColors[0]}
            strokeWidth={2}
            dot={true}
          />
          <Tooltip
            labelFormatter={(label: any, payload: any) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value: any, name: any, props: any) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()}`, customName];
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
    );
  };

  // 7. chart --------------------------------------------------------------------------------------
  const chartNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleFragment = () => (
        <Div className={"d-center"}>
          <Div className={"fs-1-0rem fw-600"}>
            {translate("chartBar")}
          </Div>
        </Div>
      );
      const selectFragment1 = () => (
        <Input
          value={translate(SECTION)}
          readOnly={true}
          inputclass={"fs-0-9rem grey"}
        />
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
          <Grid container spacing={1} columns={12}>
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
          {chartToday()}
        </Card>
      );
      if (SECTION === "today") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
    }
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 shadow-1 h-min40vh"}>
        <Grid container spacing={1} columns={12}>
          <Grid size={12}>
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