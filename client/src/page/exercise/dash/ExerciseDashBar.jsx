// ExerciseDashBar.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY, log} from "../../../import/ImportLogics.jsx";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {Div, Br20, Img} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {Bar, Scatter, ComposedChart, ReferenceLine, Line} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_2} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL + SUBFIX;
  const array = ["목표", "실제"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("today");
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_TODAY_DEF = [
    {name:"", date:"", 목표: 0, 실제: 0},
  ];
  const OBJECT_WEEK_DEF = [
    {name:"", date:"", 목표: 0, 실제: 0},
  ];
  const OBJECT_MONTH_DEF = [
    {name:"", date:"", 목표: 0, 실제: 0},
  ];
  const [OBJECT_TODAY, setOBJECT_TODAY] = useState(OBJECT_TODAY_DEF);
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEF);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resToday = await axios.get(`${URL_OBJECT}/dash/bar/today`, {
      params: {
        user_id: sessionId
      },
    });
    const resWeek = await axios.get(`${URL_OBJECT}/dash/bar/week`, {
      params: {
        user_id: sessionId
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/dash/bar/month`, {
      params: {
        user_id: sessionId
      },
    });
    setOBJECT_TODAY(
      resToday.data.result.length > 0 ? resToday.data.result : OBJECT_TODAY_DEF
    );
    setOBJECT_WEEK(
      resWeek.data.result.length > 0 ? resWeek.data.result : OBJECT_WEEK_DEF
    );
    setOBJECT_MONTH(
      resMonth.data.result.length > 0 ? resMonth.data.result : OBJECT_MONTH_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartToday = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_TODAY, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_TODAY} margin={{top: 20, right: 20, bottom: 20, left: 20}}
        barGap={20} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
            width={30}
          />
          <Line dataKey={"목표"} stroke={COLORS[0]} strokeWidth={2} dot={false}
          />
          <ReferenceLine y={OBJECT_TODAY[0].목표} stroke={COLORS[0]} strokeDasharray={"3 3"}
          />
          <Bar dataKey={"실제"} fill={COLORS[2]} radius={[10, 10, 0, 0]} minPointSize={1}
            barSize={20}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              return `${Number(value).toLocaleString()} kg`;
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

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_WEEK, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_WEEK} margin={{top: 20, right: 20, bottom: 20, left: 20}}
        barGap={20} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
            width={30}
          />
          <Scatter
            dataKey={"목표"}
            fill={COLORS[0]}
            line={{stroke: COLORS[0], strokeWidth: 0.6}}
          />
          <Scatter
            dataKey={"실제"}
            fill={COLORS[2]}
            line={{stroke: COLORS[2], strokeWidth: 0.6}}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              return `${Number(value).toLocaleString()} kg`;
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

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_MONTH, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_MONTH} margin={{top: 20, right: 20, bottom: 20, left: 20}}
        barGap={20} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:"#666", fontSize:14}}
            width={30}
          />
          <Scatter
            dataKey={"목표"}
            fill={COLORS[0]}
            line={{stroke: COLORS[0], strokeWidth: 0.6}}
          />
          <Scatter
            dataKey={"실제"}
            fill={COLORS[2]}
            line={{stroke: COLORS[2], strokeWidth: 0.6}}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              return `${Number(value).toLocaleString()} kg`;
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

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5. title
    const titleSection = () => (
      <Div className={"d-center"}>체중 목표</Div>
    );
    // 7-6. dropdown
    const dropdownSection1 = () => (
      <Div className={"d-center"}>
        <TextField
          select={true}
          type={"text"}
          size={"small"}
          variant={"outlined"}
          value={SECTION}
          onChange={(e) => (
            setSECTION(e.target.value)
          )}
        >
        <MenuItem value={"today"}>오늘</MenuItem>
        <MenuItem value={"week"}>주간</MenuItem>
        <MenuItem value={"month"}>월간</MenuItem>
      </TextField>
      </Div>
    );
    // 7-6. dropdown
    const dropdownSection2 = () => (
      <Img src={common3_2} className={"w-24 h-24"} />
    );
    // 7-7. fragment
    const dashFragment1 = (i) => (
      <Card variant={"outlined"} className={"p-10"} key={i}>
        {chartToday()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment2 = (i) => (
      <Card variant={"outlined"} className={"p-10"} key={i}>
        {chartWeek()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment3 = (i) => (
      <Card variant={"outlined"} className={"p-10"} key={i}>
        {chartMonth()}
      </Card>
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "today") {
        return LOADING ? loadingNode() : dashFragment1(0);
      }
      else if (SECTION === "week") {
        return LOADING ? loadingNode() : dashFragment2(0);
      }
      else if (SECTION === "month") {
        return LOADING ? loadingNode() : dashFragment3(0);
      }
    }
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center mt-n10"}>
        <Div className={"ms-0 me-auto"}>{dropdownSection1()}</Div>
        <Div className={"ms-auto me-auto"}>{titleSection()}</Div>
        <Div className={"me-0 ms-auto"}>{dropdownSection2()}</Div>
      </Div>
    );
    // 7-11. third
    const thirdSection = () => (
      dashSection()
    );
    // 7-12. return
    return (
      <Paper className={"content-wrapper border radius"}>
        <Div className={"block-wrapper h-min40vh"}>
          {firstSection()}
          <Br20/>
          {thirdSection()}
        </Div>
      </Paper>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading
      LOADING={LOADING}
      setLOADING={setLOADING}
    />
  );

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <>
      {dashNode()}
    </>
  );
};