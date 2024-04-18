// DashLineWeek.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Table, FormGroup, FormLabel, FormCheck, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashLineWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_FOOD = process.env.REACT_APP_URL_FOOD;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (line-week) (${PATH})`, ["탄수화물", "단백질", "지방"]
  );
  const {val:PART, set:setPART} = useStorage(
    `PART (line-week) (${PATH})`, "kcal"
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const DASH_KCAL_DEFAULT = [
    {name:"", 칼로리: 0},
  ];
  const DASH_NUT_DEFAULT = [
    {name:"", 탄수화물: 0, 단백질: 0, 지방: 0},
  ];
  const [DASH_KCAL, setDASH_KCAL] = useState(DASH_KCAL_DEFAULT);
  const [DASH_NUT, setDASH_NUT] = useState(DASH_NUT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_FOOD}/dash/line/week`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_KCAL(response.data.result.kcal || DASH_KCAL_DEFAULT);
    setDASH_NUT(response.data.result.nut || DASH_NUT_DEFAULT);
  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.칼로리, item?.탄수화물, item?.단백질, item?.지방)));
    let topValue = Math.ceil(maxValue / 10) * 10;

    // topValue에 따른 동적 틱 간격 설정
    let tickInterval = 10;
    if (topValue > 50) {
      tickInterval = 50;
    }
    else if (topValue > 10) {
      tickInterval = 10;
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
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_KCAL);
    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={DASH_KCAL} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type={"category"} dataKey={"name"} />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          <Line type={"monotone"} dataKey={"칼로리"} stroke="#8884d8" activeDot={{r: 8}} />
          <Tooltip
            formatter={(value) => {
              return `${Number(value).toLocaleString()}`;
            }}
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeNut = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH_NUT);
    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={DASH_NUT} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type={"category"} dataKey={"name"} />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          {LINE.includes("탄수화물")
            && <Line type={"monotone"} dataKey={"탄수화물"} stroke="#82ca9d" activeDot={{r: 8}} />
          }
          {LINE.includes("단백질")
            && <Line type={"monotone"} dataKey={"단백질"} stroke="#ff7300" activeDot={{r: 8}} />
          }
          {LINE.includes("지방")
            && <Line type={"monotone"} dataKey={"지방"} stroke="#ffc658" activeDot={{r: 8}} />
          }
          <Tooltip
            formatter={(value) => {
              return `${Number(value).toLocaleString()}`;
            }}
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <Button variant={`${PART === "kcal" ? "primary" : "outline-primary"}`} className={"me-5"}
          onClick={() => (setPART("kcal"))}>
          칼로리
        </Button>
        <Button variant={`${PART === "nut" ? "primary" : "outline-primary"}`} className={"ms-5"}
          onClick={() => (setPART("nut"))}>
          영양소
        </Button>
        <FormGroup className={"mt-20 ms-30 text-start"}>
          {["탄수화물", "단백질", "지방"]?.map((key, index) => (
            <Form key={index} className={"fw-bold mb-10"}>
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
            </Form>
          ))}
        </FormGroup>
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
              <Col xs={9}>
                <FormLabel className={"fs-20"}>주간 칼로리 / 영양소</FormLabel>
                {PART === "kcal" ? chartNodeKcal() : chartNodeNut()}
              </Col>
              <Col xs={3}>
                {tableNode()}
              </Col>
            </Row>
          </Container>
        </Card>
      </CardGroup>
    </React.Fragment>
  );
};
