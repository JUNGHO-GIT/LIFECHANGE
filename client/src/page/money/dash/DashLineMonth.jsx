// DashLineMonth.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {Line, LineChart} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Form, Table, Row, Col} from "react-bootstrap";

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
    if (!Array.isArray(value) || value.length === 0) {
      return { domain: [0, 0], ticks: [], tickFormatter: (tick) => `${tick}` };
    }

    const ticks = [];
    const maxValue = Math.max(...value.map((item) => Math.max(item?.수입 || 0, item?.지출 || 0)), 0);
    let topValue = Math.ceil(maxValue / 1000) * 1000;

    // topValue가 0 이하인 경우, 적절한 최소값 설정
    if (topValue <= 0) {
      topValue = 1000;
    }

    // 큰 값에 대응하기 위해 tickInterval을 조정
    let tickInterval = 1000;  // 기본 tick 간격
    if (topValue > 100000) {
      tickInterval = 10000;
    } else if (topValue > 10000) {
      tickInterval = 5000;
    }

    // tickInterval을 0으로 나눌 위험이 있는 경우 기본값으로 설정
    if (tickInterval <= 0) {
      tickInterval = 1000;
    }

    // i가 topValue 이하일 동안 반복하며 ticks 배열에 i 값을 추가
    for (let i = 0; i <= topValue; i += tickInterval) {
      ticks.push(i);
    }

    return {
      domain: [0, topValue],
      ticks: ticks,
      tickFormatter: (tick) => `${Number(tick).toFixed(1)}`
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
          <Tooltip />
          <Legend />
        </LineChart>
      </ResponsiveContainer>
    );
  };

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <Table hover responsive variant={"light"}>
        <tbody>
          <div className={"mt-10 mb-10"}>
            {["수입", "지출"]?.map((key, index) => (
              <div key={index} className={"fw-bold mb-10"}>
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
              </div>
            ))}
          </div>
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
