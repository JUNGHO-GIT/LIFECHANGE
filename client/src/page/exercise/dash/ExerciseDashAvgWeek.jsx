// ExerciseDashAvgWeek.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {ComposedChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const ExerciseDashAvgWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_EXERCISE || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (avg-week) (${PATH})`, "volume"
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_VOLUME_DEFAULT = [
    {name:"", 볼륨: 0},
  ];
  const OBJECT_CARDIO_DEFAULT = [
    {name:"", 시간: 0},
  ];
  const [OBJECT_VOLUME, setOBJECT_VOLUME] = useState(OBJECT_VOLUME_DEFAULT);
  const [OBJECT_CARDIO, setOBJECT_CARDIO] = useState(OBJECT_CARDIO_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/dash/avg/week`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_VOLUME(response.data.result.volume || OBJECT_VOLUME_DEFAULT);
    setOBJECT_CARDIO(response.data.result.cardio || OBJECT_CARDIO_DEFAULT);
  })()}, [customer_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.볼륨, item?.시간)));
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
    else if (topValue > 100) {
      tickInterval = 100;
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
  const chartNodeVolume = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(OBJECT_VOLUME);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_VOLUME} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
            <Bar dataKey={"볼륨"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}
              onMouseEnter={(data, index) => {
                data.payload.opacity = 0.5;
              }}
              onMouseLeave={(data, index) => {
                data.payload.opacity = 1.0;
              }}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()} vol`)}
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
  const chartNodeCardio = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(OBJECT_CARDIO);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_CARDIO} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
            <Bar dataKey={"시간"} fill={"#82ca9d"} radius={[10, 10, 0, 0]} minPointSize={1}
              onMouseEnter={(data, index) => {
                data.payload.opacity = 0.5;
              }}
              onMouseLeave={(data, index) => {
                data.payload.opacity = 1.0;
              }}>
            </Bar>
            <Tooltip
              formatter={(value) => (`${Number(value).toLocaleString()} vol`)}
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
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row>
              <Col lg={8} md={8} sm={6} xs={6}>
                <span className={"dash-title"}>주간 볼륨 / 유산소시간 평균</span>
              </Col>
              <Col lg={4} md={4} sm={6} xs={6}>
                <div className={"text-end"}>
                  <span className={`${LINE === "volume" ? "text-primary" : "text-outline-primary"} dash-title-sub`} onClick={() => (setLINE("volume"))}>
                    볼륨
                  </span>
                  <span className={`${LINE === "time" ? "text-primary" : "text-outline-primary"} dash-title-sub`} onClick={() => (setLINE("time"))}>
                    시간
                  </span>
                </div>
              </Col>
            </Row>
            <Row>
              <Col lg={12} md={12} sm={12} xs={12}>
                {LINE === "volume" ? chartNodeVolume() : chartNodeCardio()}
              </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};