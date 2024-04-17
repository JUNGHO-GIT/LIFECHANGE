// DashAvgWeek.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {BarChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Table, FormGroup, Form, ButtonGroup, Button, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashAvgWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (avg-week) (${PATH})`, ["수입", "지출"]
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"", 수입: 0, 지출: 0},
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/dash/avg/week`, {
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

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNode = () => {
    const {domain, ticks, tickFormatter} = handlerCalcY(DASH);
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type={"category"} dataKey={"name"} />
            <YAxis
              type={"number"}
              domain={domain}
              ticks={ticks}
              tickFormatter={tickFormatter}
            />
            {LINE.includes("수입")
              && <Bar type={"monotone"} dataKey={"수입"} fill={"#8884d8"} minPointSize={1} />
            }
            {LINE.includes("지출")
              && <Bar type={"monotone"} dataKey={"지출"} fill={"#ffc658"} minPointSize={1} />
            }
            <Tooltip
              formatter={(value) => {
                return `₩  ${Number(value).toLocaleString()}`;
              }}
            />
            <Legend />
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <Table hover responsive variant={"light"}>
        <tbody>
          <Form className={"mt-10 mb-10"}>
            {["수입", "지출"]?.map((key, index) => (
              <Form key={index} className={"fw-bold mb-10"}>
                <Form.Check
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
                ></Form.Check>
                <span>{key}</span>
              </Form>
            ))}
          </Form>
        </tbody>
      </Table>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <Row className={"d-center"}>
      <Col xs={9}>
        {chartNode()}
      </Col>
      <Col xs={3}>
        {tableNode()}
      </Col>
    </Row>
  );
};