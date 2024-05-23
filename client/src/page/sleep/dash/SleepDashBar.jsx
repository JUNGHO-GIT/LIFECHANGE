// SleepDashBar.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {Div, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {Bar, Line, ComposedChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const SleepDashBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL + SUBFIX;
  const array = ["목표", "실제"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("today");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_TODAY_DEF = [
    {name:"", date:"", 목표: 0, 실제: 0}
  ];
  const [OBJECT_TODAY, setOBJECT_TODAY] = useState(OBJECT_TODAY_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resToday = await axios.get(`${URL_OBJECT}/dash/bar/today`, {
      params: {
        user_id: sessionId
      },
    });
    setOBJECT_TODAY(
      resToday.data.result.length > 0 ? resToday.data.result : OBJECT_TODAY_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartToday = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_TODAY, array, "sleep");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <ComposedChart data={OBJECT_TODAY} margin={{top: 60, right: 20, bottom: 20, left: -20}}
        barGap={20} barCategoryGap={"20%"}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={{stroke:"#e0e0e0"}}
            tick={{fill:"#666", fontSize:14}}
          />
          <Line dataKey={"목표"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
            activeDot={{r: 6}}
          />
          <Bar dataKey={"실제"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}
            barSize={20}
          />
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              return `${Number(value).toLocaleString()}`;
            }}
            cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
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
              display:"flex",
              justifyContent:"center",
              alignItems:"center",
              left: "none",
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
      <Div className={"d-center"}>수면 목표</Div>
    );
    // 7-5. dropdown
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
        </TextField>
      </Div>
    );
    // 7-5. dropdown
    const dropdownSection2 = () => (
      "\u00A0"
    );
    // 7-7. fragment
    const dashFragment1 = (i) => (
      <Card variant={"outlined"} className={"p-10"}>
        {chartToday()}
      </Card>
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "today") {
        return LOADING ? loadingNode() : dashFragment1();
      }
    }
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center mt-n10"}>
        <Div className={"ms-0"}>{dropdownSection1()}</Div>
        <Div className={"ms-auto me-auto"}>{titleSection()}</Div>
        <Div className={"ms-auto"}>{dropdownSection2()}</Div>
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