// DashLineMonth.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Table, FormGroup, FormLabel, FormCheck, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashLineMonth = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (line-month) (${PATH})`, ["수입", "지출"]
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"", 수입: 0, 지출: 0},
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/dash/line/month`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(response.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 4. handler ----------------------------------------------------------------------------------->
  const handlerCalcY = (value) => {
    const ticks = [];
    const maxValue = Math.max(...value?.map((item) => Math.max(item?.수입, item?.지출)));
    let topValue = Math.ceil(maxValue / 10000) * 10000;

    // topValue에 따른 동적 틱 간격 설정
    let tickInterval = 1000;
    if (tickInterval <= 0) {
      tickInterval = 10000;
    }
    else if (topValue > 10000) {
      tickInterval = 10000;
    }
    else if (topValue > 50000) {
      tickInterval = 50000;
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

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNode = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH);
    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type={"category"} dataKey={"name"} />
          <YAxis
            type={"number"}
            domain={domain}
            ticks={ticks}
            tickFormatter={tickFormatter}
          />
          {LINE.includes("수입")
            && <Line type={"monotone"} dataKey={"수입"} stroke="#8884d8" activeDot={{r: 8}} />
          }
          {LINE.includes("지출")
            && <Line type={"monotone"} dataKey={"지출"} stroke="#82ca9d" activeDot={{r: 8}} />
          }
          <Tooltip
            formatter={(value) => {
              return `₩  ${Number(value).toLocaleString()}`;
            }}
          />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <FormGroup className={"mt-20 ms-30 text-start"}>
          {["수입", "지출"]?.map((key, index) => (
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
          <Container fluid className={"d-flex"}>
            <Row className={"d-center"}>
            <Col xs={9}>
              <FormLabel className={"fs-20"}>월간 지출 / 수입</FormLabel>
              {chartNode()}
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
