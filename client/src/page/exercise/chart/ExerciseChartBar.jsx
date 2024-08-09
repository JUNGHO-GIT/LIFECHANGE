// ExerciseChartBar.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate, useStorage} from "../../../import/ImportHooks.jsx";
import {handlerY, log} from "../../../import/ImportUtils.jsx";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {Div, Br20, Img} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField, Grid} from "../../../import/ImportMuis.jsx";
import {Bar, Scatter, ComposedChart, ReferenceLine, Line} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_2} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const ExerciseChartBar = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL + SUBFIX;
  const {translate} = useTranslate();
  const array = ["goal", "real"];
  const sessionId = sessionStorage.getItem("sessionId");
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState ---------------------------------------------------------------------------------
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("today");

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_TODAY_DEF = [{
    name: "",
    date: "",
    goal: "0",
    real: "0"
  }];
  const OBJECT_WEEK_DEF = [{
    name: "",
    date: "",
    goal: "0",
    real: "0"
  }];
  const OBJECT_MONTH_DEF = [{
    name: "",
    date: "",
    goal: "0",
    real: "0"
  }];
  const [OBJECT_TODAY, setOBJECT_TODAY] = useState(OBJECT_TODAY_DEF);
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEF);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
  useEffect(() => {(async () => {
    setLOADING(true);
    const resToday = await axios.get(`${URL_OBJECT}/chart/bar/today`, {
      params: {
        user_id: sessionId
      },
    });
    const resWeek = await axios.get(`${URL_OBJECT}/chart/bar/week`, {
      params: {
        user_id: sessionId
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/chart/bar/month`, {
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

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartToday = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_TODAY, array, "exercise", "");
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
            tick={{fill:"#666", fontSize: 14}}
            tickFormatter={formatterY}
          />
          <Line
            dataKey={"goal"}
            stroke={COLORS[0]}
            strokeWidth={2}
            dot={false}
          />
          <ReferenceLine y={OBJECT_TODAY[0]?.goal} stroke={COLORS[0]} strokeDasharray={"3 3"}
          />
          <Bar
            dataKey={"real"} fill={COLORS[2]} radius={[10, 10, 0, 0]} minPointSize={1}
            barSize={20}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
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

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartWeek = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_WEEK, array, "exercise", "");
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
            dataKey={"goal"}
            fill={COLORS[0]}
            line={{stroke: COLORS[0], strokeWidth: 0.6}}
          />
          <Scatter
            dataKey={"real"}
            fill={COLORS[2]}
            line={{stroke: COLORS[2], strokeWidth: 0.6}}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
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
    const {domain, ticks, formatterY} = handlerY(OBJECT_MONTH, array, "exercise", "");
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
            dataKey={"goal"}
            fill={COLORS[0]}
            line={{stroke: COLORS[0], strokeWidth: 0.6}}
          />
          <Scatter
            dataKey={"real"}
            fill={COLORS[2]}
            line={{stroke: COLORS[2], strokeWidth: 0.6}}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0]?.payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
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
      const titleSection = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("chartBar")}
        </Div>
      );
      const selectSection1 = () => (
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
          <MenuItem value={"today"}>{translate("today")}</MenuItem>
          <MenuItem value={"week"}>{translate("week")}</MenuItem>
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
        </TextField>
        </Div>
      );
      const selectSection2 = () => (
        <Img src={common3_2} className={"w-24 h-24"} />
      );
      return (
        <Div className={"d-center"}>
          <Div className={"ms-0"}>{selectSection1()}</Div>
          <Div className={"ms-auto"}>{titleSection()}</Div>
          <Div className={"ms-auto me-0"}>{selectSection2()}</Div>
        </Div>
      );
    };
    // 7-2. chart
    const chartSection = () => {
      const chartFragment1 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartToday()}
        </Card>
      );
      const chartFragment2 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartWeek()}
        </Card>
      );
      const chartFragment3 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartMonth()}
        </Card>
      );
      if (SECTION === "today") {
        return LOADING ? <Loading /> : chartFragment1(0);
      }
      else if (SECTION === "week") {
        return LOADING ? <Loading /> : chartFragment2(0);
      }
      else if (SECTION === "month") {
        return LOADING ? <Loading /> : chartFragment3(0);
      }
    };
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