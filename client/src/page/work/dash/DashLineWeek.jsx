// DashLineWeek.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card, Button} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashLineWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_WORK;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (line-month) (${PATH})`, ["볼륨", "시간"]
  );

  // 2-1. useState -------------------------------------------------------------------------------->
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
        user_id: user_id
      },
    });
    setOBJECT_VOLUME(response.data.result.volume || OBJECT_VOLUME_DEFAULT);
    setOBJECT_CARDIO(response.data.result.cardio || OBJECT_CARDIO_DEFAULT);
  })()}, [user_id]);

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
  const chartNodeVolume = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(OBJECT_VOLUME);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT_VOLUME} margin={{top: 20, right: 30, bottom: 20, left: 20}}>
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
            <Line dataKey={"볼륨"} type={"monotone"} stroke={"#8884d8"} activeDot={{r:8}}
            strokeWidth={2}></Line>
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
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeCardio = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(OBJECT_CARDIO);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <LineChart data={OBJECT_CARDIO} margin={{top: 20, right: 30, bottom: 20, left: 20}}>
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
            <Line dataKey={"시간"} type={"monotone"} stroke={"#82ca9d"} activeDot={{r:8}}
            strokeWidth={2}></Line>
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
          </LineChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <Button variant={`${LINE === "볼륨" ? "primary" : "outline-primary"}`} className={"me-5"}
          onClick={() => setLINE("볼륨")}>
          볼륨
        </Button>
        <Button variant={`${LINE === "시간" ? "primary" : "outline-primary"}`} className={"ms-5"}
          onClick={() => setLINE("시간")}>
          시간
        </Button>
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <div className={"root-wrapper"}>
        <Card className={"container-wrapper"} border={"light"}>
          <Container>
            <Row className={"d-center"}>
              <Col xs={9}>
                <span className={"fs-20"}>주간 총볼륨 / 유산소시간</span>
                {LINE === "볼륨" ? chartNodeVolume() : chartNodeCardio()}
              </Col>
              <Col xs={3}>
                {tableNode()}
            </Col>
            </Row>
          </Container>
        </Card>
      </div>
    </React.Fragment>
  );
};
