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
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (line-week) (${PATH})`, ["취침", "수면", "기상"]
  );

  // 2-1. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"", 취침: 0, 수면: 0, 기상: 0},
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_SLEEP}/dash/line/week`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(response.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNode = () => {
    return (
      <ResponsiveContainer width={"100%"} height={300}>
        <LineChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type={"category"} dataKey={"name"} />
          <YAxis
            type={"number"}
            domain={[0, 30]}
            ticks={[0, 6, 12, 18, 24, 30]}
            tickFormatter={(tick) => {
              if (tick > 24) {
                return `0${tick - 24}`;
              }
              else {
                return tick;
              }
            }}
          />
          {LINE.includes("취침")
            && <Line type={"monotone"} dataKey={"취침"} stroke="#8884d8" activeDot={{ r: 8 }} />
          }
          {LINE.includes("기상")
            && <Line type={"monotone"} dataKey={"기상"} stroke="#ffc658" />
          }
          {LINE.includes("수면")
            && <Line type={"monotone"} dataKey={"수면"} stroke="#82ca9d" />
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

  // 5-3. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <FormGroup className={"mt-20 ms-30 text-start"}>
          {["취침", "수면", "기상"]?.map((key, index) => (
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
              <FormLabel className={"fs-20"}>주간 수면</FormLabel>
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
