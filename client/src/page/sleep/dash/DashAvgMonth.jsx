// DashAvgMonth.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {BarChart, Bar} from "recharts";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";
import {Container, Row, Col, Card, FormCheck} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashAvgMonth = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_OBJECT = process.env.REACT_APP_URL_SLEEP;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (avg-month) (${PATH})`, ["취침", "수면", "기상"]
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_DEFAULT = [
    {name:"", 취침: 0, 수면: 0, 기상: 0}
  ];
  const [OBJECT, setOBJECT] = useState(OBJECT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseMonth = await axios.get(`${URL_OBJECT}/dash/avg/month`, {
      params: {
        user_id: user_id
      },
    });
    setOBJECT(responseMonth.data.result || OBJECT_DEFAULT);
  })()}, [user_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNode = () => {
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <BarChart data={OBJECT} margin={{top: 10, right: 30, bottom: 20, left: 20}}
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
              domain={[0, 30]}
              ticks={[0, 6, 12, 18, 24, 30]}
              tickFormatter={(tick) => {
                return tick > 24 ? tick -= 24 : tick;
              }}
              tickLine={false}
              axisLine={{stroke:"#e0e0e0"}}
              tick={{fill:"#666", fontSize:14}}
            ></YAxis>
            {LINE.includes("취침") && (
              <Bar dataKey={"취침"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}
                onMouseEnter={(data, index) => {
                  data.payload.opacity = 0.5;
                }}
                onMouseLeave={(data, index) => {
                  data.payload.opacity = 1.0;
                }}>
              </Bar>
            )}
            {LINE.includes("기상") && (
              <Bar dataKey={"기상"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}
                onMouseEnter={(data, index) => {
                  data.payload.opacity = 0.5;
                }}
                onMouseLeave={(data, index) => {
                  data.payload.opacity = 1.0;
                }}>
              </Bar>
            )}
            {LINE.includes("수면") && (
              <Bar dataKey={"수면"} fill="#ffc658" radius={[10, 10, 0, 0]} minPointSize={1}
                onMouseEnter={(data, index) => {
                  data.payload.opacity = 0.5;
                }}
                onMouseLeave={(data, index) => {
                  data.payload.opacity = 1.0;
                }}>
              </Bar>
            )}
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
          </BarChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        <div className={"mt-20 ms-30 text-start"}>
          {["취침", "수면", "기상"]?.map((key, index) => (
            <div key={index} className={"fw-bold mb-10"}>
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
        </div>
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
                <span className={"fs-20"}>월간 수면 평균</span>
                {chartNode()}
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