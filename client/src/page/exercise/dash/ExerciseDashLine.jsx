// ExerciseDashLine.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Loading} from "../../../import/ImportLayouts.jsx";
import {Adornment, Icons, PopAlert, PopUp, PopDown} from "../../../import/ImportComponents.jsx";
import {Div, Hr10, Br10, Paging, Filter, Btn} from "../../../import/ImportComponents.jsx";
import {Grid2, Container, Card, Paper} from "../../../import/ImportMuis.jsx";
import {Badge, Menu, MenuItem, TextField} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, Switch} from "../../../import/ImportMuis.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id") || "{}";
  const array = ["볼륨", "시간"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("volume");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_VOLUME_WEEK_DEF = [
    {name:"", 볼륨: 0},
  ];
  const OBJECT_CARDIO_WEEK_DEF = [
    {name:"", 시간: 0},
  ];
  const OBJECT_VOLUME_MONTH_DEF = [
    {name:"", 볼륨: 0},
  ];
  const OBJECT_CARDIO_MONTH_DEF = [
    {name:"", 시간: 0},
  ];
  const [OBJECT_VOLUME_WEEK, setOBJECT_VOLUME_WEEK] = useState(OBJECT_VOLUME_WEEK_DEF);
  const [OBJECT_CARDIO_WEEK, setOBJECT_CARDIO_WEEK] = useState(OBJECT_CARDIO_WEEK_DEF);
  const [OBJECT_VOLUME_MONTH, setOBJECT_VOLUME_MONTH] = useState(OBJECT_VOLUME_MONTH_DEF);
  const [OBJECT_CARDIO_MONTH, setOBJECT_CARDIO_MONTH] = useState(OBJECT_CARDIO_MONTH_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resWeek = await axios.get(`${URL_OBJECT}/dash/line/week`, {
      params: {
        user_id: user_id
      },
    });
    const resMonth = await axios.get(`${URL_OBJECT}/dash/line/month`, {
      params: {
        user_id: user_id
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
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartVolumeWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_VOLUME_WEEK, array, "exercise");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_VOLUME_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
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
        <LineChart data={OBJECT_CARDIO_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
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
        <LineChart data={OBJECT_VOLUME_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
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
        <LineChart data={OBJECT_CARDIO_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
              lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
            }}
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 7-1. dropdown -------------------------------------------------------------------------------->
  const dropdownSection1 = () => (
    <TextField
      select={true}
      type={"text"}
      size={"small"}
      id={"section"}
      name={"section"}
      className={"w-65 mt-5"}
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

  // 7-3. dropdown -------------------------------------------------------------------------------->
  const dropdownSection3 = () => (
    <PopDown elementId={"popChild"} contents={
      ["volume", "cardio"].map((key, index) => (
        <FormGroup key={index} className={"p-5 pe-10"}>
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
    }>
      {popProps => (
        <Icons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark pointer"}
          id={"popChild"} onClick={(e) => {
            popProps.openPopup(e.currentTarget)
          }}
        />
      )}
    </PopDown>
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING} />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <>
      <Paper className={"content-wrapper over-x-hidden"} variant={"outlined"}>
        <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              {dropdownSection1()}
            </Grid2>
            <Grid2 xl={6} lg={6} md={6} sm={6} xs={6} className={"d-center"}>
              <p className={"dash-title"}>볼륨 / 유산소 추이</p>
            </Grid2>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-right"}>
              {dropdownSection3()}
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
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
            </Grid2>
          </Grid2>
        </Container>
      </Paper>
    </>
  );
};