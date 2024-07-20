// SleepDashLine.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {useTranslate} from "../../../import/ImportHooks.jsx";
import {handlerY} from "../../../import/ImportUtils";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div, Img, Br20} from "../../../import/ImportComponents.jsx";
import {Paper, Card, TextField, MenuItem} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3_1} from "../../../import/ImportImages.jsx";

// -------------------------------------------------------------------------------------------------
export const SleepDashLine = () => {

  // 1. common -------------------------------------------------------------------------------------
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL + SUBFIX;
  const {translate} = useTranslate();
  const array = ["bedTime", "wakeTime", "sleepTime"];

  // 2-2. useState ---------------------------------------------------------------------------------
  const sessionId = sessionStorage.getItem("sessionId");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("week");
  const [PART, setPART] = useState(array);
  const COLORS = [
    "#0088FE", "#00C49F", "#FFBB28", "#FF5733", "#6F42C1",
    "#0EA5E9", "#22C55E", "#D97706", "#EF4444", "#9333EA",
  ];

  // 2-2. useState ---------------------------------------------------------------------------------
  const OBJECT_WEEK_DEF = [
    {name:"", day: "", bedTime: 0, wakeTime: 0, sleepTime: 0},
  ];
  const OBJECT_MONTH_DEF = [
    {name:"", day: "", bedTime: 0, wakeTime: 0, sleepTime: 0},
  ];
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEF);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);

  // 2-3. useEffect --------------------------------------------------------------------------------
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

  // 5-1. chart ------------------------------------------------------------------------------------
  const chartWeek = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_WEEK, array, "sleep");
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
            tick={{fill:"#666", fontSize:14}}
            tickFormatter={formatterY}
          />
          {PART.includes("bedTime") && (
            <Line dataKey={"bedTime"} type={"monotone"} stroke={COLORS[4]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("wakeTime") && (
            <Line dataKey={"wakeTime"} type={"monotone"} stroke={COLORS[1]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("sleepTime") && (
            <Line dataKey={"sleepTime"} type={"monotone"} stroke={COLORS[2]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ------------------------------------------------------------------------------------
  const chartMonth = () => {
    const {domain, ticks, formatterY} = handlerY(OBJECT_MONTH, array, "sleep");
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
            tick={{fill:"#666", fontSize:14}}
            tickFormatter={formatterY}
          />
          {PART.includes("bedTime") && (
            <Line dataKey={"bedTime"} type={"monotone"} stroke={COLORS[4]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("wakeTime") && (
            <Line dataKey={"wakeTime"} type={"monotone"} stroke={COLORS[1]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("sleepTime") && (
            <Line dataKey={"sleepTime"} type={"monotone"} stroke={COLORS[2]} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash ---------------------------------------------------------------------------------------
  const dashNode = () => {
    // 7-1. head
    const headSection = () => {
      const titleSection = () => (
        <Div className={"d-center fs-0-9rem"}>
          {translate("dashLine")}
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
          <MenuItem value={"week"}>{translate("week")}</MenuItem>
          <MenuItem value={"month"}>{translate("month")}</MenuItem>
        </TextField>
        </Div>
      );
      const selectSection2 = () => (
        <PopUp
          type={"dash"}
          position={"bottom"}
          direction={"center"}
          contents={({closePopup}) => (
          ["bedTime", "wakeTime", "sleepTime"]?.map((key, index) => (
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
                label={translate(key)}
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
      return (
        <Div className={"d-center mt-n10"}>
          <Div className={"ms-0"}>{selectSection1()}</Div>
          <Div className={"ms-auto"}>{titleSection()}</Div>
          <Div className={"ms-auto me-0"}>{selectSection2()}</Div>
        </Div>
      );
    };
    // 7-2. dash
    const dashSection = () => {
      const loadingFragment = () => (
        <Loading
          LOADING={LOADING}
          setLOADING={setLOADING}
        />
      );
      const dashFragment1 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartWeek()}
        </Card>
      );
      const dashFragment2 = (i) => (
        <Card className={"border radius shadow-none p-20"} key={i}>
          {chartMonth()}
        </Card>
      );
      if (SECTION === "week") {
        return LOADING ? loadingFragment() : dashFragment1(0);
      }
      else if (SECTION === "month") {
        return LOADING ? loadingFragment() : dashFragment2(0);
      }
    }
    // 7-10. return
    return (
      <Paper className={"content-wrapper radius border shadow-none pb-30"}>
        <Div className={"block-wrapper h-min40vh"}>
          {headSection()}
          <Br20/>
          {dashSection()}
        </Div>
      </Paper>
    );
  };

  // 10. return ------------------------------------------------------------------------------------
  return (
    <>
      {dashNode()}
    </>
  );
};
