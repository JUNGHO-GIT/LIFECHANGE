// FoodDashAvg.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {handlerY} from "../../../assets/js/handlerY.js";
import {useStorage} from "../../../hooks/useStorage.jsx";
import {ComposedChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card, FormCheck} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const user_id = sessionStorage.getItem("user_id");
  const array = ["칼로리", "탄수화물", "단백질", "지방"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const [SECTION, setSECTION] = useState("month");
  const [LINE, setLINE] = useState("kcal");
  const [PART, setPART] = useState(array);

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_MONTH_DEFAULT = [
    {name:"", 칼로리: 0},
  ];
  const OBJECT_NUT_MONTH_DEFAULT = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const OBJECT_KCAL_YEAR_DEFAULT = [
    {name:"", 칼로리: 0},
  ];
  const OBJECT_NUT_YEAR_DEFAULT = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const [OBJECT_KCAL_MONTH, setOBJECT_KCAL_MONTH] = useState(OBJECT_KCAL_MONTH_DEFAULT);
  const [OBJECT_NUT_MONTH, setOBJECT_NUT_MONTH] = useState(OBJECT_NUT_MONTH_DEFAULT);
  const [OBJECT_KCAL_YEAR, setOBJECT_KCAL_YEAR] = useState(OBJECT_KCAL_YEAR_DEFAULT);
  const [OBJECT_NUT_YEAR, setOBJECT_NUT_YEAR] = useState(OBJECT_NUT_YEAR_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseMonth = await axios.get(`${URL_OBJECT}/dash/avg/month`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_KCAL_MONTH(responseMonth.data.result.kcal || OBJECT_KCAL_MONTH_DEFAULT);
    setOBJECT_NUT_MONTH(responseMonth.data.result.nut || OBJECT_NUT_MONTH_DEFAULT);

    const responseYear = await axios.get(`${URL_OBJECT}/dash/avg/year`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT_KCAL_YEAR(responseYear.data.result.kcal || OBJECT_KCAL_YEAR_DEFAULT);
    setOBJECT_NUT_YEAR(responseYear.data.result.nut || OBJECT_NUT_YEAR_DEFAULT);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartKcalMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_MONTH, array, "food");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_KCAL_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
            {PART.includes("칼로리") && (
              <Bar dataKey={"칼로리"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNutMonth = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_MONTH, array, "food");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_NUT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
            {PART.includes("탄수화물") && (
              <Bar dataKey={"탄수화물"} fill="#ffc658" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
            )}
            {PART.includes("단백질") && (
              <Bar dataKey={"단백질"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
            )}
            {PART.includes("지방") && (
              <Bar dataKey={"지방"} fill="#ff7300" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-3. chart ----------------------------------------------------------------------------------->
  const chartKcalYear = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_KCAL_YEAR, array, "food");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_KCAL_YEAR} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
            {PART.includes("칼로리") && (
              <Bar dataKey={"칼로리"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-4. chart ----------------------------------------------------------------------------------->
  const chartNutYear = () => {
    const {domain, ticks, tickFormatter} = handlerY(OBJECT_NUT_YEAR, array, "food");
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_NUT_YEAR} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
            {PART.includes("탄수화물") && (
              <Bar dataKey={"탄수화물"} fill="#ffc658" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
            )}
            {PART.includes("단백질") && (
              <Bar dataKey={"단백질"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
            )}
            {PART.includes("지방") && (
              <Bar dataKey={"지방"} fill="#ff7300" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
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
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
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

  // 12. return ----------------------------------------------------------------------------------->
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
                <option value={"month"}>월간</option>
                <option value={"year"}>연간</option>
              </select>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className={"text-center"}>
              <span className={"dash-title"}>칼로리/영양소 평균</span>
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
              {SECTION === "month" && LINE === "kcal" && chartKcalMonth()}
              {SECTION === "month" && LINE === "nut" && chartNutMonth()}
              {SECTION === "year" && LINE === "kcal" && chartKcalYear()}
              {SECTION === "year" && LINE === "nut" && chartNutYear()}
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