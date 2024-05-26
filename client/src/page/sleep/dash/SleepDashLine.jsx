// SleepDashLine.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, TextField, MenuItem} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_1} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const SleepDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL + SUBFIX;
  const array = ["취침", "수면", "기상"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("week");
  const [PART, setPART] = useState(array);
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_WEEK_DEF = [
    {name:"", day: "", 취침: 0, 기상: 0, 수면: 0},
  ];
  const OBJECT_MONTH_DEF = [
    {name:"", day: "", 취침: 0, 기상: 0, 수면: 0},
  ];
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEF);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    setLOADING(true);
    const resWeek = await axios.get(`${URL_OBJECT}/dash/line/week`, {
      params: {
        user_id: sessionId
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/dash/line/month`, {
      params: {
        user_id: sessionId
      },
    });
    setOBJECT_WEEK(
      resWeek.data.result.length > 0 ? resWeek.data.result : OBJECT_WEEK_DEF
    );
    setOBJECT_MONTH(
      resMonth.data.result.length > 0 ? resMonth.data.result : OBJECT_MONTH_DEF
    );
    setLOADING(false);
  })()}, [sessionId]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_WEEK, array, "sleep");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_WEEK} margin={{top: 20, right: 20, bottom: 20, left: 20}}
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
          {PART.includes("취침") && (
            <Line dataKey={"취침"} type={"monotone"} stroke={COLORS[4]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("기상") && (
            <Line dataKey={"기상"} type={"monotone"} stroke={COLORS[1]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("수면") && (
            <Line dataKey={"수면"} type={"monotone"} stroke={COLORS[2]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              return `${Number(value).toLocaleString()}`;
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_MONTH, array, "sleep");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_MONTH} margin={{top: 20, right: 20, bottom: 20, left: 20}}
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
          {PART.includes("취침") && (
            <Line dataKey={"취침"} type={"monotone"} stroke={COLORS[4]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("기상") && (
            <Line dataKey={"기상"} type={"monotone"} stroke={COLORS[1]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("수면") && (
            <Line dataKey={"수면"} type={"monotone"} stroke={COLORS[2]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          <Tooltip
            labelFormatter={(label, payload) => {
              const date = payload.length > 0 ? payload[0].payload.date : '';
              return `${date}`;
            }}
            formatter={(value, name, props) => {
              return `${Number(value).toLocaleString()}`;
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5. title
    const titleSection = () => (
      <Div className={"d-center"}>수면 추이</Div>
    );
    // 7-4. dropdown
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
        <MenuItem value={"week"}>주간</MenuItem>
        <MenuItem value={"month"}>월간</MenuItem>
      </TextField>
      </Div>
    );
    // 7-4. dropdown
    const dropdownSection2 = () => (
      <PopUp
        type={"dash"}
        position={"bottom"}
        direction={"center"}
        contents={({closePopup}) => (
        ["취침", "기상", "수면"]?.map((key, index) => (
          <FormGroup key={index}>
            <FormControlLabel
              control={<Switch checked={PART.includes(key)}
              onChange={() => {
                if (PART.includes(key)) {
                  if(PART.length > 1) {
                    setPART(PART?.filter((item) => (item !== key)));
                  }
                  else {
                    return;
                  }
                }
                else {
                  setPART([...PART, key]);
                }
              }}/>}
              label={key}
              labelPlacement={"start"}>
            </FormControlLabel>
          </FormGroup>
        )))}>
        {(popTrigger={}) => (
          <Img src={common3_1} className={"w-24 h-24 pointer"} onClick={(e) => {
            popTrigger.openPopup(e.currentTarget)
          }}/>
        )}
      </PopUp>
    );
    // 7-7. fragment
    const dashFragment1 = (i=0) => (
      <Card className={"p-10"} key={i}>
        {chartWeek()}
      </Card>
    );
    // 7-7. fragment
    const dashFragment2 = (i=0) => (
      <Card className={"p-10"} key={i}>
        {chartMonth()}
      </Card>
    );
    // 7-8. dash
    const dashSection = () => {
      if (SECTION === "week") {
        return LOADING ? loadingNode() : dashFragment1(0);
      }
      else if (SECTION === "month") {
        return LOADING ? loadingNode() : dashFragment2(0);
      }
    }
    // 7-9. first
    const firstSection = () => (
      <Div className={"d-center mt-n10"}>
        <Div className={"ms-0"}>{dropdownSection1()}</Div>
        <Div className={"ms-auto me-auto"}>{titleSection()}</Div>
        <Div className={"me-0"}>{dropdownSection2()}</Div>
      </Div>
    );
    // 7-9. third
    const thirdSection = () => (
      dashSection()
    );
    // 7-10. return
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
