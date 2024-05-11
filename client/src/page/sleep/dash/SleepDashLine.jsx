// SleepDashLine.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Btn, Loading, PopDown} from "../../../import/ImportComponents.jsx";
import {CustomIcons} from "../../../import/ImportIcons.jsx";
import {Grid2, Container, Card, Paper, TextField, Typography} from "../../../import/ImportMuis.jsx";
import {Box, Badge, Menu, MenuItem} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, FormControl, Select, Switch} from "../../../import/ImportMuis.jsx";
import {IconButton, Button, Divider} from "../../../import/ImportMuis.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const SleepDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const array = ["취침", "수면", "기상"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [PART, setPART] = useState(array);

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_WEEK_DEF = [
    {name:"", 취침: 0, 기상: 0, 수면: 0},
  ];
  const OBJECT_MONTH_DEF = [
    {name:"", 취침: 0, 기상: 0, 수면: 0},
  ];
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEF);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEF);

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
    setOBJECT_WEEK(
      resWeek.data.result.length > 0 ? resWeek.data.result : OBJECT_WEEK_DEF
    );
    setOBJECT_MONTH(
      resMonth.data.result.length > 0 ? resMonth.data.result : OBJECT_MONTH_DEF
    );
    setLOADING(false);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_WEEK, array, "sleep");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
          {PART.includes("취침") && (
            <Line dataKey={"취침"} type={"monotone"} stroke={"#8884d8"} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("기상") && (
            <Line dataKey={"기상"} type={"monotone"} stroke={"#ffc658"} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("수면") && (
            <Line dataKey={"수면"} type={"monotone"} stroke={"#82ca9d"} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
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
  const chartMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_MONTH, array, "sleep");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
          {PART.includes("취침") && (
            <Line dataKey={"취침"} type={"monotone"} stroke={"#8884d8"} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("기상") && (
            <Line dataKey={"기상"} type={"monotone"} stroke={"#ffc658"} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
          {PART.includes("수면") && (
            <Line dataKey={"수면"} type={"monotone"} stroke={"#82ca9d"} activeDot={{r:8}}
            strokeWidth={2}/>
          )}
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
      className={"w-90"}
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
      ["취침", "기상", "수면"]?.map((key, index) => (
        <FormGroup key={index} className={"p-5 pe-10"}>
          <FormControlLabel control={<Switch checked={PART.includes(key)} onChange={() => {
            if (PART.includes(key)) {
              setPART(PART?.filter((item) => (item !== key)));
            }
            else {
              setPART([...PART, key]);
            }
          }
          }/>} label={key} labelPlacement={"start"}>
          </FormControlLabel>
        </FormGroup>
      ))
    }>
      {popProps => (
        <IconButton onClick={(e) => {popProps.openPopup(e.currentTarget)}} id={"popChild"}>
          <CustomIcons name={"BiDotsHorizontalRounded"} className={"w-24 h-24 dark"} />
        </IconButton>
      )}
    </PopDown>
  );

  // 14. loading ---------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Paper className={"content-wrapper over-x-hidden"} variant={"outlined"}>
        <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              {dropdownSection1()}
            </Grid2>
            <Grid2 xl={6} lg={6} md={6} sm={6} xs={6} className={"d-center"}>
              <Typography variant={"h6"} className={"dash-title"}>
                수면 추이
              </Typography>
            </Grid2>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-right"}>
              {dropdownSection3()}
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
              {SECTION === "week" && (
                LOADING ? loadingNode() : chartWeek()
              )}
              {SECTION === "month" && (
                LOADING ? loadingNode() : chartMonth()
              )}
            </Grid2>
          </Grid2>
        </Container>
      </Paper>
    </React.Fragment>
  );
};
