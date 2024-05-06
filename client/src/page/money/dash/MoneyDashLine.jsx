// MoneyDashLine.jsx

import "moment/locale/ko";
import moment from "moment-timezone";
import axios from "axios";
import React, {useEffect, useState} from "react";
import {Loading} from "../../../fragments/Loading.jsx";
import {handlerY} from "../../../assets/js/handlerY.js";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import Grid2 from '@mui/material/Unstable_Grid2';
import {Container, Card, Box, Paper} from "@mui/material";
import {MenuItem, FormControl, Select} from "@mui/material";
import {FormGroup, FormControlLabel, Switch} from "@mui/material";
import PopupState, { bindTrigger, bindMenu } from 'material-ui-popup-state';
import {IconButton, Menu} from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';

// ------------------------------------------------------------------------------------------------>
export const MoneyDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const array = ["수입", "지출"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("in");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_IN_WEEK_DEF = [
    {name:"", 수입: 0},
  ];
  const OBJECT_OUT_WEEK_DEF = [
    {name:"", 지출: 0},
  ];
  const OBJECT_IN_MONTH_DEF = [
    {name:"", 수입: 0},
  ];
  const OBJECT_OUT_MONTH_DEF = [
    {name:"", 지출: 0},
  ];
  const [OBJECT_IN_WEEK, setOBJECT_IN_WEEK] = useState(OBJECT_IN_WEEK_DEF);
  const [OBJECT_OUT_WEEK, setOBJECT_OUT_WEEK] = useState(OBJECT_OUT_WEEK_DEF);
  const [OBJECT_IN_MONTH, setOBJECT_IN_MONTH] = useState(OBJECT_IN_MONTH_DEF);
  const [OBJECT_OUT_MONTH, setOBJECT_OUT_MONTH] = useState(OBJECT_OUT_MONTH_DEF);

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
    setOBJECT_IN_WEEK(
      resWeek.data.result.in.length > 0 ? resWeek.data.result.in : OBJECT_IN_WEEK_DEF
    );
    setOBJECT_OUT_WEEK(
      resWeek.data.result.out.length > 0 ? resWeek.data.result.out : OBJECT_OUT_WEEK_DEF
    );
    setOBJECT_IN_MONTH(
      resMonth.data.result.in.length > 0 ? resMonth.data.result.in : OBJECT_IN_MONTH_DEF
    );
    setOBJECT_OUT_MONTH(
      resMonth.data.result.out.length > 0 ? resMonth.data.result.out : OBJECT_OUT_MONTH_DEF
    );
    setLOADING(false);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartInWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_IN_WEEK, array, "money");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT_IN_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Line dataKey={"수입"} type={"monotone"} stroke={"#82ca9d"} strokeWidth={2}
            activeDot={{r:8}}></Line>
            <Tooltip
              formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartOutWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_OUT_WEEK, array, "money");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT_OUT_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Line dataKey={"지출"} type={"monotone"} stroke={"#ff7300"} strokeWidth={2}
            activeDot={{r:8}}></Line>
            <Tooltip
              formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartInMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_IN_MONTH, array);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT_IN_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Line dataKey={"수입"} type={"monotone"} stroke={"#82ca9d"} strokeWidth={2}
            activeDot={{r:8}}></Line>
            <Tooltip
              formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartOutMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_OUT_MONTH, array);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT_OUT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
            <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
            <XAxis
              type={"category"}
              dataKey={"name"}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></XAxis>
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            <Line dataKey={"지출"} type={"monotone"} stroke={"#ff7300"} strokeWidth={2}
            activeDot={{r:8}}></Line>
            <Tooltip
              formatter={(value) => (`₩ ${Number(value).toLocaleString()}`)}
              cursor={{fill:"rgba(0, 0, 0, 0.1)"}}
              contentStyle={{
                borderRadius:"10px",
                boxShadow:"0 2px 4px 0 rgba(0, 0, 0, 0.1)",
                padding:"10px",
                border:"none",
                background:"#fff",
                color:"#666"
              }}
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 7-1. dropdown -------------------------------------------------------------------------------->
  const dropdownSection1 = () => (
    <FormControl size={"small"} variant={"outlined"}>
      <Select id={"section"} value={SECTION} className={"form-select"}
      onChange={(e) => (
        setSECTION(e.target.value)
      )}>
        <MenuItem value={"week"}>주간</MenuItem>
        <MenuItem value={"month"}>월간</MenuItem>
      </Select>
    </FormControl>
  );

  // 7-3. dropdown -------------------------------------------------------------------------------->
  const dropdownSection3 = () => (
    <PopupState variant={"popover"} popupId={"popup"}>
      {(popupState) => (
        <React.Fragment>
          <IconButton {...bindTrigger(popupState)}>
            <MoreVertIcon fontSize={"small"} color={"action"}></MoreVertIcon>
          </IconButton>
          <Menu {...bindMenu(popupState)}>
            {["in", "out"]?.map((key, index) => (
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
            ))}
          </Menu>
        </React.Fragment>
      )}
    </PopupState>
  );

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Paper className={"content-wrapper"} variant={"outlined"}>
          <Container className={"p-0"}>
          <Grid2 container spacing={3}>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              {dropdownSection1()}
            </Grid2>
            <Grid2 xl={6} lg={6} md={6} sm={6} xs={6} className={"d-center"}>
              <span className={"dash-title"}>수입/지출 추이</span>
            </Grid2>
            <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"d-right"}>
              {dropdownSection3()}
            </Grid2>
          </Grid2>
          <Grid2 container spacing={3}>
            <Grid2 xl={12} lg={12} md={12} sm={12} xs={12}>
              {SECTION === "week" && LINE === "in" && (LOADING ? loadingNode() : chartInWeek())}
              {SECTION === "week" && LINE === "out" && (LOADING ? loadingNode() : chartOutWeek())}
              {SECTION === "month" && LINE === "in" && (LOADING ? loadingNode() : chartInMonth())}
              {SECTION === "month" && LINE === "out" && (LOADING ? loadingNode() : chartOutMonth())}
            </Grid2>
            </Grid2>
          </Container>
      </Paper>
    </React.Fragment>
  );
};