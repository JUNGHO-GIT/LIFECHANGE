// FoodDashLineMonth.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card, FormCheck, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const FoodDashLineMonth = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_FOOD || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (line-month) (${PATH})`, ["칼로리", "탄수화물", "단백질", "지방"]
  );
  const {val:PART, set:setPART} = useStorage(
    `PART (line-month) (${PATH})`, "kcal"
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const OBJECT_KCAL_DEFAULT = [
    {name:"", 칼로리: 0},
  ];
  const OBJECT_NUT_DEFAULT = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const [OBJECT_KCAL, setOBJECT_KCAL] = useState(OBJECT_KCAL_DEFAULT);
  const [OBJECT_NUT, setOBJECT_NUT] = useState(OBJECT_NUT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/dash/line/month`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_KCAL(response.data.result.kcal || OBJECT_KCAL_DEFAULT);
    setOBJECT_NUT(response.data.result.nut || OBJECT_NUT_DEFAULT);
  })()}, [customer_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.칼로리, item?.탄수화물, item?.단백질, item?.지방)));
    let topValue = Math.ceil(maxValue / 100) * 100;

    // topValue에 따른 동적 틱 간격 설정
    let tickInterval = 10;
    if (topValue > 50) {
      tickInterval = 50;
    }
    else if (topValue > 100) {
      tickInterval = 100;
    }
    else if (topValue > 500) {
      tickInterval = 500;
    }
    else if (topValue > 1000) {
      tickInterval = 1000;
    }
    else if (topValue > 5000) {
      tickInterval = 5000;
    }
    else if (topValue > 10000) {
      tickInterval = 10000;
    }
    for (let i = 0; i <= topValue; i += tickInterval) {
      ticks.push(i);
    }
    return {
      domain: [0, topValue],
      ticks: ticks,
      tickFormatter: (tick) => (`${Number(tick).toLocaleString()}`)
    };
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodeKcal = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(OBJECT_KCAL);
    return (
      <ResponsiveContainer width={"100%"} height={350}>
        <LineChart data={OBJECT_KCAL} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
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
          {LINE.includes("칼로리") && (
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
  const chartNodeNut = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(OBJECT_NUT);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT_NUT} margin={{top: 60, right: 20, bottom: 20, left: -10}}>
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
            {LINE.includes("탄수화물") && (
              <Line dataKey={"탄수화물"} type={"monotone"} stroke={"#8884d8"} strokeWidth={2} activeDot={{r: 6}}></Line>
            )}
            {LINE.includes("단백질") && (
              <Line dataKey={"단백질"} type={"monotone"} stroke={"#82ca9d"} strokeWidth={2}
              activeDot={{r: 6}}></Line>
            )}
            {LINE.includes("지방") && (
              <Line dataKey={"지방"} type={"monotone"} stroke={"#ffc658"} strokeWidth={2}
              activeDot={{r: 6}}></Line>
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
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        {["탄수화물", "단백질", "지방"]?.map((key, index) => (
          <div key={index} className={"dash-checkbox"}>
            <FormCheck
              inline
              type={"switch"}
              checked={LINE.includes(key)}
              onChange={() => {
                if (LINE.includes(key)) {
                  setLINE(LINE?.filter((item) => (item !== key)));
                }
                else {
                  setLINE([...LINE, key]);
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
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col lg={8} md={8} sm={6} xs={6}>
                <span className={"dash-title"}>주간 칼로리 / 영양소</span>
              </Col>
              <Col lg={2} md={2} sm={3} xs={3}>
                <span className={`${PART === "kcal" ? "text-primary" : "text-outline-primary"} dash-title-sub`} onClick={() => (setPART("kcal"))}>
                  칼로리
                </span>
              </Col>
              <Col lg={2} md={2} sm={3} xs={3}>
                <span className={`${PART === "nut" ? "text-primary" : "text-outline-primary"} dash-title-sub`} onClick={() => (setPART("nut"))}>
                  영양소
                </span>
              </Col>
            </Row>
            <Row>
              <Col lg={10} md={10} sm={10} xs={10}>
                {PART === "kcal" ? chartNodeKcal() : chartNodeNut()}
              </Col>
              <Col lg={2} md={2} sm={2} xs={2}>
                {tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
