// DashAvgMonth.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {BarChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Table, Form, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashAvgMonth = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_SLEEP = process.env.REACT_APP_URL_SLEEP;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (avg-month) (${PATH})`, ["취침", "수면", "기상"]
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_DEFAULT = [
    {name:"", 취침: 0, 수면: 0, 기상: 0}
  ];
  const [DASH, setDASH] = useState(DASH_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseMonth = await axios.get(`${URL_SLEEP}/dash/avg/month`, {
      params: {
        user_id: user_id
      },
    });
    setDASH(responseMonth.data.result || DASH_DEFAULT);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNode = () => {
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={300}>
          <BarChart data={DASH} margin={{top: 60, right: 60, bottom: 20, left: 20}}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type={"category"} dataKey={"name"} />
            <YAxis
              type={"number"}
              domain={[0, 30]}
              ticks={[0, 6, 12, 18, 24, 30]}
              tickFormatter={(tick) => {
                return tick > 24 ? tick -= 24 : tick;
              }}
            />
            {LINE.includes("취침")
              && <Bar type={"monotone"} dataKey={"취침"} fill={"#8884d8"} />
            }
            {LINE.includes("기상")
              && <Bar type={"monotone"} dataKey={"기상"} fill={"#82ca9d"} />
            }
            {LINE.includes("수면")
              && <Bar type={"monotone"} dataKey={"수면"} fill={"#ffc658"} />
            }
            <Tooltip />
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
          <div className={"mt-10 mb-10"}>
            {["취침", "수면", "기상"]?.map((key, index) => (
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