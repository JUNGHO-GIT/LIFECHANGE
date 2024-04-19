// DashScatterMonth.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {Scatter, ComposedChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Table, FormGroup, FormCheck, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashScatterMonth = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_WORK;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (scatter-month) (${PATH})`, ["목표", "실제"]
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [
    {name:"", 목표: 0, 실제: 0},
  ];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_OBJECT}/dash/scatter/month`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT(response.data.result || OBJECT_DEFAULT);
  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.목표, item?.실제)));
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
  const chartNode = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(OBJECT);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT} margin={{top: 20, right: 30, bottom: 20, left: 20}}>
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
              verticalAlign={"bottom"}
              align={"center"}
              wrapperStyle={{lineHeight:"40px", paddingTop:'10px'}}
              iconType={"circle"}
            ></Legend>
          </ComposedChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <CardGroup className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row className={"d-center"}>
            <Col xs={12}>
              <span className={"fs-20"}>월간 몸무게 목표 / 실제</span>
              {chartNode()}
            </Col>
            </Row>
          </Container>
        </Card>
      </CardGroup>
    </React.Fragment>
  );
};
