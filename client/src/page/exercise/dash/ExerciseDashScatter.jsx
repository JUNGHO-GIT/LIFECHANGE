// ExerciseDashScatter.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {handlerY} from "../../../assets/js/handlerY.js";
import {useStorage} from "../../../hooks/useStorage.jsx";
import {Bar, Scatter, ComposedChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashScatter = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();
  const array = ["목표", "실제"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SECTION, set:setSECTION} = useStorage(
    `SECTION (scatter) (${PATH})`, "today"
  );
  const OBJECT_TODAY_DEFAULT = [
    {name:"", 목표: 0, 실제: 0},
  ];
  const OBJECT_WEEK_DEFAULT = [
    {name:"", 목표: 0, 실제: 0},
  ];
  const OBJECT_MONTH_DEFAULT = [
    {name:"", 목표: 0, 실제: 0},
  ];
  const [OBJECT_TODAY, setOBJECT_TODAY] = useState(OBJECT_TODAY_DEFAULT);
  const [OBJECT_WEEK, setOBJECT_WEEK] = useState(OBJECT_WEEK_DEFAULT);
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseToday = await axios.get(`${URL_OBJECT}/dash/scatter/today`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_TODAY(responseToday.data.result || OBJECT_TODAY_DEFAULT);

    const responseWeek = await axios.get(`${URL_OBJECT}/dash/scatter/week`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_WEEK(responseWeek.data.result || OBJECT_WEEK_DEFAULT);

    const responseMonth = await axios.get(`${URL_OBJECT}/dash/scatter/month`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_MONTH(responseMonth.data.result || OBJECT_MONTH_DEFAULT);
  })()}, [customer_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodeToday = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_TODAY, array);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_TODAY} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
            <Bar dataKey={"목표"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}
              barSize={20}
            ></Bar>
            <Bar dataKey={"실제"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}
              barSize={20}
            ></Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()} kg`)}
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

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_WEEK, array);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_WEEK} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
            <Scatter
              name={"목표"}
              dataKey={"목표"}
              fill={"#8884d8"}
              line={{stroke: "#aaa6ee", strokeWidth: 0.6}}
            ></Scatter>
            <Scatter
              name={"실제"}
              dataKey={"실제"}
              fill={"#82ca9d"}
              line={{stroke: "#8fd9b6", strokeWidth: 0.6}}
            ></Scatter>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()} kg`)}
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

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartNodeMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_MONTH, array);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}>
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
            <Scatter
              name={"목표"}
              dataKey={"목표"}
              fill={"#8884d8"}
              line={{stroke: "#aaa6ee", strokeWidth: 0.6}}
            ></Scatter>
            <Scatter
              name={"실제"}
              dataKey={"실제"}
              fill={"#82ca9d"}
              line={{stroke: "#8fd9b6", strokeWidth: 0.6}}
            ></Scatter>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()} kg`)}
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

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"border-0 border-bottom ms-2vw"}>
        <Container fluid={true}>
          <Row>
            <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setSECTION(e.target.value))}
                value={SECTION}
              >
                <option value={"today"}>오늘</option>
                <option value={"week"}>주간</option>
                <option value={"month"}>월간</option>
              </select>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className={"text-center"}>
              <span className={"dash-title"}>몸무게 목표/실제</span>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              <span></span>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              {SECTION === "today" && chartNodeToday()}
              {SECTION === "week" && chartNodeWeek()}
              {SECTION === "month" && chartNodeMonth()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};
