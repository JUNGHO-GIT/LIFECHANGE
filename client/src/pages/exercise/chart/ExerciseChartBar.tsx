// ExerciseChartBar.tsx

import { useState, useEffect } from "@imports/ImportReacts";
import { useCommonValue, useCommonDate } from "@imports/ImportHooks";
import { useLanguageStore } from "@imports/ImportStores";
import { ExerciseBar } from "@imports/ImportSchemas";
import { axios } from "@imports/ImportUtils";
import { handlerY } from "@imports/ImportUtils";
import { Loading } from "@imports/ImportLayouts";
import { Select } from "@imports/ImportContainers";
import { Div, Img } from "@imports/ImportComponents";
import { Paper, Card, MenuItem, Grid } from "@imports/ImportMuis";
import { Scatter, ComposedChart } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

// -------------------------------------------------------------------------------------------------
export const ExerciseChartBar = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_OBJECT, sessionId, chartColors,  barChartArray } = useCommonValue();
  const { dayFmt, weekStartFmt, weekEndFmt} = useCommonDate();
  const { monthStartFmt, monthEndFmt, yearStartFmt, yearEndFmt } = useCommonDate();
  const { translate } = useLanguageStore();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState<boolean>(true);
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
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState<any>([ExerciseBar]);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState<any>([ExerciseBar]);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    try {
      const params = {
        user_id: sessionId,
        DATE: DATE,
      };
      const [resWeek, resMonth] = await Promise.all([
        axios.get(`${URL_OBJECT}/chart/bar/week`, {
          params: params,
        }),
        axios.get(`${URL_OBJECT}/chart/bar/month`, {
          params: params,
        }),
      ]);
      setOBJECT_WEEK(
        resWeek.data.result.length > 0 ? resWeek.data.result : [ExerciseBar]
      );
      setOBJECT_MONTH(
        resMonth.data.result.length > 0 ? resMonth.data.result : [ExerciseBar]
      );
    }
    catch (err: any) {
      console.error(err);
    }
    finally {
      setLOADING(false);
    }
  })()}, [URL_OBJECT, DATE, sessionId]);

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartWeek = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_WEEK, barChartArray, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart
          data={OBJECT_WEEK}
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
          <Scatter
            dataKey={"real"}
            fill={chartColors[2]}
            line={{stroke: chartColors[2], strokeWidth: 0.6}}
          />
          <Scatter
            dataKey={"goal"}
            fill={chartColors[0]}
            line={{stroke: chartColors[0], strokeWidth: 0.6}}
          />
          <Tooltip
            labelFormatter={(label: any, payload: any) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value: any, name: any, props: any) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} kg`, customName];
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

  // 5-3. chart ------------------------------------------------------------------------------------
  const chartMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_MONTH, barChartArray, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart
          data={OBJECT_MONTH}
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
          <Scatter
            dataKey={"real"}
            fill={chartColors[2]}
            line={{stroke: chartColors[2], strokeWidth: 0.6}}
          />
          <Scatter
            dataKey={"goal"}
            fill={chartColors[0]}
            line={{stroke: chartColors[0], strokeWidth: 0.6}}
          />
          <Tooltip
            labelFormatter={(label: any, payload: any) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value: any, name: any, props: any) => {
              const customName = translate(name);
              return [`${Number(value).toLocaleString()} kg`, customName];
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
          <Div className={"fs-1-0rem fw-500 grey ms-10"}>
            {`[${translate("weight")}]`}
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
          <Grid container spacing={2} columns={12}>
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
      const chartFragment2 = (i: number) => (
        <Card className={"border-1 radius-1 p-20"} key={i}>
          {chartWeek()}
        </Card>
      );
      const chartFragment3 = (i: number) => (
        <Card className={"border-1 radius-1 p-20"} key={i}>
          {chartMonth()}
        </Card>
      );
      if (SECTION === "week") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
      else if (SECTION === "month") {
        return LOADING ? <Loading /> : chartFragment3(0);
      }
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper border-1 radius-1 h-min40vh"}>
        <Grid container spacing={2} columns={12}>
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