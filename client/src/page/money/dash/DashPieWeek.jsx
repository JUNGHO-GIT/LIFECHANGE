// DashPieWeek.jsx

import axios from "axios";
import React, {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";
import {useStorage} from "../../../assets/hooks/useStorage.jsx";
import {PieChart, Pie, Cell, ResponsiveContainer, Tooltip} from "recharts";
import {Container, Table, FormGroup, FormLabel, FormCheck, Form, ButtonGroup, Button, CardGroup, Card, Row, Col} from "react-bootstrap";

// ------------------------------------------------------------------------------------------------>
export const DashPieWeek = () => {

  // 1. common ------------------------------------------------------------------------------------>
  const URL_MONEY = process.env.REACT_APP_URL_MONEY;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (line-month) (${PATH})`, ["수입", "지출"]
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_IN_DEFAULT = [
    {name:"", value: 100}
  ];
  const DASH_OUT_DEFAULT = [
    {name:"", value: 100}
  ];
  const [DASH_IN, setDASH_IN] = useState(DASH_IN_DEFAULT);
  const [DASH_OUT, setDASH_OUT] = useState(DASH_OUT_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_MONEY}/dash/pie/week`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_IN(response.data.result.in.length > 0 ? response.data.result.in : DASH_IN_DEFAULT);
    setDASH_OUT(response.data.result.out.length > 0 ? response.data.result.out : DASH_OUT_DEFAULT);
  })()}, [user_id]);

  // 4-1. renderIn -------------------------------------------------------------------------------->
  const renderIn = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${DASH_IN[index].name} ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // 4-2. renderOut ------------------------------------------------------------------------------->
  const renderOut = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${DASH_OUT[index].name} ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodeIn = () => {
    const COLORS_IN = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={DASH_IN}
              cx={"50%"}
              cy={"50%"}
              label={renderIn}
              labelLine={false}
              outerRadius={120}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
              onMouseEnter={(data, index) => {
                data.payload.opacity = 0.5;
              }}
              onMouseLeave={(data, index) => {
                data.payload.opacity = 1.0;
              }}
            >
              {DASH_IN?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_IN[index % COLORS_IN.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`₩  ${Number(value).toLocaleString()}`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            ></Tooltip>
          </PieChart>
        </ResponsiveContainer>
      </React.Fragment>
    );
  };

  // 5-2. chart ----------------------------------------------------------------------------------->
  const chartNodeOut = () => {
    const COLORS_OUT = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={DASH_OUT}
              cx={"50%"}
              cy={"50%"}
              label={renderOut}
              labelLine={false}
              outerRadius={120}
              fill={"#8884d8"}
              dataKey={"value"}
              minAngle={15}
              onMouseEnter={(data, index) => {
                data.payload.opacity = 0.5;
              }}
              onMouseLeave={(data, index) => {
                data.payload.opacity = 1.0;
              }}
            >
              {DASH_OUT?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_OUT[index % COLORS_OUT.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value) => (`₩  ${Number(value).toLocaleString()}`)}
              contentStyle={{
                backgroundColor:"rgba(255, 255, 255, 0.8)",
                border:"none",
                borderRadius:"10px"
              }}
            ></Tooltip>
          </PieChart>
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
              <Col xs={6}>
                <FormLabel className={"fs-20"}>주간 수입 항목별 비율</FormLabel>
                {chartNodeIn()}
              </Col>
              <Col xs={6}>
                <FormLabel className={"fs-20"}>주간 지출 항목별 비율</FormLabel>
                {chartNodeOut()}
              </Col>
            </Row>
          </Container>
        </Card>
      </CardGroup>
    </React.Fragment>
  );
};
