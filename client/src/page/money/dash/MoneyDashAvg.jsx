// MoneyDashAvg.jsx

import axios from "axios";
import {ComposedChart, Bar} from "recharts";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {handlerY} from "../../../assets/js/handlerY.js";
import {useStorage} from "../../../hooks/useStorage.jsx";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const MoneyDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_MONEY || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const user_id = sessionStorage.getItem("user_id");
  const array = ["수입", "지출"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("in");

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_IN_MONTH_DEFAULT = [
    {name:"", 수입: 0},
  ];
  const OBJECT_OUT_MONTH_DEFAULT = [
    {name:"", 지출: 0},
  ];
  const OBJECT_IN_YEAR_DEFAULT = [
    {name:"", 수입: 0},
  ];
  const OBJECT_OUT_YEAR_DEFAULT = [
    {name:"", 지출: 0},
  ];
  const [OBJECT_IN_MONTH, setOBJECT_IN_MONTH] = useState(OBJECT_IN_MONTH_DEFAULT);
  const [OBJECT_OUT_MONTH, setOBJECT_OUT_MONTH] = useState(OBJECT_OUT_MONTH_DEFAULT);
  const [OBJECT_IN_YEAR, setOBJECT_IN_YEAR] = useState(OBJECT_IN_YEAR_DEFAULT);
  const [OBJECT_OUT_YEAR, setOBJECT_OUT_YEAR] = useState(OBJECT_OUT_YEAR_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseMonth = await axios.get(`${URL_OBJECT}/dash/avg/month`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_IN_MONTH(responseMonth.data.result.in || OBJECT_IN_MONTH_DEFAULT);
    setOBJECT_OUT_MONTH(responseMonth.data.result.out || OBJECT_OUT_MONTH_DEFAULT);

    const responseYear = await axios.get(`${URL_OBJECT}/dash/avg/year`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_IN_YEAR(responseYear.data.result.in || OBJECT_IN_YEAR_DEFAULT);
    setOBJECT_OUT_YEAR(responseYear.data.result.out || OBJECT_OUT_YEAR_DEFAULT);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartInMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_IN_MONTH, array, "money");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_IN_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
          barGap={8} barCategoryGap={"20%"}>
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
            <Bar dataKey={"수입"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartOutMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_OUT_MONTH, array, "money");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_OUT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
          barGap={8} barCategoryGap={"20%"}>
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
            <Bar dataKey={"지출"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartInYear = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_IN_YEAR, array, "money");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_IN_YEAR} margin={{top: 60, right: 20, bottom: 20, left: -20}}
          barGap={8} barCategoryGap={"20%"}>
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
            <Bar dataKey={"수입"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartOutYear = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_OUT_YEAR, array, "money");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_OUT_YEAR} margin={{top: 60, right: 20, bottom: 20, left: -20}}
          barGap={8} barCategoryGap={"20%"}>
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
            <Bar dataKey={"지출"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
            </Bar>
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 12. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"content-wrapper"}>
        <Card className={"card-wrapper"}>
          <Container fluid={true}>
          <Row>
            <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setSECTION(e.target.value))}
                value={SECTION}
              >
                <option value={"month"}>월간</option>
                <option value={"year"}>연간</option>
              </select>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className={"text-center"}>
              <span className={"dash-title"}>수입/지출 평균</span>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setLINE(e.target.value))}
                value={LINE}
              >
                <option value={"in"}>수입</option>
                <option value={"out"}>지출</option>
              </select>
            </Col>
          </Row>
          <Row>
            <Col lg={12} md={12} sm={12} xs={12}>
              {SECTION === "month" && LINE === "in" && chartInMonth()}
              {SECTION === "month" && LINE === "out" && chartOutMonth()}
              {SECTION === "year" && LINE === "in" && chartInYear()}
              {SECTION === "year" && LINE === "out" && chartOutYear()}
            </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};