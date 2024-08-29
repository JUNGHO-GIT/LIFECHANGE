// TodayChartMoney.jsx
// Node -> Section -> Fragment

import { useState, useEffect } from "../../../imports/ImportReacts.jsx";
import { useCommon } from "../../../imports/ImportHooks.jsx";
import { axios } from "../../../imports/ImportLibs.jsx";
import { handlerY } from "../../../imports/ImportUtils.jsx";
import { Loading } from "../../../imports/ImportLayouts.jsx";
import { Div, Br, Img, Input } from "../../../imports/ImportComponents.jsx";
import { Paper, Card, Grid } from "../../../imports/ImportMuis.jsx";
import { Bar, Line, ComposedChart, ReferenceLine } from "recharts";
import { XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { common3_2 } from "../../../imports/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const TodayChartMoney = () => {

  // 1. common -------------------------------------------------------------------------------------
  const { URL_MONEY, sessionId, barChartArray, COLORS, translate, koreanDate } = useCommon();

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
    real: "0",
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
      axios.get(`${URL_MONEY}/chart/bar/today`, {
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
    const {domain, ticks, formatterY} = handlerY(OBJECT_TODAY, barChartArray, "money");
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
      const titleFragment = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("money")}
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
        <Img src={common3_2} className={"w-24 h-24"} />
      );
      return (
        <Card className={"p-0"}>
          <Grid container columnSpacing={1} rowSpacing={2}>
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
      const chartFragment1 = (i) => (
        <Card className={"border radius p-20"} key={i}>
          {chartToday()}
        </Card>
      );
      if (SECTION === "today") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
    };
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border h-min40vh"}>
        <Grid container columnSpacing={1} rowSpacing={2}>
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