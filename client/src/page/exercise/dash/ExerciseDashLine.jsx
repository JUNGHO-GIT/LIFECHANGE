// ExerciseDashLine.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios} from "../../../import/ImportLibs.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {PopUp, Div} from "../../../import/ImportComponents.jsx";
import {Paper} from "../../../import/ImportMuis.jsx";
import {MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {common3} from "../../../import/ImportImages.jsx";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const array = ["볼륨", "시간"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const [userId, setUserId] = useState(sessionStorage.getItem("userId") || "{}");
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("volume");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_VOLUME_WEEK_DEF = [
    {name:"", date:"", 볼륨: 0},
  ];
  const OBJECT_CARDIO_WEEK_DEF = [
    {name:"", date:"", 시간: 0},
  ];
  const OBJECT_VOLUME_MONTH_DEF = [
    {name:"", date:"", 볼륨: 0},
  ];
  const OBJECT_CARDIO_MONTH_DEF = [
    {name:"", date:"", 시간: 0},
  ];
  const [OBJECT_VOLUME_WEEK, setOBJECT_VOLUME_WEEK] = useState(OBJECT_VOLUME_WEEK_DEF);
  const [OBJECT_CARDIO_WEEK, setOBJECT_CARDIO_WEEK] = useState(OBJECT_CARDIO_WEEK_DEF);
  const [OBJECT_VOLUME_MONTH, setOBJECT_VOLUME_MONTH] = useState(OBJECT_VOLUME_MONTH_DEF);
  const [OBJECT_CARDIO_MONTH, setOBJECT_CARDIO_MONTH] = useState(OBJECT_CARDIO_MONTH_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resWeek = await axios.get(`${URL_OBJECT}/dash/line/week`, {
      params: {
        user_id: userId
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/dash/line/month`, {
      params: {
        user_id: userId
      },
    });
    setOBJECT_VOLUME_WEEK(
      resWeek.data.result.volume.length > 0 ? resWeek.data.result.volume : OBJECT_VOLUME_WEEK_DEF
    );
    setOBJECT_CARDIO_WEEK(
      resWeek.data.result.cardio.length > 0 ? resWeek.data.result.cardio : OBJECT_CARDIO_WEEK_DEF
    );
    setOBJECT_VOLUME_MONTH(
      resMonth.data.result.volume.length > 0 ? resMonth.data.result.volume : OBJECT_VOLUME_MONTH_DEF
    );
    setOBJECT_CARDIO_MONTH(
      resMonth.data.result.cardio.length > 0 ? resMonth.data.result.cardio : OBJECT_CARDIO_MONTH_DEF
    );
    setLOADING(false);
  })()}, [userId]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartVolumeWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_VOLUME_WEEK, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_VOLUME_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
          <Line dataKey={"볼륨"} type={"monotone"} stroke={"#8884d8"} activeDot={{r:8}}
          strokeWidth={2}/>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}`)}
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartCardioWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_CARDIO_WEEK, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_CARDIO_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
          <Line dataKey={"시간"} type={"monotone"} stroke={"#82ca9d"} activeDot={{r:8}}
          strokeWidth={2}/>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}`)}
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartVolumeMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_VOLUME_MONTH, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_VOLUME_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
          <Line dataKey={"볼륨"} type={"monotone"} stroke={"#8884d8"} activeDot={{r:8}}
          strokeWidth={2}/>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}`)}
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartCardioMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_CARDIO_MONTH, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_CARDIO_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
          <Line dataKey={"시간"} type={"monotone"} stroke={"#82ca9d"} activeDot={{r:8}}
          strokeWidth={2}/>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}`)}
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
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 7. dash -------------------------------------------------------------------------------------->
  const dashNode = () => {
    // 7-5-1. dropdown
    const dropdownSection1 = () => (
      <TextField
        select={true}
        type={"text"}
        size={"small"}
        className={"w-20vw"}
        variant={"outlined"}
        value={SECTION}
        onChange={(e) => (
          setSECTION(e.target.value)
        )}
      >
        <MenuItem value={"week"}>주간</MenuItem>
        <MenuItem value={"month"}>월간</MenuItem>
      </TextField>
    );
    // 7-5-2. dropdown
    const dropdownSection2 = () => (
      <PopUp
        type={"dash"}
        position={"bottom"}
        direction={"left"}
        contents={({closePopup}) => (
        ["volume", "cardio"].map((key, index) => (
          <FormGroup key={index}>
            <FormControlLabel control={<Switch checked={LINE === key} onChange={() => {
              if (LINE === key) {
                setLINE("");
              }
              else {
                setLINE(key);
              }
            }}/>} label={key} labelPlacement={"start"}>
            </FormControlLabel>
          </FormGroup>
        ))
        )}>
        {(popTrigger={}) => (
          <img src={common3} className={"w-24 h-24 pointer"} alt={"common3"}
            onClick={(e) => {
              popTrigger.openPopup(e.currentTarget)
            }}
          />
        )}
      </PopUp>
    );
    // 7-6. dash
    const dashSection = () => (
      <Div className={"block-wrapper h-min40vh h-max-60vh p-0"}>
        <Div className={"d-center"}>
          <Div className={"d-center ms-10"}>{dropdownSection1()}</Div>
          <Div className={"d-center m-auto fs-1-0rem"}>볼륨 / 유산소 추이</Div>
          <Div className={"d-center ms-auto me-10"}>{dropdownSection2()}</Div>
        </Div>
        <Div className={"d-column"}>
          {SECTION === "week" && LINE === "volume" && (
            LOADING ? loadingNode() : chartVolumeWeek()
          )}
          {SECTION === "week" && LINE === "cardio" && (
            LOADING ? loadingNode() : chartCardioWeek()
          )}
          {SECTION === "month" && LINE === "volume" && (
            LOADING ? loadingNode() : chartVolumeMonth()
          )}
          {SECTION === "month" && LINE === "cardio" && (
            LOADING ? loadingNode() : chartCardioMonth()
          )}
        </Div>
      </Div>
    );
    // 7-7 return
    return (
      <Paper className={"content-wrapper border-bottom"}>
        {dashSection()}
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