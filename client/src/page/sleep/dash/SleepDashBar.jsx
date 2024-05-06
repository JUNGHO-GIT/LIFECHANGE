// SleepDashBar.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";

import {Loading} from "../../../fragments/Loading.jsx";
import {handlerY} from "../../../assets/js/handlerY.js";
import {Bar, Line, ComposedChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import Grid2 from '@mui/material/Unstable_Grid2';
import {TextField, Typography} from "@mui/material";
import {Container, Card, Paper, Box, Badge} from "@mui/material";
import {Table, TableContainer, TableHead, TableBody, TableRow, TableCell} from "@mui/material";

// ------------------------------------------------------------------------------------------------>
export const SleepDashBar = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const user_id = sessionStorage.getItem("user_id");
  const array = ["목표", "실제"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const [LOADING, setLOADING] = useState(true);
  const [SECTION, setSECTION] = useState("today");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_TODAY_DEF = [
    {name:"", 목표: 0, 실제: 0}
  ];
  const [OBJECT_TODAY, setOBJECT_TODAY] = useState(OBJECT_TODAY_DEF);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const resToday = await axios.get(`${URL_OBJECT}/dash/bar/today`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_TODAY(
      resToday.data.result.length > 0 ? resToday.data.result : OBJECT_TODAY_DEF
    );
    setLOADING(false);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartToday = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_TODAY, array, "sleep");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_TODAY} margin={{top: 60, right: 60, bottom: 20, left: 20}}
          barGap={20} barCategoryGap={"20%"}>
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
            <Line dataKey={"목표"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
              activeDot={{r: 6}}
            ></Line>
            <Bar dataKey={"실제"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}
              barSize={20}></Bar>
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
            ></Tooltip>
            <Legend
              iconType={"circle"}
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{
                lineHeight:"40px", paddingTop:"10px", fontSize:"12px", marginLeft:"20px"
              }}
            ></Legend>
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 8. loading ----------------------------------------------------------------------------------->
  const loadingNode = () => (
    <Loading LOADING={LOADING} setLOADING={setLOADING}
    />
  );

  // 15. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"content-wrapper"}>
          <Container className={"p-0"}>
            <Grid2 container spacing={3}>
              <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"text-center"}>
                <select className={"form-select form-select-sm"}
                  onChange={(e) => (setSECTION(e.target.value))}
                  value={SECTION}
                >
                  <option value={"today"}>오늘</option>
                </select>
              </Grid2>
              <Grid2 xl={6} lg={6} md={6} sm={6} xs={6} className={"text-center"}>
                <span className={"dash-title"}>수면 목표</span>
              </Grid2>
              <Grid2 xl={3} lg={3} md={3} sm={3} xs={3} className={"text-center"}>
                <span></span>
              </Grid2>
            </Grid2>
            <Grid2 container spacing={3}>
              <Grid2 xl={12} lg={12} md={12} sm={12} xs={12} style={{alignSelf:"center"}}>
                {SECTION === "today" && (LOADING ? loadingNode() : chartToday())}
              </Grid2>
            </Grid2>
          </Container>
      </Card>
    </React.Fragment>
  );
};