// SleepDashAvg.tsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../hooks/useStorage.jsx";
import {ComposedChart, Bar} from "recharts";
import {Container, Row, Col, Card, FormCheck} from "react-bootstrap";
import {XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer} from "recharts";

// ------------------------------------------------------------------------------------------------>
export const SleepDashAvg = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL = process.env.REACT_APP_URL || "";
  const SUBFIX = process.env.REACT_APP_SLEEP || "";
  const URL_OBJECT = URL?.trim()?.toString() + SUBFIX?.trim()?.toString();
  const location = useLocation();
  const customer_id = sessionStorage.getItem("customer_id");
  const PATH = location.pathname?.trim()?.toString();
  const array = ["취침", "기상", "수면"];

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:SECTION, set:setSECTION} = useStorage(
    `SECTION (avg) (${PATH})`, "month"
  );
  const {val:PART, set:setPART} = useStorage(
    `PART (avg) (${PATH})`, array
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const OBJECT_MONTH_DEFAULT = [
    {name:"", 취침: 0, 기상: 0, 수면: 0}
  ];
  const OBJECT_YEAR_DEFAULT = [
    {name:"", 취침: 0, 기상: 0, 수면: 0}
  ];
  const [OBJECT_MONTH, setOBJECT_MONTH] = useState(OBJECT_MONTH_DEFAULT);
  const [OBJECT_YEAR, setOBJECT_YEAR] = useState(OBJECT_YEAR_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const responseMonth = await axios.get(`${URL_OBJECT}/dash/avg/month`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_MONTH(responseMonth.data.result || OBJECT_MONTH_DEFAULT);

    const responseYear = await axios.get(`${URL_OBJECT}/dash/avg/year`, {
      params: {
        customer_id: customer_id
      },
    });
    setOBJECT_YEAR(responseYear.data.result || OBJECT_YEAR_DEFAULT);
  })()}, [customer_id]);

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodeMonth = () => {
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_MONTH} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
            {PART.includes("취침") && (
              <Bar dataKey={"취침"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
            )}
            {PART.includes("기상") && (
              <Bar dataKey={"기상"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
            )}
            {PART.includes("수면") && (
              <Bar dataKey={"수면"} fill="#ffc658" radius={[10, 10, 0, 0]} minPointSize={1}>
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

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeYear = () => {
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <ComposedChart data={OBJECT_YEAR} margin={{top: 60, right: 20, bottom: 20, left: -20}}
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
            {PART.includes("취침") && (
              <Bar dataKey={"취침"} fill="#8884d8" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
            )}
            {PART.includes("기상") && (
              <Bar dataKey={"기상"} fill="#82ca9d" radius={[10, 10, 0, 0]} minPointSize={1}>
              </Bar>
            )}
            {PART.includes("수면") && (
              <Bar dataKey={"수면"} fill="#ffc658" radius={[10, 10, 0, 0]} minPointSize={1}>
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

  // 6-1. table ----------------------------------------------------------------------------------->
  const tableNode = () => {
    return (
      <React.Fragment>
        {["취침", "기상", "수면"]?.map((key, index) => (
          <div key={index} className={"dash-checkbox flex-column mb-10"}>
            <FormCheck
              inline
              type={"switch"}
              checked={PART.includes(key)}
              onChange={() => {
                if (PART.includes(key)) {
                  setPART(PART?.filter((item) => (item !== key)));
                }
                else {
                  setPART([...PART, key]);
                }
              }}
            ></FormCheck>
            <span>{key}</span>
          </div>
        ))}
      </React.Fragment>
    );
  };

  // 10. return ----------------------------------------------------------------------------------->
  return (
    <React.Fragment>
      <Card className={"border-0 border-bottom ms-2vw"}>
        <Container fluid={true}>
          <Row>
            <Col lg={3} md={3} sm={3} xs={3} className={"text-center"}>
              <select className={"form-select form-select-sm"}
                onChange={(e) => (setSECTION(e.target.value))}
                value={SECTION}
              >
                <option value={"month"}>월간</option>
                <option value={"year"}>연간</option>
              </select>
            </Col>
            <Col lg={6} md={6} sm={6} xs={6} className={"text-center"}>
              <span className={"dash-title"}>수면 평균</span>
            </Col>
            <Col lg={3} md={3} sm={3} xs={3}>
              <span></span>
            </Col>
          </Row>
          <Row>
            <Col lg={10} md={10} sm={10} xs={10}>
              {SECTION === "month" && chartNodeMonth()}
              {SECTION === "year" && chartNodeYear()}
            </Col>
            <Col lg={2} md={2} sm={2} xs={2} style={{alignSelf:"center"}}>
              {tableNode()}
            </Col>
          </Row>
        </Container>
      </Card>
    </React.Fragment>
  );
};