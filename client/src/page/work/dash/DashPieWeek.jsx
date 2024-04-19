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
  const URL_WORK = process.env.REACT_APP_URL_WORK;
  const location = useLocation();
  const user_id = window.sessionStorage.getItem("user_id");
  const PATH = location.pathname?.trim()?.toString();

  // 2-1. useState -------------------------------------------------------------------------------->
  const {val:LINE, set:setLINE} = useStorage(
    `LINE (pie-week) (${PATH})`, ["파트", "타이틀"]
  );

  // 2-2. useState -------------------------------------------------------------------------------->
  const DASH_PART_DEFAULT = [
    {name:"", value: 100}
  ];
  const DASH_TITLE_DEFAULT = [
    {name:"", value: 100}
  ];
  const [DASH_PART, setDASH_PART] = useState(DASH_PART_DEFAULT);
  const [DASH_TITLE, setDASH_TITLE] = useState(DASH_TITLE_DEFAULT);

  // 2-3. useEffect ------------------------------------------------------------------------------->
  useEffect(() => {(async () => {
    const response = await axios.get(`${URL_WORK}/dash/pie/week`, {
      params: {
        user_id: user_id
      },
    });
    setDASH_PART(response.data.result.part.length > 0 ? response.data.result.part : DASH_PART_DEFAULT);
    setDASH_TITLE(response.data.result.title.length > 0 ? response.data.result.title : DASH_TITLE_DEFAULT);
  })()}, [user_id]);

  // 4-1. renderPart ------------------------------------------------------------------------------>
  const renderPart = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${DASH_PART[index].name} ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // 4-2. renderTitle ----------------------------------------------------------------------------->
  const renderTitle = ({
    cx, cy, midAngle, innerRadius, outerRadius, percent, index
  }) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central">
        {`${DASH_TITLE[index].name} ${Math.round(percent * 100)}%`}
      </text>
    );
  };

  // 5-1. chart ----------------------------------------------------------------------------------->
  const chartNodePart = () => {
    const COLORS_PART = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={DASH_PART}
              cx={"50%"}
              cy={"50%"}
              label={renderPart}
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
              {DASH_PART?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_PART[index % COLORS_PART.length]} />
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
  const chartNodeTitle = () => {
    const COLORS_TITLE = ["#FF8042", "#FFBB28", "#00C49F", "#0088FE"];
    return (
      <React.Fragment>
        <ResponsiveContainer width={"100%"} height={350}>
          <PieChart margin={{top: 20, right: 20, bottom: 20, left: 20}}>
            <Pie
              data={DASH_TITLE}
              cx={"50%"}
              cy={"50%"}
              label={renderTitle}
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
              {DASH_TITLE?.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS_TITLE[index % COLORS_TITLE.length]} />
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
              <FormLabel className={"fs-20"}>주간 상위 5개 부위 / 운동</FormLabel>
              {chartNodePart()}
            </Col>
            <Col xs={6}>
              <FormLabel className={"fs-20"}>주간 상위 5개 부위 / 운동</FormLabel>
              {chartNodeTitle()}
            </Col>
            </Row>
          </Container>
        </Card>
      </CardGroup>
    </React.Fragment>
  );
};
