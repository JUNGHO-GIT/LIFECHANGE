// TodayChartSleep.jsx

import { React, useState, useEffect } from "../../../import/ImportReacts.jsx";
import { useCommon } from "../../../import/ImportHooks.jsx";
import { handlerY } from "../../../import/ImportUtils.jsx";
import { axios } from "../../../import/ImportLibs.jsx";
import { Loading } from "../../../import/ImportLayouts.jsx";
import { Div, Br20, Img } from "../../../import/ImportComponents.jsx";
import { Paper, Card, TextField, Grid } from "../../../import/ImportMuis.jsx";
import { Bar, Line, ComposedChart, ReferenceLine } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { common3_2 } from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const TodayChartSleep = () => {

  // 1. common -------------------------------------------------------------------------------------
  const {
    URL_SLEEP, sessionId, barChartArray, COLORS, translate, koreanDate,
  } = useCommon();

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("today");
  const [DATE, setDATE] = useState({
    dateType: "",
    dateStart: koreanDate,
    dateEnd: koreanDate,
  });

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_TODAY_DEF = [{
    name: "",
    date: "",
    goal: "0",
    real: "0"
  }];
  const [OBJECT_TODAY, setOBJECT_TODAY] = useState(OBJECT_TODAY_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    const params = {
      user_id: sessionId,
      DATE: DATE,
    };
    const [resToday] = await Promise.all([
      axios.get(`${URL_SLEEP}/chart/bar/today`, {
        params: params,
      }),
    ]);
    setOBJECT_TODAY(
      resToday.data.result.length > 0 ? resToday.data.result : OBJECT_TODAY_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

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
            fill={COLORS[2]}
            radius={[10, 10, 0, 0]}
            minPointSize={1}
            barSize={20}
          />
          <ReferenceLine
            y={OBJECT_TODAY[0]?.goal}
            stroke={COLORS[0]}
            strokeDasharray={"3 3"}
          />
          <Line
            dataKey={"goal"}
            stroke={COLORS[0]}
            strokeWidth={2}
            dot={true}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
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
      const titleSection = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("sleep")}
        </Div>
      );
      const selectSection1 = () => (
        <TextField
          select={false}
          type={"text"}
          size={"small"}
          variant={"outlined"}
          value={translate(SECTION)}
          InputProps={{
            readOnly: true,
            style: {
              width: 76,
              fontSize: "0.9rem",
              color: "#666",
            },
          }}
        />
      );
      const selectSection2 = () => (
        <Img src={common3_2} className={"w-24 h-24"} />
      );
      return (
        <Grid container>
          <Grid item xs={3} className={"d-left"}>
            {selectSection1()}
          </Grid>
          <Grid item xs={6} className={"d-center"}>
            {titleSection()}
          </Grid>
          <Grid item xs={3} className={"d-right"}>
            {selectSection2()}
          </Grid>
        </Grid>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const chartFragment1 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartToday()}
        </Card>
      );
      if (SECTION === "today") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
    }
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none"}>
        <Div className={"block-wrapper h-min40vh"}>
          {headSection()}
          <Br20 />
          {chartSection()}
        </Div>
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