// FoodDashLine.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {handlerY} from "../../../assets/js/handlerY.js";
import {useStorage} from "../../../hooks/useStorage.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card, FormCheck, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodDashLine = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();
  const array = ["칼로리", "탄수화물", "단백질", "지방"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SECTION, set:setSECTION} = useStorage(
    `SECTION (line) (${PATH})`, "week"
  );
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (line) (${PATH})`, "kcal"
  );
  const {val:PART, set:setPART} = useStorage(
    `PART (line) (${PATH})`, array
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_WEEK_DEFAULT = [
    {name:"", 칼로리: 0},
  ];
  const OBJECT_NUT_WEEK_DEFAULT = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const OBJECT_KCAL_MONTH_DEFAULT = [
    {name:"", 칼로리: 0},
  ];
  const OBJECT_NUT_MONTH_DEFAULT = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const [OBJECT_KCAL_WEEK, setOBJECT_KCAL_WEEK] = useState(OBJECT_KCAL_WEEK_DEFAULT);
  const [OBJECT_NUT_WEEK, setOBJECT_NUT_WEEK] = useState(OBJECT_NUT_WEEK_DEFAULT);
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState(OBJECT_KCAL_MONTH_DEFAULT);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState(OBJECT_NUT_MONTH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseWeek = await axios.get(`${URL_OBJECT}/dash/line/week`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_KCAL_WEEK(responseWeek.data.result.kcal || OBJECT_KCAL_WEEK_DEFAULT);
    setOBJECT_NUT_WEEK(responseWeek.data.result.nut || OBJECT_NUT_WEEK_DEFAULT);

    const responseMonth = await axios.get(`${URL_OBJECT}/dash/line/month`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_KCAL_MONTH(responseMonth.data.result.kcal || OBJECT_KCAL_MONTH_DEFAULT);
    setOBJECT_NUT_MONTH(responseMonth.data.result.nut || OBJECT_NUT_MONTH_DEFAULT);
  })()}, [customer_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodeKcalWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_WEEK, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_KCAL_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          ></XAxis>
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          ></YAxis>
          {PART.includes("칼로리") && (
            <Line dataKey={"칼로리"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
            activeDot={{r: 6}} />
          )}
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
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeNutWeek = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_WEEK, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_NUT_WEEK} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          ></XAxis>
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          ></YAxis>
          {PART.includes("탄수화물") && (
            <Line dataKey={"탄수화물"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
            activeDot={{r: 6}} />
          )}
          {PART.includes("단백질") && (
            <Line dataKey={"단백질"} type={"monotone"} stroke={"#82ca9d"} strokeWidth={2}
            activeDot={{r: 6}} />
          )}
          {PART.includes("지방") && (
            <Line dataKey={"지방"} type={"monotone"} stroke={"#ffc658"} strokeWidth={2}
            activeDot={{r: 6}} />
          )}
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
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartNodeKcalMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_MONTH, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_KCAL_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          ></XAxis>
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          ></YAxis>
          {PART.includes("칼로리") && (
            <Line dataKey={"칼로리"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
            activeDot={{r: 6}} />
          )}
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
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartNodeNutMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_MONTH, array);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_NUT_MONTH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray={"3 3"} stroke={"#f5f5f5"}></CartesianGrid>
          <XAxis
            type={"category"}
            dataKey={"name"}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          ></XAxis>
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
            tickLine={false}
            axisLine={false}
            tick={{fill:'#666', fontSize:14}}
          ></YAxis>
          {PART.includes("탄수화물") && (
            <Line dataKey={"탄수화물"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2}
            activeDot={{r: 6}} />
          )}
          {PART.includes("단백질") && (
            <Line dataKey={"단백질"} type={"monotone"} stroke={"#82ca9d"} strokeWidth={2}
            activeDot={{r: 6}} />
          )}
          {PART.includes("지방") && (
            <Line dataKey={"지방"} type={"monotone"} stroke={"#ffc658"} strokeWidth={2}
            activeDot={{r: 6}} />
          )}
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
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        {["탄수화물", "단백질", "지방"]?.map((key, index) => (
          <div key={index} className={"dash-checkbox flex-column mb-10"}>
            <FormCheck
              inline
              type={"switch"}
              checked={PART.includes(key)}
              onChange={() => {
                if (PART.includes(key)) {
                  setPART(PART?.filter((item) => (item !== key)));
                }
                else {
                  setPART([...PART, key]);
                }
              }}
            ></FormCheck>
            <span>{key}</span>
          </div>
        ))}
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"border-0 border-bottom ms-2vw"}>
        <Container fluid>
          <Row>
            <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setSECTION(e.target.value))}
                value={SECTION}
              >
                <option value={"week"}>주간</option>
                <option value={"month"}>월간</option>
              </select>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className={"text-center"}>
              <span className={"dash-title"}>칼로리/영양소 추이</span>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setLINE(e.target.value))}
                value={LINE}
              >
                <option value={"kcal"}>칼로리</option>
                <option value={"nut"}>영양소</option>
              </select>
            </Col>
          </Row>
          <Row>
            <Col lg={10} md={10} sm={10} xs={10}>
              {SECTION === "week" && LINE === "kcal" && chartNodeKcalWeek()}
              {SECTION === "week" && LINE === "nut" && chartNodeNutWeek()}
              {SECTION === "month" && LINE === "kcal" && chartNodeKcalMonth()}
              {SECTION === "month" && LINE === "nut" && chartNodeNutMonth()}
            </Col>
            <Col lg={2} md={2} sm={2} xs={2} style={{alignSelf:"center"}}>
              {tableNode()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};