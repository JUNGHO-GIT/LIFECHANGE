// FoodDashLine.jsx

import {React, useState, useEffect} from "../../../import/ImportReacts.jsx";
import {axios, moment} from "../../../import/ImportLibs.jsx";
import {handlerY} from "../../../import/ImportLogics";
import {Btn, Loading, PopDown} from "../../../import/ImportComponents.jsx";
import {CustomIcons} from "../../../import/ImportIcons.jsx";
import {Grid2, Container, Card, Paper} from "../../../import/ImportMuis.jsx";
import {Box, Badge, Menu, MenuItem, TextField, Typography} from "../../../import/ImportMuis.jsx";
import {FormGroup, FormControlLabel, FormControl, Select, Switch} from "../../../import/ImportMuis.jsx";
import {IconButton, Button, Divider} from "../../../import/ImportMuis.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const FoodDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const array = ["칼로리", "탄수화물", "단백질", "지방"];

  // 2-2. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("kcal");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_WEEK_DEF = [
    {name:"", 칼로리: 0},
  ];
  const OBJECT_NUT_WEEK_DEF = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const OBJECT_KCAL_MONTH_DEF = [
    {name:"", 칼로리: 0},
  ];
  const OBJECT_NUT_MONTH_DEF = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const [OBJECT_KCAL_WEEK, setOBJECT_KCAL_WEEK] = useState(OBJECT_KCAL_WEEK_DEF);
  const [OBJECT_NUT_WEEK, setOBJECT_NUT_WEEK] = useState(OBJECT_NUT_WEEK_DEF);
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState(OBJECT_KCAL_MONTH_DEF);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState(OBJECT_NUT_MONTH_DEF);

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
    setOBJECT_KCAL_WEEK(
      resWeek.data.result.kcal.length > 0 ? resWeek.data.result.kcal : OBJECT_KCAL_WEEK_DEF
    );
    setOBJECT_NUT_WEEK(
      resWeek.data.result.nut.length > 0 ? resWeek.data.result.nut : OBJECT_NUT_WEEK_DEF
    );
    setOBJECT_KCAL_MONTH(
      resMonth.data.result.kcal.length > 0 ? resMonth.data.result.kcal : OBJECT_KCAL_MONTH_DEF
    );
    setOBJECT_NUT_MONTH(
      resMonth.data.result.nut.length > 0 ? resMonth.data.result.nut : OBJECT_NUT_MONTH_DEF
    );
    setLOADING(false);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartKcalWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_WEEK, array, "food");
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_KCAL_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <Line dataKey={"칼로리"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
          activeDot={{r: 6}}/>
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}kcal`)}
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
  const chartNutWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_WEEK, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_NUT_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <Line dataKey={"탄수화물"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Line dataKey={"단백질"} type={"monotone"} stroke={"#82ca9d"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Line dataKey={"지방"} type={"monotone"} stroke={"#ffc658"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}g`)}
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
  const chartKcalMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_MONTH, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_KCAL_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <Line dataKey={"칼로리"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}kcal`)}
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
  const chartNutMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_MONTH, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_NUT_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}/>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          />
          <Line dataKey={"탄수화물"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Line dataKey={"단백질"} type={"monotone"} stroke={"#82ca9d"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Line dataKey={"지방"} type={"monotone"} stroke={"#ffc658"} strokeWidth={2}
          activeDot={{r: 6}} />
          <Tooltip
            formatter={(value) => (`${Number(value).toLocaleString()}g`)}
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
      ["kcal", "nut"]?.map((key, index) => (
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
              <Typography variant={"h6"} className={"dash-title"}>칼로리/영양소 추이</Typography>
            </Grid2>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-right"}>
              {dropdownSection3()}
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} className={"d-center"}>
              {SECTION === "week" && LINE === "kcal" && (
                LOADING ? loadingNode() : chartKcalWeek()
              )}
              {SECTION === "week" && LINE === "nut" && (
                LOADING ? loadingNode() : chartNutWeek()
              )}
              {SECTION === "month" && LINE === "kcal" && (
                LOADING ? loadingNode() : chartKcalMonth()
              )}
              {SECTION === "month" && LINE === "nut" && (
                LOADING ? loadingNode() : chartNutMonth()
              )}
            </Grid2>
          </Grid2>
        </Container>
      </Paper>
    </React.Fragment>
  );
};